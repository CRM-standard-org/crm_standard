import mainApi from "@/apis/main.api";

export interface CustomerTagAnalyticsParams { start_date: string; end_date: string; tag_id?: string; team_id?: string; responsible_id?: string; }
export interface CustomerTagCountRow { label: string; value: number; }
export interface CustomerTagCounts { total_customers: number; leads: number; new_customers: number; existing_customers: number; }
export interface CustomerTagActivitySegmentRow { segment: string; [key: string]: number | string; }
export interface CustomerTagActivityByTag { tag_id: string; tag_name: string; activity_count: number; }
export interface CustomerTagSalesByTag { tag_id: string; tag_name: string; total_sales: number; sales_share_percent: number; }
export interface CustomerTagAnalyticsResponse {
  range: { start_date: string; end_date: string };
  customer_counts: CustomerTagCounts;
  customer_counts_chart: CustomerTagCountRow[];
  activities_segment_chart: CustomerTagActivitySegmentRow[];
  activities_by_tag: CustomerTagActivityByTag[];
  sales_by_tag: CustomerTagSalesByTag[];
  tags: Array<{ tag_id: string; tag_name: string }>;
}

export async function fetchCustomerTagAnalytics(params: CustomerTagAnalyticsParams): Promise<CustomerTagAnalyticsResponse> {
  const res = await mainApi.post('/v1/customer-analytics/tag-report', params);
  return res.data.responseObject as CustomerTagAnalyticsResponse;
}
