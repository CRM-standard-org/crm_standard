import express, { Request, Response } from "express";
import { handleServiceResponse } from "../../common/utils/httpHandlers";
import authenticateToken from "@common/middleware/authenticateToken";
import { authorizeByName } from "@common/middleware/permissions";
import { saleOrderAnalyticsService } from "./saleOrderAnalyticsService";

export const saleOrderAnalyticsRouter = (() => {
  const router = express.Router();

  // Get available years
  router.get("/years", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), async (req: Request, res: Response) => {
    const ServiceResponse = await saleOrderAnalyticsService.getAvailableYears();
    handleServiceResponse(ServiceResponse, res);
  });

  // Get business level analytics
  router.post("/business", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), async (req: Request, res: Response) => {
    const filter = req.body;
    const ServiceResponse = await saleOrderAnalyticsService.getBusinessLevelAnalytics(filter);
    handleServiceResponse(ServiceResponse, res);
  });

  // Get team level analytics
  router.post("/team", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), async (req: Request, res: Response) => {
    const filter = req.body;
    const ServiceResponse = await saleOrderAnalyticsService.getTeamLevelAnalyticsPaginated(filter);
    handleServiceResponse(ServiceResponse, res);
  });

  // Get personal level analytics
  router.post("/personal", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), async (req: Request, res: Response) => {
    const filter = req.body;
    const ServiceResponse = await saleOrderAnalyticsService.getPersonalLevelAnalyticsPaginated(filter);
    handleServiceResponse(ServiceResponse, res);
  });

  return router;
})();
