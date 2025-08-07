import { ServiceResponse, ResponseStatus } from "../../common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { saleOrderAnalyticsRepository, SalesAnalyticsFilter } from "./saleOrderAnalyticsRepository";

export const saleOrderAnalyticsService = {
  // Get available years
  getAvailableYears: async () => {
    try {
      const years = await saleOrderAnalyticsRepository.getAvailableYears();
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get available years success",
        years,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error getting available years: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // Get business level analytics
  getBusinessLevelAnalytics: async (filter: SalesAnalyticsFilter) => {
    try {
      const data = await saleOrderAnalyticsRepository.getBusinessLevelAnalytics(filter);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get business level analytics success",
        data,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error getting business level analytics: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // Get team level analytics
  getTeamLevelAnalytics: async (filter: SalesAnalyticsFilter) => {
    try {
      const data = await saleOrderAnalyticsRepository.getTeamLevelAnalytics(filter);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get team level analytics success",
        data,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error getting team level analytics: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // Get team level analytics with pagination
  getTeamLevelAnalyticsPaginated: async (filter: SalesAnalyticsFilter) => {
    try {
      const data = await saleOrderAnalyticsRepository.getTeamLevelAnalyticsPaginated(filter);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get team level analytics success",
        data,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error getting team level analytics: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // Get personal level analytics
  getPersonalLevelAnalytics: async (filter: SalesAnalyticsFilter) => {
    try {
      const data = await saleOrderAnalyticsRepository.getPersonalLevelAnalytics(filter);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get personal level analytics success",
        data,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error getting personal level analytics: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // Get personal level analytics with pagination
  getPersonalLevelAnalyticsPaginated: async (filter: SalesAnalyticsFilter) => {
    try {
      const data = await saleOrderAnalyticsRepository.getPersonalLevelAnalyticsPaginated(filter);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get personal level analytics success",
        data,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = "Error getting personal level analytics: " + (ex as Error).message;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
};
