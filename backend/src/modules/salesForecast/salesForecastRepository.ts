import prisma from '@src/db';
import { Prisma } from '@prisma/client';
import { ScenarioAdjustment, SalesForecastPipelineFilterSchema, SalesForecastSummaryFilterSchema } from './salesForecastModel';
import dayjs from 'dayjs';
import { forecastThresholds } from '@common/config/forecastConfig';

export type SalesForecastSummaryFilter = typeof SalesForecastSummaryFilterSchema._type;
export type SalesForecastPipelineFilter = typeof SalesForecastPipelineFilterSchema._type;

// Helper: fetch goals with fallback hierarchy employee > team > global
async function fetchGoalsWithFallback(year: number, employee_id?: string, team_id?: string) {
  // Try employee-specific
  if (employee_id) {
    const employeeGoals = await prisma.salesGoal.findMany({ where: { year, employee_id } });
    if (employeeGoals.length) return employeeGoals;
  }
  // Try team-specific
  if (team_id) {
    const teamGoals = await prisma.salesGoal.findMany({ where: { year, team_id, employee_id: null } });
    if (teamGoals.length) return teamGoals;
  }
  // Global goals
  const globalGoals = await prisma.salesGoal.findMany({ where: { year, team_id: null, employee_id: null } });
  return globalGoals;
}

