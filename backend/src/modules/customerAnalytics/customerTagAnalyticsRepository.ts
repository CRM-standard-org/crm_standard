import prisma from "../../db";

export interface CustomerTagAnalyticsFilter {
  start_date: string; // yyyy-mm-dd
  end_date: string;   // yyyy-mm-dd
  tag_id?: string;    // optional focus tag (limits scope)
  team_id?: string;
  responsible_id?: string;
}

export interface CustomerTagAnalyticsResponse {
  range: { start_date: string; end_date: string };
  customer_counts: { total_customers: number; leads: number; new_customers: number; existing_customers: number };
  customer_counts_chart: Array<{ label: string; value: number }>;
  activities_segment_chart: Array<{ segment: string; [key: string]: number | string }>;
  activities_by_tag: Array<{ tag_id: string; tag_name: string; activity_count: number }>;
  sales_by_tag: Array<{ tag_id: string; tag_name: string; total_sales: number; sales_share_percent: number }>;
  tags: Array<{ tag_id: string; tag_name: string }>;
}

const SUCCESS_STATUS = "สำเร็จ";

export const customerTagAnalyticsRepository = {
  getTagReport: async (filter: CustomerTagAnalyticsFilter): Promise<CustomerTagAnalyticsResponse> => {
    const { start_date, end_date, tag_id, team_id, responsible_id } = filter;
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    endDate.setHours(23,59,59,999);

    // Base where fragments
    const customerTagWhere = tag_id ? { customer_tags: { some: { tag_id } } } : {};
    const teamWhere = team_id ? { team_id } : {};
    const responsibleWhere = responsible_id ? { employee_id: responsible_id } : {};

    // Scope customers (active only)
    const customers = await prisma.customer.findMany({
      where: { is_active: true, ...customerTagWhere, ...teamWhere, ...responsibleWhere },
      select: { customer_id: true }
    });
    const customerIds = customers.map(c => c.customer_id);

    // Successful orders before range (for existing vs new classification)
    const successfulBefore = await prisma.saleOrder.findMany({
      where: {
        sale_order_status: SUCCESS_STATUS,
        issue_date: { lt: startDate },
        customer_id: { in: customerIds }
      },
      select: { customer_id: true }
    });
    const successfulInRange = await prisma.saleOrder.findMany({
      where: {
        sale_order_status: SUCCESS_STATUS,
        issue_date: { gte: startDate, lte: endDate },
        customer_id: { in: customerIds }
      },
      include: { customer: { include: { customer_tags: { include: { group_tag: true } } } } },
    });
    type SaleOrderWithTags = typeof successfulInRange[number];
    // Sets for classification
    const beforeSet = new Set(successfulBefore.map(o => o.customer_id));
    const inRangeSet = new Set(successfulInRange.map(o => o.customer_id));

    const newCustomersSet = new Set<string>();
    inRangeSet.forEach(cid => { if (!beforeSet.has(cid)) newCustomersSet.add(cid); });

    const successfulAnySet = new Set<string>([...beforeSet, ...inRangeSet]);

    const total_customers = customerIds.length;
    const new_customers = newCustomersSet.size;
    const existing_customers = [...successfulAnySet].filter(cid => !newCustomersSet.has(cid)).length;
    const leads = total_customers - successfulAnySet.size; // customers with no successful order at all

    // Revenue by tag (allocate full order value to each tag of the customer; if customer has multiple tags -> counted multiple)
    const revenueByTag = new Map<string, { name: string; total: number }>();
    (successfulInRange as SaleOrderWithTags[]).forEach(o => {
      if(!('customer' in o) || !o.customer) return;
      o.customer.customer_tags.forEach((ct) => {
        const id = ct.tag_id; const name = ct.group_tag?.tag_name || "";
        revenueByTag.set(id, { name, total: (revenueByTag.get(id)?.total || 0) + Number((o as any).grand_total || 0) });
      });
    });

    // Activities in range
    const activities = await prisma.activity.findMany({
      where: { issue_date: { gte: startDate, lte: endDate }, ...(team_id && { team_id }), ...(responsible_id && { responsible_id }), customer_id: { in: customerIds } },
      include: { customer: { include: { customer_tags: { include: { group_tag: true } } } } }
    });
    type ActivityWithTags = typeof activities[number];
    // Activities by tag
    const activityByTag = new Map<string, { name: string; count: number }>();
    (activities as ActivityWithTags[]).forEach(a => {
      if(!('customer' in a) || !a.customer) return;
      a.customer.customer_tags.forEach((ct) => {
        const id = ct.tag_id; const name = ct.group_tag?.tag_name || "";
        activityByTag.set(id, { name, count: (activityByTag.get(id)?.count || 0) + 1 });
      });
    });

    // Activity segments (1-6,7-12,13-18,19-24,25-end)
    function segmentForDay(d: number, lastDay: number): string {
      if (d <= 6) return '1-6';
      if (d <= 12) return '7-12';
      if (d <= 18) return '13-18';
      if (d <= 24) return '19-24';
      return `25-${lastDay}`;
    }
    const lastDay = endDate.getDate();
    const segmentMap = new Map<string, Map<string, number>>(); // segment -> (tag_id -> count)
    (activities as ActivityWithTags[]).forEach(a => {
      const day = a.issue_date.getDate();
      const seg = segmentForDay(day, lastDay);
      if (!segmentMap.has(seg)) segmentMap.set(seg, new Map());
      const inner = segmentMap.get(seg)!;
      if(!('customer' in a) || !a.customer) return;
      a.customer.customer_tags.forEach((ct) => {
        inner.set(ct.tag_id, (inner.get(ct.tag_id) || 0) + 1);
      });
    });

    // Collect unique tags encountered (or limited to filter)
    const tagSet = new Map<string, string>();
    // From revenue
    revenueByTag.forEach((v, id) => tagSet.set(id, v.name));
    // From activities
    activityByTag.forEach((v, id) => tagSet.set(id, v.name));

    // If still empty (no data) but have customers, fetch tag names for scope if filter provided
    if (tagSet.size === 0 && tag_id) {
      const tagRec = await prisma.groupTags.findUnique({ where: { tag_id }, select: { tag_id: true, tag_name: true } });
      if (tagRec) tagSet.set(tagRec.tag_id, tagRec.tag_name);
    }

    const tags = Array.from(tagSet.entries()).map(([tag_id, tag_name]) => ({ tag_id, tag_name }));

    // Build segment chart objects with dynamic keys (tag_id) default 0
    const activities_segment_chart = Array.from(segmentMap.entries())
      .sort((a,b) => a[0].localeCompare(b[0], 'th'))
      .map(([segment, counts]) => {
        const row: any = { segment };
        tags.forEach(t => { row[t.tag_id] = counts.get(t.tag_id) || 0; });
        return row;
      });

    const activities_by_tag = tags.map(t => ({ tag_id: t.tag_id, tag_name: t.tag_name, activity_count: activityByTag.get(t.tag_id)?.count || 0 }))
      .sort((a,b) => b.activity_count - a.activity_count);
    const sales_by_tag = tags.map(t => ({ tag_id: t.tag_id, tag_name: t.tag_name, total_sales: revenueByTag.get(t.tag_id)?.total || 0 }))
      .sort((a,b) => b.total_sales - a.total_sales)
      .map(s => s); // placeholder to keep chain context

    const totalSalesAllTags = sales_by_tag.reduce((acc, cur) => acc + cur.total_sales, 0) || 0;
    const sales_by_tag_with_share = sales_by_tag.map(s => ({ ...s, sales_share_percent: totalSalesAllTags ? +((s.total_sales / totalSalesAllTags) * 100).toFixed(2) : 0 }));

    const customer_counts = { total_customers, leads, new_customers, existing_customers };
    const customer_counts_chart = [
      { label: 'ลูกค้าทั้งหมด', value: total_customers },
      { label: 'ว่าที่ลูกค้า', value: leads },
      { label: 'ลูกค้าใหม่', value: new_customers },
      { label: 'ลูกค้าเดิม', value: existing_customers },
    ];

    return {
      range: { start_date, end_date },
      customer_counts,
      customer_counts_chart,
      activities_segment_chart,
      activities_by_tag,
      sales_by_tag: sales_by_tag_with_share,
      tags
    };
  }
};
