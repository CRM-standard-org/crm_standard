import express, { Request, Response } from "express";
import authenticateToken from "@common/middleware/authenticateToken";
import { authorizeByName } from "@common/middleware/permissions";
import { handleServiceResponse } from "../../common/utils/httpHandlers";
import { customerAnalyticsService } from "./customerAnalyticsService";
import { customerTagAnalyticsService } from "./customerTagAnalyticsService";

export const customerAnalyticsRouter = (() => {
  const router = express.Router();

  // POST /v1/customer-analytics/report
  router.post("/report", authenticateToken, async (req: Request, res: Response) => {
    const { start_date, end_date, customer_id, tag_id, team_id, responsible_id } = req.body || {};
    const ServiceResponse = await customerAnalyticsService.getCustomerReport({ start_date, end_date, customer_id, tag_id, team_id, responsible_id });
    handleServiceResponse(ServiceResponse, res);
  });

  // POST /v1/customer-analytics/tag-report
  router.post("/tag-report", authenticateToken, async (req: Request, res: Response) => {
    const { start_date, end_date, tag_id, team_id, responsible_id } = req.body || {};
    const ServiceResponse = await customerTagAnalyticsService.getTagReport({ start_date, end_date, tag_id, team_id, responsible_id });
    handleServiceResponse(ServiceResponse, res);
  });

  return router;
})();
