import mainApi from "@/apis/main.api";
import {
  GET_SALES_ANALYTICS_YEARS,
  GET_SALES_ANALYTICS_BUSINESS,
  GET_SALES_ANALYTICS_TEAM,
  GET_SALES_ANALYTICS_PERSONAL
} from "@/apis/endpoint.api";
import {
  SalesAnalyticsFilter,
  BusinessLevelData,
  TeamLevelData,
  PersonalLevelData,
  YearOption,
  SalesAnalyticsResponse
} from "@/types/requests/request.salesAnalytics";

// Extended interface for pagination support
interface SalesAnalyticsFilterWithPagination extends SalesAnalyticsFilter {
  page?: string;
  pageSize?: string;
  searchText?: string;
}

// Response interface with pagination data
interface PaginatedSalesAnalyticsResponse<T> extends SalesAnalyticsResponse<{
  data: T;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {}

// Get available years
export const getSalesAnalyticsYears = async (): Promise<SalesAnalyticsResponse<YearOption[]>> => {
  try {
    const { data: response } = await mainApi.get<SalesAnalyticsResponse<YearOption[]>>(
      GET_SALES_ANALYTICS_YEARS
    );
    return response;
  } catch (error) {
    console.error("Error getting sales analytics years", error);
    throw error;
  }
};

// Get business level analytics
export const getBusinessLevelAnalytics = async (filter: SalesAnalyticsFilterWithPagination): Promise<SalesAnalyticsResponse<BusinessLevelData>> => {
  try {
    const { data: response } = await mainApi.post<SalesAnalyticsResponse<BusinessLevelData>>(
      GET_SALES_ANALYTICS_BUSINESS,
      filter
    );
    return response;
  } catch (error) {
    console.error("Error getting business level analytics", error);
    throw error;
  }
};

// Get team level analytics with pagination
export const getTeamLevelAnalytics = async (filter: SalesAnalyticsFilterWithPagination): Promise<PaginatedSalesAnalyticsResponse<TeamLevelData[]>> => {
  try {
    // Add pagination parameters to URL if provided
    const params = new URLSearchParams();
    if (filter.page) params.append('page', filter.page);
    if (filter.pageSize) params.append('limit', filter.pageSize);
    if (filter.searchText) params.append('search', filter.searchText);
    
    const url = `${GET_SALES_ANALYTICS_TEAM}${params.toString() ? `?${params.toString()}` : ''}`;
    
    const { data: response } = await mainApi.post<PaginatedSalesAnalyticsResponse<TeamLevelData[]>>(
      url,
      { year: filter.year }
    );
    return response;
  } catch (error) {
    console.error("Error getting team level analytics", error);
    throw error;
  }
};

// Get personal level analytics with pagination
export const getPersonalLevelAnalytics = async (filter: SalesAnalyticsFilterWithPagination): Promise<PaginatedSalesAnalyticsResponse<PersonalLevelData[]>> => {
  try {
    // Add pagination parameters to URL if provided
    const params = new URLSearchParams();
    if (filter.page) params.append('page', filter.page);
    if (filter.pageSize) params.append('limit', filter.pageSize);
    if (filter.searchText) params.append('search', filter.searchText);
    
    const url = `${GET_SALES_ANALYTICS_PERSONAL}${params.toString() ? `?${params.toString()}` : ''}`;
    
    const { data: response } = await mainApi.post<PaginatedSalesAnalyticsResponse<PersonalLevelData[]>>(
      url,
      { year: filter.year }
    );
    return response;
  } catch (error) {
    console.error("Error getting personal level analytics", error);
    throw error;
  }
};
