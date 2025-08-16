import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/apis/main.api';
import { SALES_FORECAST } from '@/apis/endpoint.api';

export interface ScenarioAdjustmentPayload {
  quotation_id: string;
  priority?: number;
  weight_percent?: number;
  expected_closing_date?: string | null;
}

export interface SalesForecastSummaryFilter {
  start_date?: string;
  end_date?: string;
  year?: number;
  team_id?: string;
  responsible_id?: string;
}

export interface CreateScenarioPayload {
  name: string;
  filter: SalesForecastSummaryFilter;
  adjustments: ScenarioAdjustmentPayload[];
  actor_id: string;
}

export const useListScenarios = () => {
  return useQuery({
    queryKey: ['sales-forecast-scenarios'],
    queryFn: async () => {
      const { data } = await api.get(SALES_FORECAST.SCENARIOS);
      return data;
    },
    staleTime: 60_000,
  });
};

export const useCreateScenario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateScenarioPayload) => {
      const { data } = await api.post(SALES_FORECAST.SCENARIOS, payload);
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales-forecast-scenarios'] }); },
  });
};

export const useApplyScenario = () => {
  return useMutation({
    mutationFn: async (scenario_id: string) => {
      const { data } = await api.post(SALES_FORECAST.APPLY_SCENARIO(scenario_id));
      return data;
    },
  });
};
