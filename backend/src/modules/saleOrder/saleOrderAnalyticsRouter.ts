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

  // Report years aggregated business analytics
  router.get("/report-years/years", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), async (req: Request, res: Response) => {
    const ServiceResponse = await saleOrderAnalyticsService.getAvailableYears();
    handleServiceResponse(ServiceResponse, res);
  });

  router.post("/report-years/business", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), async (req: Request, res: Response) => {
    const year = req.body.year as number | undefined; // Buddhist year
    const business = await saleOrderAnalyticsService.getBusinessLevelAnalytics({ year });
    const respObj: any = business.responseObject;
    if (!respObj) return handleServiceResponse(business, res);
    const months = respObj.monthlyData || [];
    const totalOrders = months.reduce((s: number, m: any) => s + m.totalOrdersCount, 0);
    const avgPerOrder = totalOrders ? respObj.totalSales / totalOrders : 0;
    const comparison = { current: { year: respObj.year, total_sales: respObj.totalSales, total_orders: totalOrders, avg_per_order: avgPerOrder } };
    const table = [
      { label: `ยอดขาย ${respObj.year - 1}`, values: new Array(12).fill(0) },
      { label: `ยอดขาย ${respObj.year}`, values: months.map((m: any) => m.totalSales) },
      { label: `%การเติบโต`, values: months.map(() => 0) },
    ];
    const chart = months.map((m: any) => ({ month: m.monthName.slice(0,3), sales_current: m.totalSales }));
    return res.status(business.statusCode).json({
      success: business.success,
      message: business.message,
      responseObject: { comparison, table, chart },
      statusCode: business.statusCode
    });
  });

  // Summary sale
  router.post("/summary-sale", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), async (req: Request, res: Response) => {
    const { start_date, end_date, tag_id, team_id, responsible_id } = req.body || {};
    const ServiceResponse = await saleOrderAnalyticsService.getSummarySale({ start_date, end_date, tag_id, team_id, responsible_id });
    handleServiceResponse(ServiceResponse, res);
  });

  return router;
})();
