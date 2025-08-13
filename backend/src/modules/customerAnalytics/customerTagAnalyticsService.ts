import { ServiceResponse, ResponseStatus } from "@common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { customerTagAnalyticsRepository, CustomerTagAnalyticsFilter } from "./customerTagAnalyticsRepository";

export const customerTagAnalyticsService = {
  getTagReport: async (filter: CustomerTagAnalyticsFilter) => {
    try {
      const data = await customerTagAnalyticsRepository.getTagReport(filter);
      return new ServiceResponse(ResponseStatus.Success, "Get customer tag analytics report success", data, StatusCodes.OK);
    } catch (ex) {
      const msg = "Error getting customer tag analytics report: " + (ex as Error).message;
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};
