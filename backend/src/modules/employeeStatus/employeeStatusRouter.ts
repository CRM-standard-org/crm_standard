import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { employeeStatusService } from "@modules/employeeStatus/employeeStatusService";
import { GetAllSchema } from "@modules/employeeStatus/employeeStatusModel";
import authenticateToken from "@common/middleware/authenticateToken";

export const employeeStatusRouter = (() => {
    const router = express.Router();

    router.get("/get" , authenticateToken , authorizeByName("สถานะพนักงาน" , ["A"]) , validateRequest(GetAllSchema) ,async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await employeeStatusService.fineAll(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })
    return router;
})();