export const salesForecastRepository = {
  getSummary: async (filter: SalesForecastSummaryFilter) => {
    // Custom range override year if provided
    const explicitStart = filter.start_date ? dayjs(filter.start_date) : null;
    const explicitEnd = filter.end_date ? dayjs(filter.end_date) : null;
    const year = filter.year || (explicitStart ? explicitStart.year() : dayjs().year());
    const start = explicitStart || dayjs(`${year}-01-01`);
    const end = explicitEnd || dayjs(`${year}-12-31`);

    // Goals with fallback hierarchy
    const goals = await fetchGoalsWithFallback(year, filter.responsible_id, filter.team_id);
    const annualGoal = goals.find(g => g.month === null)?.goal_amount.toNumber() ?? null;
    const monthlyGoals = goals.filter(g => g.month !== null).map(g => ({ month: g.month!, goal: g.goal_amount.toNumber() }));

    // Actual sales within chosen range
    const saleOrders = await prisma.saleOrder.findMany({
      where: {
        issue_date: { gte: start.toDate(), lte: end.toDate() },
        ...(filter.team_id ? { team_id: filter.team_id } : {}),
        ...(filter.responsible_id ? { responsible_employee: filter.responsible_id } : {}),
        ...(filter.tag_id ? { customer: { customer_tags: { some: { tag_id: filter.tag_id } } } } : {}),
      },
      select: { issue_date: true, grand_total: true },
    });

    const actualMonthlyMap: Record<number, number> = {};
    saleOrders.forEach(o => {
      const m = dayjs(o.issue_date).month() + 1; // 1-12
      const val = (o.grand_total as any).toNumber ? (o.grand_total as any).toNumber() : Number(o.grand_total);
      actualMonthlyMap[m] = (actualMonthlyMap[m] || 0) + val;
    });
    const actualMonthly = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, sales: actualMonthlyMap[i + 1] || 0 }));
    let cumulative = 0;
    const actualCumulative = actualMonthly.map(r => { cumulative += r.sales; return { month: r.month, sales: cumulative }; });
    const actualTotal = cumulative;

    // Weighted pipeline quotations
    const weights = await prisma.forecastWeightConfig.findMany();
    // Support both PRIORITY and STATUS types (status overrides priority if defined)
    const priorityWeights: Record<number, number> = {};
    const statusWeights: Record<string, number> = {};
    weights.forEach((w: any) => {
      const t = w.type || 'PRIORITY';
      if (t === 'STATUS' && w.status) statusWeights[w.status] = Number(w.weight_percent);
      else if (t === 'PRIORITY' && w.priority != null) priorityWeights[w.priority] = Number(w.weight_percent);
    });

  const quotations = await prisma.quotation.findMany({
      where: {
        is_active: true,
        OR: [
          { expected_closing_date: { gte: start.toDate(), lte: end.toDate() } },
          { expected_closing_date: null }, // fallback later
        ],
        quotation_status: { in: ['ระหว่างดำเนินการ','รออนุมัติ'] },
        ...(filter.team_id ? { team_id: filter.team_id } : {}),
        ...(filter.responsible_id ? { responsible_employee: filter.responsible_id } : {}),
        ...(filter.tag_id ? { customer: { customer_tags: { some: { tag_id: filter.tag_id } } } } : {}),
  ...(filter.product_ids && filter.product_ids.length ? { quotation_products: { some: { product_id: { in: filter.product_ids } } } } : {}),
      },
      select: { quotation_id: true, priority: true, grand_total: true, expected_closing_date: true, issue_date: true, quotation_status: true, customer: { select: { customer_id: true, company_name: true, priority: true } } },
    });

    let pipelineWeighted = 0;
    const customerProbMap: Record<string, { customer_id: string; company_name: string; probability: number }> = {};
    const priorityBreak: Record<number, { count: number; amount: number }> = {};
    const monthlyPipelineWeighted: Record<number, number> = {};

    const statusBreak: Record<string, { count: number, amount: number; weighted: number }> = {};
    quotations.forEach(q => {
      const rawAmount = (q.grand_total as any).toNumber ? (q.grand_total as any).toNumber() : Number(q.grand_total);
      const statusWeight = q.quotation_status ? statusWeights[q.quotation_status] : undefined;
      const priorityWeight = priorityWeights[q.priority];
      const weightPercent = statusWeight !== undefined ? statusWeight : (priorityWeight ?? 0);
      const weightedAmount = rawAmount * (weightPercent / 100);
      const closing = q.expected_closing_date ? dayjs(q.expected_closing_date) : dayjs(q.issue_date).add(30, 'day');
      if (closing.year() === year) {
        const m = closing.month() + 1;
        monthlyPipelineWeighted[m] = (monthlyPipelineWeighted[m] || 0) + weightedAmount;
      } else if (closing.isAfter(end)) {
        monthlyPipelineWeighted[12] = (monthlyPipelineWeighted[12] || 0) + weightedAmount;
      }

      pipelineWeighted += weightedAmount;
      if (q.customer) {
        const existing = customerProbMap[q.customer.customer_id];
        if (!existing || existing.probability < weightPercent) {
          customerProbMap[q.customer.customer_id] = { customer_id: q.customer.customer_id, company_name: q.customer.company_name, probability: weightPercent };
        }
      }
      if (!priorityBreak[q.priority]) priorityBreak[q.priority] = { count: 0, amount: 0 };
      priorityBreak[q.priority].count += 1;
      priorityBreak[q.priority].amount += rawAmount;

      // status accumulation
      const st = q.quotation_status || 'ไม่ระบุ';
      if (!statusBreak[st]) statusBreak[st] = { count: 0, amount: 0, weighted: 0 };
      statusBreak[st].count += 1;
      statusBreak[st].amount += rawAmount;
      statusBreak[st].weighted += weightedAmount;
    });

    const topCustomers = Object.values(customerProbMap).sort((a,b)=> b.probability - a.probability).slice(0,10);
    const priority_breakdown = Object.entries(priorityBreak).map(([p,val])=> ({ priority: Number(p), count: val.count, amount: val.amount, weight_percent: priorityWeights[Number(p)] ?? 0 })).sort((a,b)=> b.priority - a.priority);
    const status_breakdown = Object.entries(statusBreak).map(([status, val]) => ({ status, count: val.count, amount: val.amount, weighted_amount: val.weighted })).sort((a,b)=> b.amount - a.amount);

    // Improved forecast: actual + (month-specific weighted pipeline added to that month)
    const forecastMonthly = actualMonthly.map(r => ({ month: r.month, forecast: r.sales + (monthlyPipelineWeighted[r.month] || 0) }));
    let fcCum = 0; const forecastCumulative = forecastMonthly.map(r => { fcCum += r.forecast; return { month: r.month, forecast: fcCum }; });
    const forecastTotal = fcCum;

    const gap_to_goal = annualGoal ? annualGoal - forecastTotal : null;
    const achievement_percent = annualGoal ? (forecastTotal / annualGoal) * 100 : null;
    const actual_to_date = actualTotal; // total actual in range to date
    const forecast_year_end = forecastTotal; // alias for clarity
    const forecast_achievement_percent = annualGoal ? (forecast_year_end / annualGoal) * 100 : null;

    const monthsElapsed = dayjs().year() === year ? Math.min(dayjs().month() + 1, 12) : 12;
    const current_avg = monthsElapsed > 0 ? (actualTotal / monthsElapsed) : 0;
    const remainingMonths = 12 - monthsElapsed;
    const required_avg_per_remaining_month = annualGoal && remainingMonths > 0 ? Math.max(0, (annualGoal - actualTotal) / remainingMonths) : 0;

    return {
      year,
      range: { start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') },
      goals: { annual_goal: annualGoal, monthly_goals: monthlyGoals },
      actual: { monthly: actualMonthly, cumulative: actualCumulative, total: actualTotal },
      forecast: { monthly: forecastMonthly, cumulative: forecastCumulative, total: forecastTotal },
      pipeline_weighted: pipelineWeighted,
      gap_to_goal,
      achievement_percent, // (forecast total vs goal) kept for backward compat
      forecast_achievement_percent,
      actual_to_date,
      forecast_year_end,
      top_customers: topCustomers,
      priority_breakdown,
      status_breakdown,
      pace: { current_avg, required_avg_per_remaining_month },
    };
  },
  getPipeline: async (filter: SalesForecastPipelineFilter) => {
    const year = filter.year ?? new Date().getFullYear();
    const start = filter.start_date ? new Date(filter.start_date) : new Date(`${year}-01-01`);
    const end = filter.end_date ? new Date(filter.end_date) : new Date(`${year}-12-31`);
    const weights = await prisma.forecastWeightConfig.findMany();
    const priorityWeights: Record<number, number> = {};
    const statusWeights: Record<string, number> = {};
    weights.forEach((w: any) => {
      const t = w.type || 'PRIORITY';
      if (t === 'STATUS' && w.status) statusWeights[w.status] = Number(w.weight_percent);
      else if (t === 'PRIORITY' && w.priority != null) priorityWeights[w.priority] = Number(w.weight_percent);
    });
  const quotations = await prisma.quotation.findMany({
      where: {
        is_active: true,
        quotation_status: { in: ['ระหว่างดำเนินการ','รออนุมัติ'] },
        OR: [
          { expected_closing_date: { gte: start, lte: end } },
          { expected_closing_date: null },
        ],
        ...(filter.team_id ? { team_id: filter.team_id } : {}),
        ...(filter.responsible_id ? { responsible_employee: filter.responsible_id } : {}),
    ...(filter as any).tag_id ? { customer: { customer_tags: { some: { tag_id: (filter as any).tag_id } } } } : {},
  ...(filter.product_ids && filter.product_ids.length ? { quotation_products: { some: { product_id: { in: filter.product_ids } } } } : {}),
      },
      select: {
        quotation_id: true,
        quotation_number: true,
        grand_total: true,
        priority: true,
        quotation_status: true,
        expected_closing_date: true,
        issue_date: true,
        customer_id: true,
        customer: { select: { customer_id: true, company_name: true } },
        quotation_products: {
          select: {
            product_id: true,
            product: { select: { product_id: true, product_name: true } },
            quotation_item_count: true,
            unit_price: true,
          }
        }
      },
    });
    // Fetch last activity per customer (simple risk SLA)
    const customerIds = Array.from(new Set(quotations.map(q => q.customer_id)));
    let activities: { customer_id: string; last_issue: Date }[] = [];
    if (customerIds.length) {
      // Use parameterized query with explicit uuid[] cast to avoid operator mismatch (uuid = text)
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `SELECT a.customer_id, MAX(a.issue_date) AS last_issue
         FROM "Activity" a
         WHERE a.customer_id = ANY($1::uuid[])
         GROUP BY a.customer_id`,
        customerIds
      );
      activities = rows.map(r => ({ customer_id: r.customer_id, last_issue: new Date(r.last_issue) }));
    }
    const activityMap: Record<string, Date> = {};
    activities.forEach(a => { activityMap[a.customer_id] = a.last_issue; });
    const NOW = Date.now();
    const AGING_THRESHOLD = forecastThresholds.agingDays; // days since issue_date
    const NO_ACTIVITY_DAYS = forecastThresholds.noActivityDays; // days since last activity
  return quotations.map(q => {
      const amount = (q.grand_total as any).toNumber ? (q.grand_total as any).toNumber() : Number(q.grand_total);
      const statusWeight = q.quotation_status ? statusWeights[q.quotation_status] : undefined;
      const priorityWeight = priorityWeights[q.priority];
      const weight_percent = statusWeight !== undefined ? statusWeight : (priorityWeight ?? 0);
      const weighted_amount = amount * (weight_percent/100);
      const aging_days = Math.max(0, Math.floor((NOW - q.issue_date.getTime()) / 86400000));
      const lastAct = activityMap[q.customer_id];
      const days_since_last_activity = lastAct ? Math.floor((NOW - lastAct.getTime())/86400000) : null;
      const risk_flags: string[] = [];
      if (aging_days > AGING_THRESHOLD) risk_flags.push('AGING');
      if (!lastAct || (days_since_last_activity !== null && days_since_last_activity > NO_ACTIVITY_DAYS)) risk_flags.push('NO_ACTIVITY');
      if (weight_percent < 30) risk_flags.push('LOW_WEIGHT');
      const items = (q as any).quotation_products?.map((it: any) => ({
        product_id: it.product_id,
        product_name: it.product?.product_name,
        quantity: it.quotation_item_count?.toNumber ? it.quotation_item_count.toNumber() : Number(it.quotation_item_count),
        unit_price: it.unit_price?.toNumber ? it.unit_price.toNumber() : Number(it.unit_price),
      })) || [];
      return {
        quotation_id: q.quotation_id,
        quotation_number: q.quotation_number,
        customer_id: q.customer.customer_id,
        customer_name: q.customer.company_name,
        quotation_status: q.quotation_status,
        priority: q.priority,
        amount,
        weight_percent,
        weighted_amount,
        expected_closing_date: q.expected_closing_date ? q.expected_closing_date.toISOString().slice(0,10) : null,
        issue_date: q.issue_date.toISOString().slice(0,10),
        aging_days,
        days_since_last_activity,
        risk_flags,
        products: items,
      };
    });
  },
  // NEW: funnel conversion summary (basic)
  getFunnel: async (filter: SalesForecastPipelineFilter) => {
    const year = filter.year ?? new Date().getFullYear();
    const start = filter.start_date ? new Date(filter.start_date) : new Date(`${year}-01-01`);
    const end = filter.end_date ? new Date(filter.end_date) : new Date(`${year}-12-31`);
    const quotations = await prisma.quotation.findMany({
      where: {
        is_active: true,
        issue_date: { gte: start, lte: end },
        ...(filter.team_id ? { team_id: filter.team_id } : {}),
        ...(filter.responsible_id ? { responsible_employee: filter.responsible_id } : {}),
      },
      select: { quotation_id: true, quotation_status: true },
    });
    const stageCounts: Record<string, number> = {};
    quotations.forEach(q => { stageCounts[q.quotation_status] = (stageCounts[q.quotation_status]||0)+1; });
    const stages = Object.entries(stageCounts).sort((a,b)=> b[1]-a[1]);
    const total = quotations.length || 1;
    let prev = total;
    const data = stages.map(([stage,count])=> {
      const conversion_from_total = (count/total)*100;
      const conversion_from_previous = prev ? (count/prev)*100 : 0;
      prev = count;
      return { stage, count, conversion_from_total, conversion_from_previous };
    });
    return { total, stages: data };
  },
  // NEW: create snapshot (momentum)
  createSnapshot: async (filter: SalesForecastSummaryFilter, actor_id?: string) => {
    const summary = await salesForecastRepository.getSummary(filter);
    const record = await prisma.salesForecastSnapshot.upsert({
      where: { snapshot_date_team_id_employee_id: { snapshot_date: new Date(summary.range.start), team_id: (filter.team_id ?? undefined) as any, employee_id: (filter.responsible_id ?? undefined) as any } },
      update: {
        pipeline_weighted: summary.pipeline_weighted as any,
        actual_total: summary.actual.total as any,
        forecast_total: summary.forecast.total as any,
      },
      create: {
        snapshot_date: new Date(),
        team_id: filter.team_id ?? undefined,
        employee_id: filter.responsible_id ?? undefined,
        pipeline_weighted: summary.pipeline_weighted as any,
        actual_total: summary.actual.total as any,
        forecast_total: summary.forecast.total as any,
        created_by: actor_id ?? undefined,
      }
    });
    return record;
  },
  listSnapshots: async (team_id?: string, employee_id?: string, days = 30) => {
    const since = dayjs().subtract(days, 'day').toDate();
    const rows = await prisma.salesForecastSnapshot.findMany({
      where: { snapshot_date: { gte: since }, team_id: team_id ?? undefined, employee_id: employee_id ?? undefined },
      orderBy: { snapshot_date: 'asc' },
    });
    return rows;
  },
  aggregatePipelineRisks: async (filter: SalesForecastPipelineFilter) => {
    const pipeline = await salesForecastRepository.getPipeline(filter as any);
    let aging = 0, lowWeight = 0, noActivity = 0;
    (pipeline as any[]).forEach((r: any) => {
      if (r.risk_flags?.includes('AGING')) aging++;
      if (r.risk_flags?.includes('LOW_WEIGHT')) lowWeight++;
      if (r.risk_flags?.includes('NO_ACTIVITY')) noActivity++;
    });
    return { aging, lowWeight, noActivity, total: (pipeline as any[]).length };
  },
  applyScenarioAdjustments: async (adjustments: ScenarioAdjustment[]) => {
    const map = new Map<string, ScenarioAdjustment>();
    adjustments.forEach(a => map.set(a.quotation_id, a));
    return map; // used by getSummaryWithAdjustments
  },
  getSummaryWithAdjustments: async (filter: SalesForecastSummaryFilter, adjustments: ScenarioAdjustment[]) => {
    const adjMap = await salesForecastRepository.applyScenarioAdjustments(adjustments);
    // clone existing logic with adjustments injection
    const explicitStart = filter.start_date ? dayjs(filter.start_date) : null;
    const explicitEnd = filter.end_date ? dayjs(filter.end_date) : null;
    const year = filter.year || (explicitStart ? explicitStart.year() : dayjs().year());
    const start = explicitStart || dayjs(`${year}-01-01`);
    const end = explicitEnd || dayjs(`${year}-12-31`);

    // Goals with fallback hierarchy
    const goals = await fetchGoalsWithFallback(year, filter.responsible_id, filter.team_id);
    const annualGoal = goals.find(g => g.month === null)?.goal_amount.toNumber() ?? null;
    const monthlyGoals = goals.filter(g => g.month !== null).map(g => ({ month: g.month!, goal: g.goal_amount.toNumber() }));

    const saleOrders = await prisma.saleOrder.findMany({
      where: {
        issue_date: { gte: start.toDate(), lte: end.toDate() },
        ...(filter.team_id ? { team_id: filter.team_id } : {}),
        ...(filter.responsible_id ? { responsible_employee: filter.responsible_id } : {}),
        ...(filter.tag_id ? { customer: { customer_tags: { some: { tag_id: filter.tag_id } } } } : {}),
      },
      select: { issue_date: true, grand_total: true },
    });
    const actualMonthlyMap: Record<number, number> = {};
    saleOrders.forEach(o => {
      const m = dayjs(o.issue_date).month() + 1;
      const val = (o.grand_total as any).toNumber ? (o.grand_total as any).toNumber() : Number(o.grand_total);
      actualMonthlyMap[m] = (actualMonthlyMap[m] || 0) + val;
    });
    const actualMonthly = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, sales: actualMonthlyMap[i + 1] || 0 }));
    let cumulative = 0;
    const actualCumulative = actualMonthly.map(r => { cumulative += r.sales; return { month: r.month, sales: cumulative }; });
    const actualTotal = cumulative;

    const weights = await prisma.forecastWeightConfig.findMany();
    const priorityWeights: Record<number, number> = {};
    const statusWeights: Record<string, number> = {};
    weights.forEach((w: any) => {
      const t = w.type || 'PRIORITY';
      if (t === 'STATUS' && w.status) statusWeights[w.status] = Number(w.weight_percent);
      else if (t === 'PRIORITY' && w.priority != null) priorityWeights[w.priority] = Number(w.weight_percent);
    });
  const quotations = await prisma.quotation.findMany({
      where: {
        is_active: true,
        OR: [
          { expected_closing_date: { gte: start.toDate(), lte: end.toDate() } },
          { expected_closing_date: null },
        ],
        quotation_status: { in: ['ระหว่างดำเนินการ','รออนุมัติ'] },
        ...(filter.team_id ? { team_id: filter.team_id } : {}),
        ...(filter.responsible_id ? { responsible_employee: filter.responsible_id } : {}),
        ...(filter.tag_id ? { customer: { customer_tags: { some: { tag_id: filter.tag_id } } } } : {}),
  ...(filter.product_ids && filter.product_ids.length ? { quotation_products: { some: { product_id: { in: filter.product_ids } } } } : {}),
      },
      select: { quotation_id: true, priority: true, grand_total: true, expected_closing_date: true, issue_date: true, quotation_status: true, customer: { select: { customer_id: true, company_name: true, priority: true } } },
    });

    let pipelineWeighted = 0;
    const customerProbMap: Record<string, { customer_id: string; company_name: string; probability: number }> = {};
    const priorityBreak: Record<number, { count: number; amount: number }> = {};
    const monthlyPipelineWeighted: Record<number, number> = {};

    const statusBreak2: Record<string, { count: number, amount: number; weighted: number }> = {};
    quotations.forEach(q => {
      const adj = adjMap.get(q.quotation_id);
      const rawAmount = (q.grand_total as any).toNumber ? (q.grand_total as any).toNumber() : Number(q.grand_total);
      const priority = adj?.priority ?? q.priority;
      const statusWeight = q.quotation_status ? statusWeights[q.quotation_status] : undefined;
      const basePriorityWeight = priorityWeights[priority];
      const baseWeight = statusWeight !== undefined ? statusWeight : (basePriorityWeight ?? 0);
      const weightPercent = adj?.weight_percent ?? baseWeight;
      const weightedAmount = rawAmount * (weightPercent / 100);
      let closingBase;
      if (adj?.expected_closing_date) { closingBase = dayjs(adj.expected_closing_date); }
      else if (q.expected_closing_date) { closingBase = dayjs(q.expected_closing_date); }
      else { closingBase = dayjs(q.issue_date).add(30, 'day'); }
      if (closingBase.year() === year) {
        const m = closingBase.month() + 1;
        monthlyPipelineWeighted[m] = (monthlyPipelineWeighted[m] || 0) + weightedAmount;
      } else if (closingBase.isAfter(end)) {
        monthlyPipelineWeighted[12] = (monthlyPipelineWeighted[12] || 0) + weightedAmount;
      }

      pipelineWeighted += weightedAmount;
      if (q.customer) {
        const existing = customerProbMap[q.customer.customer_id];
        if (!existing || existing.probability < weightPercent) {
          customerProbMap[q.customer.customer_id] = { customer_id: q.customer.customer_id, company_name: q.customer.company_name, probability: weightPercent };
        }
      }
      if (!priorityBreak[priority]) priorityBreak[priority] = { count: 0, amount: 0 };
      priorityBreak[priority].count += 1;
      priorityBreak[priority].amount += rawAmount;
      const st = q.quotation_status || 'ไม่ระบุ';
      if (!statusBreak2[st]) statusBreak2[st] = { count: 0, amount: 0, weighted: 0 };
      statusBreak2[st].count += 1;
      statusBreak2[st].amount += rawAmount;
      statusBreak2[st].weighted += weightedAmount;
    });
    const status_breakdown = Object.entries(statusBreak2).map(([status, val]) => ({ status, count: val.count, amount: val.amount, weighted_amount: val.weighted })).sort((a,b)=> b.amount - a.amount);

    const topCustomers = Object.values(customerProbMap).sort((a,b)=> b.probability - a.probability).slice(0,10);
    const priority_breakdown = Object.entries(priorityBreak).map(([p,val])=> ({ priority: Number(p), count: val.count, amount: val.amount, weight_percent: priorityWeights[Number(p)] ?? 0 })).sort((a,b)=> b.priority - a.priority);

    const forecastMonthly = actualMonthly.map(r => ({ month: r.month, forecast: r.sales + (monthlyPipelineWeighted[r.month] || 0) }));
    let fcCum = 0; const forecastCumulative = forecastMonthly.map(r => { fcCum += r.forecast; return { month: r.month, forecast: fcCum }; });
    const forecastTotal = fcCum;
    const gap_to_goal = annualGoal ? annualGoal - forecastTotal : null; // added
    const achievement_percent = annualGoal ? (forecastTotal / annualGoal) * 100 : null; // added
    const actual_to_date = actualTotal;
    const forecast_year_end = forecastTotal;
    const forecast_achievement_percent = annualGoal ? (forecast_year_end / annualGoal) * 100 : null;

    const monthsElapsed2 = dayjs().year() === year ? Math.min(dayjs().month() + 1, 12) : 12;
    const current_avg2 = monthsElapsed2 > 0 ? (actualTotal / monthsElapsed2) : 0;
    const remainingMonths2 = 12 - monthsElapsed2;
    const required_avg_per_remaining_month2 = annualGoal && remainingMonths2 > 0 ? Math.max(0, (annualGoal - actualTotal) / remainingMonths2) : 0;

    return {
      year,
      range: { start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') },
      goals: { annual_goal: annualGoal, monthly_goals: monthlyGoals },
      actual: { monthly: actualMonthly, cumulative: actualCumulative, total: actualTotal },
      forecast: { monthly: forecastMonthly, cumulative: forecastCumulative, total: forecastTotal },
      pipeline_weighted: pipelineWeighted,
      gap_to_goal,
      achievement_percent,
      forecast_achievement_percent,
      actual_to_date,
      forecast_year_end,
      top_customers: topCustomers,
      priority_breakdown,
      status_breakdown,
      adjustments_count: adjustments.length,
      pace: { current_avg: current_avg2, required_avg_per_remaining_month: required_avg_per_remaining_month2 },
    };
  },
};
