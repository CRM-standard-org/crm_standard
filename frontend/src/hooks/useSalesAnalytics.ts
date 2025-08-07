import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  getSalesAnalyticsYears,
  getBusinessLevelAnalytics,
  getTeamLevelAnalytics,
  getPersonalLevelAnalytics
} from "@/services/salesAnalytics.service";

// Extended interface for pagination support
interface SalesAnalyticsFilterWithPagination {
  year: number;
  page?: string;
  pageSize?: string;
  searchText?: string;
}

// Hook for getting available years
function fetchSalesAnalyticsYears() {
  return queryOptions({
    queryKey: ["getSalesAnalyticsYears"],
    queryFn: () => getSalesAnalyticsYears(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });
}

export const useSalesAnalyticsYears = () => {
  return useQuery(fetchSalesAnalyticsYears());
};

// Hook for business level analytics
function fetchBusinessLevelAnalytics(filter: SalesAnalyticsFilterWithPagination) {
  return queryOptions({
    queryKey: ["getBusinessLevelAnalytics", filter],
    queryFn: () => getBusinessLevelAnalytics(filter),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    enabled: !!filter.year,
  });
}

export const useBusinessLevelAnalytics = (filter: SalesAnalyticsFilterWithPagination) => {
  return useQuery(fetchBusinessLevelAnalytics(filter));
};

// Hook for team level analytics
function fetchTeamLevelAnalytics(filter: SalesAnalyticsFilterWithPagination) {
  return queryOptions({
    queryKey: ["getTeamLevelAnalytics", filter],
    queryFn: () => getTeamLevelAnalytics(filter),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    enabled: !!filter.year,
  });
}

export const useTeamLevelAnalytics = (filter: SalesAnalyticsFilterWithPagination) => {
  return useQuery(fetchTeamLevelAnalytics(filter));
};

// Hook for personal level analytics
function fetchPersonalLevelAnalytics(filter: SalesAnalyticsFilterWithPagination) {
  return queryOptions({
    queryKey: ["getPersonalLevelAnalytics", filter],
    queryFn: () => getPersonalLevelAnalytics(filter),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    enabled: !!filter.year,
  });
}

export const usePersonalLevelAnalytics = (filter: SalesAnalyticsFilterWithPagination) => {
  return useQuery(fetchPersonalLevelAnalytics(filter));
};
