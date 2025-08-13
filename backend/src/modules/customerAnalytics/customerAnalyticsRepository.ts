import prisma from "../../db";

export interface CustomerAnalyticsFilter {
  customer_id?: string; // single customer focus (for detailed report)
  tag_id?: string;      // filter by customer tag
  team_id?: string;     // filter by team
  responsible_id?: string; // filter by employee responsible
  start_date: string;   // ISO date (yyyy-mm-dd)
  end_date: string;     // ISO date (yyyy-mm-dd)
}

export interface CustomerOrderDailyPoint {
  day: string; // DD
  orders: number; // count orders that day
}

export interface CustomerOverviewMetrics {
  total_purchase_value: number; // sum grand_total within range (successful orders)
  status: string | null; // placeholder for derived customer status (logic TBD)
  average_order_value: number; // total_purchase_value / successful_orders_count
  last_order_date: string | null; // latest successful order date (ISO)
  accumulated_purchase_value: number; // lifetime successful purchase value (all time)
  successful_orders_count: number;
  total_orders_count: number;
}

export interface CustomerPaymentTermStat {
  payment_term_name: string;
  orders_count: number;
}

export interface CustomerSuccessProductStat {
  group_product_id: string;
  group_product_name: string;
  units: number; // sum quantity
}

export interface CustomerRejectedProductStat {
  group_product_id: string;
  group_product_name: string;
  units: number; // sum quantity of items in unsuccessful orders
}

export interface CustomerAverageStats {
  avg_days_quotation_to_order: number | null; // days from quotation issue to linked sale order issue
  avg_days_order_to_payment: number | null;   // days from sale order issue to first payment log date
  quotation_to_order_conversion_rate: number; // (number of quotations that became orders)/(total quotations in range)
  avg_follow_up_activity_count: number | null; // average number of activities per customer in range
}

export interface CustomerShareStats {
  customer_revenue_share_percent: number; // this customer's successful revenue / total successful revenue (filtered scope)
  total_successful_revenue_scope: number;
}

export interface CustomerAnalyticsResponse {
  range: { start_date: string; end_date: string };
  overview: CustomerOverviewMetrics;
  order_daily_chart: CustomerOrderDailyPoint[];
  payment_terms: CustomerPaymentTermStat[];
  success_products: CustomerSuccessProductStat[];
  rejected_products: CustomerRejectedProductStat[];
  averages: CustomerAverageStats;
  share: CustomerShareStats;
}

