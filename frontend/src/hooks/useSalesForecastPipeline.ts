import { useQuery } from '@tanstack/react-query';
import { SALES_FORECAST } from '@/apis/endpoint.api';
import api from '@/apis/main.api';

interface PipelineFilter {
  year?: number; // unified back to number
  start_date?: string;
  end_date?: string;
  team_id?: string;
  responsible_id?: string;
  tag_id?: string;
  product_ids?: string[]; // NEW multi product filter
}

export function useSalesForecastPipeline(filter: PipelineFilter, enabled = true) {
  return useQuery({
    queryKey: ['sales-forecast-pipeline', filter],
    queryFn: async () => {
      const { data } = await api.post(SALES_FORECAST.PIPELINE, filter);
      return data;
    },
    enabled,
  });
}
