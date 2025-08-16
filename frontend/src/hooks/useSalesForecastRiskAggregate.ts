import { useQuery } from '@tanstack/react-query';
import api from '@/apis/main.api';
import { SALES_FORECAST } from '@/apis/endpoint.api';

interface RiskAggregate { aging: number; lowWeight: number; noActivity: number; total: number; }

export const useSalesForecastRiskAggregate = (payload: Record<string, unknown>, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['sales-forecast-risk-aggregate', payload],
    queryFn: async () => {
      const { data } = await api.post(SALES_FORECAST.RISK_AGGREGATE, payload);
      return data as { responseObject?: RiskAggregate };
    },
    enabled,
    staleTime: 60_000,
  });
};
