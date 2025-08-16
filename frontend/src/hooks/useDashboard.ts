import { useQuery } from '@tanstack/react-query';
import mainApi from '@/apis/main.api';
import { SALES_FORECAST } from '@/apis/endpoint.api';

export const useSalesForecastSummary = (payload: any, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['sales-forecast-summary', payload],
    queryFn: async () => {
      const resp = await mainApi.post(SALES_FORECAST.SUMMARY, payload);
      return resp.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};
