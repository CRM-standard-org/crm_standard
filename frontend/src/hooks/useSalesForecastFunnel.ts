import { useQuery } from '@tanstack/react-query';
import api from '@/apis/main.api';
import { SALES_FORECAST } from '@/apis/endpoint.api';

export interface FunnelFilter {
  year?: number; // unified to number
  start_date?: string;
  end_date?: string;
  team_id?: string;
  responsible_id?: string;
  tag_id?: string;
  product_ids?: string[]; // NEW
}

export function useSalesForecastFunnel(filter: FunnelFilter, enabled = true) {
  return useQuery({
    queryKey: ['sales-forecast-funnel', filter],
    queryFn: async () => {
      const { data } = await api.post(SALES_FORECAST.FUNNEL, filter);
      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
