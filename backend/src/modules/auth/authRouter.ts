import express, {Request, Response, Router} from "express";

import {
    handleServiceResponse,
    validateRequest,
  } from "@common/utils/httpHandlers";
import { authService } from "@modules/auth/authService";
import { LoginSchema} from "@modules/auth/authModel";
export const authRouter = (() => {
    const router = express.Router();


    router.post("/login", validateRequest(LoginSchema),  async (req: Request, res: Response) => {
        const payload = req.body;
        const ServiceResponse = await authService.login(payload, res);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/logout", async (req: Request, res: Response) => {
        const ServiceResponse = await authService.logout(res);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/auth-status", async (req: Request, res: Response) => {
        const ServiceResponse = await authService.authStatus(req);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();