export const customerAnalyticsRepository = {
  getCustomerReport: async (filter: CustomerAnalyticsFilter): Promise<CustomerAnalyticsResponse> => {
    const { start_date, end_date, customer_id, tag_id, team_id, responsible_id } = filter;
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    endDate.setHours(23,59,59,999);

    // Base where for sale orders within range
    const soWhere: any = {
      issue_date: { gte: startDate, lte: endDate },
      ...(team_id && { team_id }),
      ...(responsible_id && { responsible_employee: responsible_id }),
    };
    if (customer_id) soWhere.customer_id = customer_id;
    if (tag_id) soWhere.customer = { customer_tags: { some: { tag_id } } };

    const successfulStatus = "สำเร็จ";

    // Fetch sale orders in range separated
    const [successfulOrders, allOrders] = await Promise.all([
      prisma.saleOrder.findMany({
        where: { ...soWhere, sale_order_status: successfulStatus },
        select: { sale_order_id: true, issue_date: true, grand_total: true, customer_id: true, payment_term_name: true }
      }),
      prisma.saleOrder.findMany({
        where: soWhere,
        select: { sale_order_id: true, issue_date: true, grand_total: true, sale_order_status: true, customer_id: true, payment_term_name: true }
      })
    ]);

    const successful_orders_count = successfulOrders.length;
    const total_orders_count = allOrders.length;
    const total_purchase_value = successfulOrders.reduce((s,o)=> s + Number(o.grand_total), 0);
    const average_order_value = successful_orders_count ? total_purchase_value / successful_orders_count : 0;
    const last_order_date = successfulOrders.length ? successfulOrders.map(o=>o.issue_date).sort((a,b)=> b.getTime()-a.getTime())[0].toISOString().slice(0,10) : null;

    // Lifetime accumulated value for specified customer (if focus) or for all filtered customers
    let accumulated_purchase_value = 0;
    if (customer_id) {
      const lifetime = await prisma.saleOrder.findMany({ where: { customer_id, sale_order_status: successfulStatus }, select: { grand_total: true } });
      accumulated_purchase_value = lifetime.reduce((s,o)=> s + Number(o.grand_total), 0);
    } else {
      const lifetime = await prisma.saleOrder.findMany({ where: { sale_order_status: successfulStatus, ...(team_id && { team_id }), ...(responsible_id && { responsible_employee: responsible_id }) }, select: { grand_total: true } });
      accumulated_purchase_value = lifetime.reduce((s,o)=> s + Number(o.grand_total), 0);
    }

    // Daily order count chart (days within range up to 62 days recommended)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime())/(1000*60*60*24));
    const order_daily_chart: CustomerOrderDailyPoint[] = Array.from({ length: daysDiff + 1 }, (_,i)=>{
      const dayDate = new Date(startDate.getTime() + i*86400000);
      const dayStr = dayDate.toISOString().slice(0,10);
      const count = allOrders.filter(o=> o.issue_date.toISOString().slice(0,10) === dayStr).length;
      return { day: dayStr.split('-')[2], orders: count };
    });

    // Payment term stats (successful only)
    const paymentTermMap = new Map<string, number>();
    successfulOrders.forEach(o => {
      const name = o.payment_term_name || '-';
      paymentTermMap.set(name, (paymentTermMap.get(name) || 0) + 1);
    });
    const payment_terms: CustomerPaymentTermStat[] = Array.from(paymentTermMap.entries()).map(([payment_term_name, orders_count])=> ({ payment_term_name, orders_count }));

    // Success product stats (sum quantity by group_product_id in successful orders)
    const successfulItems = await prisma.saleOrderItem.findMany({ where: { sale_order: { sale_order_status: successfulStatus, sale_order_id: { in: successfulOrders.map(o=>o.sale_order_id) } } }, select: { group_product_id: true, sale_order_item_count: true, group_product: { select: { group_product_id: true, group_product_name: true } } } });
    const successProductMap = new Map<string, { name: string; units: number }>();
    successfulItems.forEach(it => { const id = it.group_product_id; const name = (it as any).group_product?.group_product_name || '-'; const units = Number(it.sale_order_item_count); successProductMap.set(id, { name, units: (successProductMap.get(id)?.units || 0) + units }); });
    const success_products = Array.from(successProductMap.entries()).sort((a,b)=> b[1].units - a[1].units).slice(0,10).map(([group_product_id, obj])=> ({ group_product_id, group_product_name: obj.name, units: obj.units }));

    // Rejected product stats (unsuccessful orders)
    const rejectedOrders = allOrders.filter(o=> o.sale_order_status !== successfulStatus);
    let rejected_products: CustomerRejectedProductStat[] = [];
    if (rejectedOrders.length) {
      const rejectedItems = await prisma.saleOrderItem.findMany({ where: { sale_order: { sale_order_status: { not: successfulStatus }, sale_order_id: { in: rejectedOrders.map(o=>o.sale_order_id) } } }, select: { group_product_id: true, sale_order_item_count: true, group_product: { select: { group_product_id: true, group_product_name: true } } } });
      const rejectedProductMap = new Map<string, { name: string; units: number }>();
      rejectedItems.forEach(it => { const id = it.group_product_id; const name = (it as any).group_product?.group_product_name || '-'; const units = Number(it.sale_order_item_count); rejectedProductMap.set(id, { name, units: (rejectedProductMap.get(id)?.units || 0) + units }); });
      rejected_products = Array.from(rejectedProductMap.entries()).sort((a,b)=> b[1].units - a[1].units).slice(0,10).map(([group_product_id, obj])=> ({ group_product_id, group_product_name: obj.name, units: obj.units }));
    }

    // Average stats (quotation to order conversion etc.)
    // Find quotations in range (filtered by customer/team/responsible/tag via customer relation)
    const quotationWhere: any = {
      issue_date: { gte: startDate, lte: endDate },
      ...(team_id && { team_id }),
      ...(responsible_id && { responsible_employee: responsible_id }),
    };
    if (customer_id) quotationWhere.customer_id = customer_id;
    if (tag_id) quotationWhere.customer = { customer_tags: { some: { tag_id } } };

    const quotations = await prisma.quotation.findMany({ where: quotationWhere, select: { quotation_id: true, issue_date: true, sale_order: { select: { issue_date: true } } } });
    const quotationsWithOrder = quotations.filter(q => q.sale_order.length > 0);
    const avg_days_quotation_to_order = quotationsWithOrder.length ? quotationsWithOrder.reduce((s,q)=> s + (q.sale_order[0].issue_date.getTime() - q.issue_date.getTime())/(1000*60*60*24),0) / quotationsWithOrder.length : null;
    const quotation_to_order_conversion_rate = quotations.length ? (quotationsWithOrder.length / quotations.length) * 100 : 0;

    // Order to payment (first payment log)
    const paymentLogs = await prisma.saleOrderPaymentLog.findMany({ where: { sale_order_id: { in: allOrders.map(o=>o.sale_order_id) } }, select: { sale_order_id: true, payment_date: true } });
    const logsByOrder = new Map<string, Date>();
    paymentLogs.forEach(pl => { const existing = logsByOrder.get(pl.sale_order_id); if (!existing || pl.payment_date < existing) logsByOrder.set(pl.sale_order_id, pl.payment_date); });
    const ordersWithFirstPayment = allOrders.filter(o=> logsByOrder.has(o.sale_order_id));
    const avg_days_order_to_payment = ordersWithFirstPayment.length ? ordersWithFirstPayment.reduce((s,o)=> s + ((logsByOrder.get(o.sale_order_id)!.getTime() - o.issue_date.getTime())/(1000*60*60*24)), 0) / ordersWithFirstPayment.length : null;

    // Average follow-up activity count (activities per customer)
    const activityWhere: any = { issue_date: { gte: startDate, lte: endDate }, ...(team_id && { team_id }), ...(responsible_id && { responsible_id }) };
    if (customer_id) activityWhere.customer_id = customer_id;
    if (tag_id) activityWhere.customer = { customer_tags: { some: { tag_id } } };
    const activities = await prisma.activity.findMany({ where: activityWhere, select: { customer_id: true } });
    const activitiesPerCustomer = new Map<string, number>();
    activities.forEach(a => { activitiesPerCustomer.set(a.customer_id, (activitiesPerCustomer.get(a.customer_id) || 0) + 1); });
    const avg_follow_up_activity_count = activitiesPerCustomer.size ? Array.from(activitiesPerCustomer.values()).reduce((s,v)=> s+v,0) / activitiesPerCustomer.size : null;

    // Revenue share (only if focusing a single customer)
    let customer_revenue_share_percent = 0;
    let total_successful_revenue_scope = 0;
    if (customer_id) {
      // total successful revenue in scope (filtered by team/responsible/tag)
      const scopeWhere: any = { sale_order_status: successfulStatus, issue_date: { gte: startDate, lte: endDate } };
      if (team_id) scopeWhere.team_id = team_id;
      if (responsible_id) scopeWhere.responsible_employee = responsible_id;
      if (tag_id) scopeWhere.customer = { customer_tags: { some: { tag_id } } };
      const scopeOrders = await prisma.saleOrder.findMany({ where: scopeWhere, select: { grand_total: true, customer_id: true } });
      total_successful_revenue_scope = scopeOrders.reduce((s,o)=> s + Number(o.grand_total), 0);
      const custRevenue = scopeOrders.filter(o=> o.customer_id === customer_id).reduce((s,o)=> s + Number(o.grand_total), 0);
      customer_revenue_share_percent = total_successful_revenue_scope ? (custRevenue / total_successful_revenue_scope) * 100 : 0;
    }

    const overview: CustomerOverviewMetrics = {
      total_purchase_value,
      status: null, // future enhancement
      average_order_value,
      last_order_date,
      accumulated_purchase_value,
      successful_orders_count,
      total_orders_count,
    };

    const averages: CustomerAverageStats = {
      avg_days_quotation_to_order: avg_days_quotation_to_order !== null ? +avg_days_quotation_to_order.toFixed(2) : null,
      avg_days_order_to_payment: avg_days_order_to_payment !== null ? +avg_days_order_to_payment.toFixed(2) : null,
      quotation_to_order_conversion_rate: +quotation_to_order_conversion_rate.toFixed(2),
      avg_follow_up_activity_count: avg_follow_up_activity_count !== null ? +avg_follow_up_activity_count.toFixed(2) : null,
    };

    const share: CustomerShareStats = {
      customer_revenue_share_percent: +customer_revenue_share_percent.toFixed(2),
      total_successful_revenue_scope,
    };

    return {
      range: { start_date, end_date },
      overview,
      order_daily_chart,
      payment_terms,
      success_products,
      rejected_products,
      averages,
      share
    };
  }
};
