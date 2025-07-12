import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { vatService } from "@modules/vat/vatService";
import { CreateSchema , GetByIdSchema , GetAllSchema , SelectSchema , UpdateSchema , DeleteSchema  } from "@modules/vat/vatModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAdmin from "@common/middleware/authorizeAll";

export const vatRouter = (() => {
    const router = express.Router();

    router.get("/select" , authenticateToken , authorizeByName("ภาษี" , ["A"]) , validateRequest(SelectSchema), async (req: Request, res: Response) => {
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await vatService.select(searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();