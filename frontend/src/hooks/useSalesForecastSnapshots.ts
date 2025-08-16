import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/apis/main.api';
import { SALES_FORECAST } from '@/apis/endpoint.api';

export interface SnapshotFilter {
  year?: number; // unified to number
  start_date?: string;
  end_date?: string;
  team_id?: string;
  responsible_id?: string;
}

export function useSalesForecastSnapshots(listParams: { team_id?: string; employee_id?: string; days?: number }, enabled = true) {
  return useQuery({
    queryKey: ['sales-forecast-snapshots', listParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (listParams.team_id) params.append('team_id', listParams.team_id);
      if (listParams.employee_id) params.append('employee_id', listParams.employee_id);
      if (listParams.days) params.append('days', String(listParams.days));
      const { data } = await api.get(`${SALES_FORECAST.SNAPSHOTS}?${params.toString()}`);
      return data;
    },
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useCreateSalesForecastSnapshot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (filter: SnapshotFilter & { actor_id?: string }) => {
      const { data } = await api.post(SALES_FORECAST.SNAPSHOT_CREATE, filter);
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales-forecast-snapshots'] }); },
  });
}
