import mainApi from "@/apis/main.api";

export interface YearOption { value: number; label: string; }
export interface BusinessMonthlyRow { month: string; new_customers: number; regular_customers: number; lost_customers: number; target_customers: number; }
export interface YearSalesSummary { year: number; total_sales: number; total_orders: number; avg_per_order: number; }
export interface YearComparison { previous?: YearSalesSummary; current: YearSalesSummary; target?: number; }
export interface ChartPoint { month: string; sales_current: number; sales_previous?: number; target?: number; }
export interface ReportYearResponse { comparison: YearComparison; table: Array<{ label: string; values: number[] }>; chart: ChartPoint[]; }

export const REPORT_YEARS_BUSINESS = "/v1/sale-order-analytics/report-years/business";
export const REPORT_YEARS_AVAILABLE = "/v1/sale-order-analytics/report-years/years";

interface RawYear { year?: number; value?: number; name?: string; label?: string; }

export async function fetchReportYears(year: number): Promise<ReportYearResponse> {
  const res = await mainApi.post(REPORT_YEARS_BUSINESS, { year });
  return res.data.responseObject as ReportYearResponse;
}

export async function fetchReportAvailableYears(): Promise<YearOption[]> {
  const res = await mainApi.get(REPORT_YEARS_AVAILABLE);
  const list: RawYear[] = res.data.responseObject || [];
  return list
    .map<YearOption | undefined>((y) => {
      const rawVal = y.value ?? y.year;
      if (typeof rawVal !== 'number') return undefined;
      return { value: rawVal, label: y.name || y.label || String(rawVal) };
    })
    .filter((v): v is YearOption => !!v);
}

export interface SummarySaleMetrics { activities: number; successful_sales: number; new_customers: number; existing_customers: number; sale_value_successful: number; sale_value_unsuccessful: number; }
export interface SummarySaleTopCustomer { rank: number; customer_id: string; company_name: string; total_sales: number; percent: number; }
export interface SummarySaleTopCategory { rank: number; group_product_id: string; name: string; total_sales: number; }
export interface SummarySaleTopEmployee { rank: number; employee_id: string; employee_name: string; total_sales: number; percent: number; }
export interface SummarySaleResponse { range: { start_date: string; end_date: string }; metrics: SummarySaleMetrics; top_customers: SummarySaleTopCustomer[]; top_categories: SummarySaleTopCategory[]; top_employees: SummarySaleTopEmployee[]; }

export const SUMMARY_SALE_ENDPOINT = "/v1/sale-order-analytics/summary-sale";

export async function fetchSummarySale(params: { start_date: string; end_date: string; tag_id?: string | null; team_id?: string | null; responsible_id?: string | null; }): Promise<SummarySaleResponse> {
  const { start_date, end_date, tag_id, team_id, responsible_id } = params;
  const payload: Record<string,string> = { start_date, end_date };
  if (tag_id) payload.tag_id = tag_id;
  if (team_id) payload.team_id = team_id;
  if (responsible_id) payload.responsible_id = responsible_id;
  const res = await mainApi.post(SUMMARY_SALE_ENDPOINT, payload);
  return res.data.responseObject as SummarySaleResponse;
}
