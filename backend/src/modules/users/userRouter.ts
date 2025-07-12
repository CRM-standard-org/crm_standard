import express, {Request, Response, Router} from "express";

import {
    handleServiceResponse,
    validateRequest,
  } from "@common/utils/httpHandlers";
import { userService } from "@modules/users/userService";
import { LoginUserSchema} from "@modules/users/userModel";
export const userRouter = (() => {
    const router = express.Router();


    router.post("/login", validateRequest(LoginUserSchema),  async (req: Request, res: Response) => {
        const payload = req.body;
        const ServiceResponse = await userService.login(payload, res);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/logout", async (req: Request, res: Response) => {
        const ServiceResponse = await userService.logout(res);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/auth-status", async (req: Request, res: Response) => {
        const ServiceResponse = await userService.authStatus(req);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();
