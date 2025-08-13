import mainApi from "@/apis/main.api";

export interface CustomerAnalyticsParams { start_date: string; end_date: string; customer_id?: string; tag_id?: string; team_id?: string; responsible_id?: string; }
export interface CustomerOrderDailyPoint { day: string; orders: number; }
export interface CustomerOverviewMetrics { total_purchase_value: number; status: string | null; average_order_value: number; last_order_date: string | null; accumulated_purchase_value: number; successful_orders_count: number; total_orders_count: number; }
export interface CustomerPaymentTermStat { payment_term_name: string; orders_count: number; }
export interface CustomerSuccessProductStat { group_product_id: string; group_product_name: string; units: number; }
export interface CustomerRejectedProductStat { group_product_id: string; group_product_name: string; units: number; }
export interface CustomerAverageStats { avg_days_quotation_to_order: number | null; avg_days_order_to_payment: number | null; quotation_to_order_conversion_rate: number; avg_follow_up_activity_count: number | null; }
export interface CustomerShareStats { customer_revenue_share_percent: number; total_successful_revenue_scope: number; }
export interface CustomerAnalyticsResponse { range: { start_date: string; end_date: string }; overview: CustomerOverviewMetrics; order_daily_chart: CustomerOrderDailyPoint[]; payment_terms: CustomerPaymentTermStat[]; success_products: CustomerSuccessProductStat[]; rejected_products: CustomerRejectedProductStat[]; averages: CustomerAverageStats; share: CustomerShareStats; }

export async function fetchCustomerAnalytics(params: CustomerAnalyticsParams): Promise<CustomerAnalyticsResponse> {
  const res = await mainApi.post('/v1/customer-analytics/report', params);
  return res.data.responseObject as CustomerAnalyticsResponse;
}
