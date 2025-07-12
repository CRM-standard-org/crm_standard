import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { handleServiceResponse } from "@common/utils/httpHandlers";
import { permissionMap } from "@common/utils/permissionMap";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Middleware สำหรับตรวจสอบสิทธิ์การเข้าถึง
 * @param name หมวดหมู่สิทธิ์
 * @param requiredPermissions อาร์เรย์ของสิทธิ์ที่อนุญาต
 */
export const authorizeByName =
  (name: string, requiredPermissions: ("A" | "R" | "N")[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = req.token?.payload?.role;
      const userPermission = permissionMap[name]?.[role];

      if (!userPermission || !requiredPermissions.includes(userPermission)) { 
        return handleUnauthorizedResponse(res);
      }

      next();
    } catch (err) {
      return handleUnauthorizedResponse(res);
    }
  };

/**
 * ส่ง response กรณี Unauthorized
 */
const handleUnauthorizedResponse = (res: Response) => {
  handleServiceResponse(
    new ServiceResponse(
      ResponseStatus.Failed,
      "Unauthorized",
      null,
      StatusCodes.FORBIDDEN
    ),
    res
  );
};
