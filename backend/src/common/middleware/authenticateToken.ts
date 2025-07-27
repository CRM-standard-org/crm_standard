import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { env } from "@common/utils/envConfig";
import { handleServiceResponse } from "@common/utils/httpHandlers";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { authRepository } from "@modules/auth/authRepository";
import { roleRepository } from "@modules/role/roleRepository";

declare global {
  namespace Express {
    interface Request {
      token?: any;
    }
  }
}

async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  {
    const token = req.cookies.token;
    // console.log("token", token);
    let jwtPayload;
    if (!token) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          "Authentication failed",
          null,
          StatusCodes.UNAUTHORIZED
        ),
        res
      );
      return;
    }
    try {
      jwtPayload = (<any>verify(token, env.JWT_SECRET, {
        complete: true,
        algorithms: ["HS256"],
        clockTolerance: 0,
        ignoreExpiration: false,
        ignoreNotBefore: false,
      })) as any;
      const uuid = jwtPayload.payload.uuid;
      const user = await authRepository.findById(uuid);
      if (!user) {
        handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            "User not found",
            null,
            StatusCodes.FORBIDDEN
          ),
          res
        );
        return;
      }
      const roleData = await roleRepository.findById(user.role_id);
      jwtPayload.payload.role_id = user.role_id;
      jwtPayload.payload.role = roleData?.role_name;
      req.token = jwtPayload;
    } catch (error) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          "Token is not valid",
          null,
          StatusCodes.FORBIDDEN
        ),
        res
      );
      return;
    }
    next();
  }
}
export default authenticateToken;
