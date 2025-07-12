import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { currencyService } from "@modules/currency/currencyService";
import { CreateSchema , GetByIdSchema , GetAllSchema , SelectSchema , UpdateSchema , DeleteSchema  } from "@modules/currency/currencyModel";
import authenticateToken from "@common/middleware/authenticateToken";

export const currencyRouter = (() => {
    const router = express.Router();

    router.post("/create" , authenticateToken , authorizeByName("สกุลเงิน", ["A"]) , validateRequest(CreateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await currencyService.create(payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/select" , authenticateToken , authorizeByName("สกุลเงิน" , ["A"]) , validateRequest(SelectSchema), async (req: Request, res: Response) => {
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await currencyService.select(searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get" , authenticateToken , authorizeByName("สกุลเงิน" , ["A"]) ,validateRequest(GetAllSchema), async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await currencyService.fineAll(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get/:currency_id" , authenticateToken , authorizeByName("สกุลเงิน" , ["A"]) , validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const currency_id = req.params.currency_id;
        const ServiceResponse = await currencyService.findById(currency_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/update/:currency_id" , authenticateToken , authorizeByName("สกุลเงิน" , ["A"]) , validateRequest(UpdateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const currency_id = req.params.currency_id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await currencyService.update(currency_id, payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.delete("/delete/:currency_id" , authenticateToken , authorizeByName("สกุลเงิน" , ["A"]) , validateRequest(DeleteSchema), async (req: Request, res: Response) => {
        const currency_id = req.params.currency_id;
        const ServiceResponse = await currencyService.delete(currency_id);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();