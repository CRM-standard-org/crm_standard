import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { socialService } from "@modules/social/socialService";
import { SelectSchema } from "@modules/social/socialModel";
import authenticateToken from "@common/middleware/authenticateToken";

export const socialRouter = (() => {
    const router = express.Router();

    router.get("/select" , authenticateToken , authorizeByName("กลุ่มโซเชียล" , ["A"]) , validateRequest(SelectSchema) , async (req: Request, res: Response) => {
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await socialService.select(searchText);
        handleServiceResponse(ServiceResponse, res);
    })
    return router;
})();