import { ServiceResponse, ResponseStatus } from "../../common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { customerAnalyticsRepository, CustomerAnalyticsFilter } from "./customerAnalyticsRepository";

export const customerAnalyticsService = {
  getCustomerReport: async (filter: CustomerAnalyticsFilter) => {
    try {
      const data = await customerAnalyticsRepository.getCustomerReport(filter);
      return new ServiceResponse(ResponseStatus.Success, "Get customer analytics report success", data, StatusCodes.OK);
    } catch (ex) {
      const msg = "Error getting customer analytics report: " + (ex as Error).message;
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
};
