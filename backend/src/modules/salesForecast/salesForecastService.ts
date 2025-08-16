import { ServiceResponse, ResponseStatus } from '../../common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { salesForecastRepository } from './salesForecastRepository';
import { SalesForecastSummaryFilterSchema, SalesForecastPipelineFilterSchema, CreateSalesForecastScenarioSchema, ApplySalesForecastScenarioSchema } from './salesForecastModel';
import prisma from '@src/db';

export const salesForecastService = {
  getSummary: async (filter: any) => {
    try {
      const parsed = SalesForecastSummaryFilterSchema.parse(filter);
      if (parsed.scenario_id) {
        const scenario = await prisma.salesForecastScenario.findFirst({ where: { sales_forecast_scenario_id: parsed.scenario_id } });
        if (scenario) {
          const summary = await salesForecastRepository.getSummaryWithAdjustments(scenario.filter as any, scenario.adjustments as any);
          return new ServiceResponse(ResponseStatus.Success, 'Get sales forecast summary with scenario', { scenario, summary }, StatusCodes.OK);
        }
      }
      const data = await salesForecastRepository.getSummary(parsed);
      return new ServiceResponse(ResponseStatus.Success, 'Get sales forecast summary success', data, StatusCodes.OK);
    } catch (ex: any) {
      return new ServiceResponse(ResponseStatus.Failed, ex.message, null, StatusCodes.BAD_REQUEST);
    }
  },
  getPipeline: async (filter: any) => {
    try {
      const parsed = SalesForecastPipelineFilterSchema.parse(filter);
      const data = await salesForecastRepository.getPipeline(parsed);
      return new ServiceResponse(ResponseStatus.Success, 'Get sales forecast pipeline success', data, StatusCodes.OK);
    } catch (ex: any) {
      return new ServiceResponse(ResponseStatus.Failed, ex.message, null, StatusCodes.BAD_REQUEST);
    }
  },
  createScenario: async (body: any) => {
    try {
      const parsed = CreateSalesForecastScenarioSchema.parse({ body }).body;
      const { name, filter, adjustments, actor_id } = parsed;
      const summary = await salesForecastRepository.getSummaryWithAdjustments(filter, adjustments);
      const created = await prisma.salesForecastScenario.create({ data: { name, adjustments, filter, result_summary: summary, created_by: actor_id, updated_by: actor_id } });
      return new ServiceResponse(ResponseStatus.Success, 'Scenario created', { scenario: created, summary }, StatusCodes.OK);
    } catch (ex: any) {
      return new ServiceResponse(ResponseStatus.Failed, ex.message, null, StatusCodes.BAD_REQUEST);
    }
  },
  applyScenario: async (params: any) => {
    try {
      const parsed = ApplySalesForecastScenarioSchema.parse({ params }).params;
      const scenario = await prisma.salesForecastScenario.findFirst({ where: { sales_forecast_scenario_id: parsed.scenario_id } });
      if (!scenario) return new ServiceResponse(ResponseStatus.Failed, 'Not found', null, StatusCodes.NOT_FOUND);
      const summary = await salesForecastRepository.getSummaryWithAdjustments(scenario.filter as any, scenario.adjustments as any);
      return new ServiceResponse(ResponseStatus.Success, 'Scenario applied', { scenario, summary }, StatusCodes.OK);
    } catch (ex: any) {
      return new ServiceResponse(ResponseStatus.Failed, ex.message, null, StatusCodes.BAD_REQUEST);
    }
  },
  listScenarios: async () => {
    try {
      const rows = await prisma.salesForecastScenario.findMany({ orderBy: { created_at: 'desc' } });
      return new ServiceResponse(ResponseStatus.Success, 'ok', rows, StatusCodes.OK);
    } catch (ex: any) {
      return new ServiceResponse(ResponseStatus.Failed, ex.message, null, StatusCodes.BAD_REQUEST);
    }
  },
  async getFunnel(filter: any) {
    try {
      const data = await salesForecastRepository.getFunnel(filter);
      return new ServiceResponse(ResponseStatus.Success, 'Funnel fetched', data, StatusCodes.OK);
    } catch (e: any) {
      return new ServiceResponse(ResponseStatus.Failed, 'Failed to fetch funnel', e.message, StatusCodes.BAD_REQUEST);
    }
  },
  async createSnapshot(filter: any, actor_id?: string) {
    try {
      const data = await salesForecastRepository.createSnapshot(filter, actor_id);
      return new ServiceResponse(ResponseStatus.Success, 'Snapshot created', data, StatusCodes.OK);
    } catch (e: any) {
      return new ServiceResponse(ResponseStatus.Failed, 'Failed to create snapshot', e.message, StatusCodes.BAD_REQUEST);
    }
  },
  async listSnapshots(team_id?: string, employee_id?: string, days?: number) {
    try {
      const data = await salesForecastRepository.listSnapshots(team_id, employee_id, days);
      return new ServiceResponse(ResponseStatus.Success, 'Snapshots fetched', data, StatusCodes.OK);
    } catch (e: any) {
      return new ServiceResponse(ResponseStatus.Failed, 'Failed to list snapshots', e.message, StatusCodes.BAD_REQUEST);
    }
  },
  async getRiskAggregate(filter: any) {
    try {
      const data = await (salesForecastRepository as any).aggregatePipelineRisks(filter);
      return new ServiceResponse(ResponseStatus.Success, 'Risk aggregate fetched', data, StatusCodes.OK);
    } catch (e: any) {
      return new ServiceResponse(ResponseStatus.Failed, 'Failed to aggregate risks', e.message, StatusCodes.BAD_REQUEST);
    }
  },
};
