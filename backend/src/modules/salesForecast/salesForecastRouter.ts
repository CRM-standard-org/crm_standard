import express, { Request, Response } from 'express';
import authenticateToken from '@common/middleware/authenticateToken';
import { handleServiceResponse, validateRequest } from '../../common/utils/httpHandlers';
import { salesForecastService } from './salesForecastService';
import prisma from '@src/db';
import { ServiceResponse, ResponseStatus } from '../../common/models/serviceResponse';
import { UpsertSalesGoalSchema, GetSalesGoalsSchema, UpsertForecastWeightSchema, CreateSalesForecastScenarioSchema, ApplySalesForecastScenarioSchema } from './salesForecastModel';
import { authorizeByName } from '@common/middleware/permissions';

export const salesForecastRouter = (() => {
  const router = express.Router();

  router.post('/summary', authenticateToken, async (req: Request, res: Response) => {
    const filter = req.body || {};
    const sr = await salesForecastService.getSummary(filter);
    handleServiceResponse(sr, res);
  });

  router.post('/goals', authenticateToken, authorizeByName('กำหนดเป้าหมายการขาย', ['A']), validateRequest(UpsertSalesGoalSchema), async (req, res) => {
    const { year, month = null, team_id = null, employee_id = null, goal_amount, actor_id } = req.body;
    // Find existing manual match
    const existing = await prisma.salesGoal.findFirst({ where: { year, month, team_id, employee_id } });
    let record;
    if (existing) {
      record = await prisma.salesGoal.update({ where: { sales_goal_id: existing.sales_goal_id }, data: { goal_amount, updated_by: actor_id } });
    } else {
      record = await prisma.salesGoal.create({ data: { year, month, team_id, employee_id, goal_amount, created_by: actor_id, updated_by: actor_id } });
    }
    handleServiceResponse(new ServiceResponse(ResponseStatus.Success,'saved',record,200), res);
  });
  router.get('/goals', authenticateToken, validateRequest(GetSalesGoalsSchema), async (req, res) => {
    const { year, team_id, employee_id } = req.query as any;
    const goals = await prisma.salesGoal.findMany({ where: { ...(year?{year: Number(year)}:{}), ...(team_id?{team_id:String(team_id)}:{}), ...(employee_id?{employee_id:String(employee_id)}:{}) } });
    handleServiceResponse(new ServiceResponse(ResponseStatus.Success,'ok',goals,200), res);
  });
  router.get('/weights', authenticateToken, async (_req,res)=> {
    const rows = await prisma.forecastWeightConfig.findMany();
    handleServiceResponse(new ServiceResponse(ResponseStatus.Success,'ok',rows,200), res);
  });
  router.post('/weights', authenticateToken, authorizeByName('กำหนดน้ำหนักโอกาสขาย', ['A']), validateRequest(UpsertForecastWeightSchema), async (req,res)=> {
    const { type='PRIORITY', priority, status, weight_percent, actor_id } = req.body;
    // NOTE: The following upsert relies on new Prisma schema (ForecastWeightType, composite uniques).
    // Until the migration is applied & `prisma generate` is run, TypeScript types will not include new fields.
    // We cast to any to avoid compile errors in the interim. Remove the casts after regenerating the client.
    let where: any;
    if (type === 'PRIORITY') where = { type_priority: { type, priority } };
    else where = { type_status: { type, status } };
    // @ts-ignore temporary until prisma generate
    const row = await (prisma as any).forecastWeightConfig.upsert({
      where,
      update: { weight_percent, updated_by: actor_id },
      create: { type, priority: type==='PRIORITY'?priority: null, status: type==='STATUS'?status: null, weight_percent, created_by: actor_id, updated_by: actor_id },
    });
    handleServiceResponse(new ServiceResponse(ResponseStatus.Success,'saved',row,200), res);
  });
  router.post('/pipeline', authenticateToken, async (req: Request, res: Response) => {
    const filter = req.body || {};
    const sr = await salesForecastService.getPipeline(filter);
    handleServiceResponse(sr, res);
  });
  router.post('/scenarios', authenticateToken, validateRequest(CreateSalesForecastScenarioSchema), async (req,res)=> {
    const sr = await salesForecastService.createScenario(req.body);
    handleServiceResponse(sr, res);
  });
  router.get('/scenarios', authenticateToken, async (_req,res)=> {
    const sr = await salesForecastService.listScenarios();
    handleServiceResponse(sr, res);
  });
  router.post('/scenarios/:scenario_id/apply', authenticateToken, validateRequest(ApplySalesForecastScenarioSchema), async (req,res)=> {
    const sr = await salesForecastService.applyScenario(req.params);
    handleServiceResponse(sr, res);
  });
  router.post('/funnel', authenticateToken, async (req: Request, res: Response) => {
    const filter = req.body || {};
    const sr = await salesForecastService.getFunnel(filter);
    handleServiceResponse(sr, res);
  });
  router.post('/snapshots/create', authenticateToken, async (req: Request, res: Response) => {
    const filter = req.body || {};
    const actor_id = (req as any).user?.employee_id || req.body.actor_id;
    const sr = await salesForecastService.createSnapshot(filter, actor_id);
    handleServiceResponse(sr, res);
  });
  router.get('/snapshots', authenticateToken, async (req: Request, res: Response) => {
    const { team_id, employee_id, days } = req.query as any;
    const sr = await salesForecastService.listSnapshots(team_id, employee_id, days?Number(days):undefined);
    handleServiceResponse(sr, res);
  });
  router.post('/risk-aggregate', authenticateToken, async (req: Request, res: Response) => {
    const filter = req.body || {};
    const sr = await (salesForecastService as any).getRiskAggregate(filter);
    handleServiceResponse(sr, res);
  });

  return router;
})();
