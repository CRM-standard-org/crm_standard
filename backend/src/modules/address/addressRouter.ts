import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { addressService } from "@modules/address/addressService";
import { SelectSchema } from "@modules/address/addressModel";
import authenticateToken from "@common/middleware/authenticateToken";

export const addressRouter = (() => {
    const router = express.Router();

    router.get("/select" , authenticateToken  , validateRequest(SelectSchema) ,async (req: Request, res: Response) => {
        const ServiceResponse = await addressService.findAllMasterAddress();
        handleServiceResponse(ServiceResponse, res);
    })
    return router;
})();