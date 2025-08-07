export interface SalesAnalyticsFilter {
  year?: number;
  start_date?: string;
  end_date?: string;
  team_id?: string;
  responsible_id?: string;
}

export interface MonthlySalesData {
  month: number;
  monthName: string;
  totalSales: number;
  completedSales: number;
  pendingSales: number;
  successfulOrdersCount: number;
  totalOrdersCount: number;
}

export interface BusinessLevelData {
  year: number;
  totalSales: number;
  monthlyData: MonthlySalesData[];
}

export interface TeamLevelData {
  team_id: string;
  team_name: string;
  year: number;
  totalSales: number;
  monthlyData: MonthlySalesData[];
}

export interface PersonalLevelData {
  employee_id: string;
  employee_name: string;
  team_id: string;
  team_name: string;
  year: number;
  totalSales: number;
  monthlyData: MonthlySalesData[];
}

export interface YearOption {
  id: number;
  name: string;
}

export type SalesAnalyticsResponse<T> = {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;
};
