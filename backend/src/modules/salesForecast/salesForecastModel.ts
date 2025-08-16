import { z } from 'zod';

export const SalesForecastSummaryFilterSchema = z.object({
  start_date: z.string().optional(), // ISO date
  end_date: z.string().optional(),
  year: z.number().int().optional(),
  team_id: z.string().uuid().optional(),
  responsible_id: z.string().uuid().optional(),
  tag_id: z.string().uuid().optional(), // NEW for customer tag drill-down
  scenario_id: z.string().uuid().optional(), // apply scenario if provided
  product_ids: z.array(z.string().uuid()).optional(), // NEW multi-product filter
});

// New schemas
export const UpsertSalesGoalSchema = z.object({
  body: z.object({
    year: z.number().int().min(2000).max(2100),
    month: z.number().int().min(1).max(12).nullable().optional(),
    team_id: z.string().uuid().nullable().optional(),
    employee_id: z.string().uuid().nullable().optional(),
    goal_amount: z.number().nonnegative(),
    actor_id: z.string().uuid(),
  }),
});

export const GetSalesGoalsSchema = z.object({
  query: z.object({
    year: z.string().regex(/^\d{4}$/).optional(),
    team_id: z.string().uuid().optional(),
    employee_id: z.string().uuid().optional(),
  }),
});

export const UpsertForecastWeightSchema = z.object({
  body: z.object({
    type: z.enum(['PRIORITY', 'STATUS']).default('PRIORITY'),
    priority: z.number().int().min(1).max(5).optional(),
    status: z.string().min(1).max(50).optional(),
    weight_percent: z.number().min(0).max(100),
    actor_id: z.string().uuid(),
  }).refine(d => d.type === 'PRIORITY' ? d.priority !== undefined : true, { message: 'priority required for PRIORITY type', path: ['priority'] })
    .refine(d => d.type === 'STATUS' ? !!d.status : true, { message: 'status required for STATUS type', path: ['status'] }),
});

export const SalesForecastPipelineFilterSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  year: z.number().int().optional(), // unified to number
  team_id: z.string().uuid().optional(),
  responsible_id: z.string().uuid().optional(),
  tag_id: z.string().uuid().optional(), // NEW
  product_ids: z.array(z.string().uuid()).optional(), // NEW
});

export const ScenarioAdjustmentSchema = z.object({
  quotation_id: z.string(),
  priority: z.number().int().min(1).max(5).optional(),
  weight_percent: z.number().min(0).max(100).optional(),
  expected_closing_date: z.string().optional(), // ISO date
});

export const CreateSalesForecastScenarioSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    filter: SalesForecastSummaryFilterSchema,
    adjustments: z.array(ScenarioAdjustmentSchema),
    actor_id: z.string().uuid(),
  }),
});

export const ApplySalesForecastScenarioSchema = z.object({
  params: z.object({ scenario_id: z.string().uuid() }),
});

export type SalesForecastPipelineFilter = z.infer<typeof SalesForecastPipelineFilterSchema>;
export type ScenarioAdjustment = z.infer<typeof ScenarioAdjustmentSchema>;

export interface SalesForecastSummaryResponse {
  year: number;
  range: { start: string; end: string };
  goals: {
    annual_goal: number | null;
    monthly_goals: { month: number; goal: number }[];
  };
  actual: {
    monthly: { month: number; sales: number }[];
    cumulative: { month: number; sales: number }[];
    total: number;
  };
  forecast: {
    monthly: { month: number; forecast: number }[];
    cumulative: { month: number; forecast: number }[];
    total: number;
  };
  pipeline_weighted: number;
  gap_to_goal: number | null;
  achievement_percent: number | null;
  top_customers: { customer_id: string; company_name: string; probability: number }[];
  priority_breakdown: { priority: number; count: number; amount: number; weight_percent: number }[];
}

export interface SalesForecastScenarioSummary extends SalesForecastSummaryResponse {
  scenario_id?: string;
  name?: string;
}

export interface SalesForecastPipelineQuotation {
  quotation_id: string;
  quotation_number: string;
  customer_id: string;
  customer_name: string;
  priority: number;
  amount: number;
  weight_percent: number;
  weighted_amount: number;
  expected_closing_date: string | null;
  issue_date: string;
}
