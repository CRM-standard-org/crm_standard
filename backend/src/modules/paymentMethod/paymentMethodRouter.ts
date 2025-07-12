import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { paymentMethodService } from "@modules/paymentMethod/paymentMethodService";
import { CreateSchema , GetByIdSchema , GetAllSchema , SelectSchema , UpdateSchema , DeleteSchema  } from "@modules/paymentMethod/paymentMethodModel";
import authenticateToken from "@common/middleware/authenticateToken";

export const paymentMethodRouter = (() => {
    const router = express.Router();

    router.post("/create" , authenticateToken , authorizeByName("ช่องทางการชำระเงิน", ["A"]) , validateRequest(CreateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await paymentMethodService.create(payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/select" , authenticateToken , authorizeByName("ช่องทางการชำระเงิน" , ["A"]) , validateRequest(SelectSchema), async (req: Request, res: Response) => {
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await paymentMethodService.select(searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get" , authenticateToken , authorizeByName("ช่องทางการชำระเงิน" , ["A"]) ,validateRequest(GetAllSchema), async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await paymentMethodService.fineAll(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get/:payment_method_id" , authenticateToken , authorizeByName("ช่องทางการชำระเงิน" , ["A"]) , validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const payment_method_id = req.params.payment_method_id;
        const ServiceResponse = await paymentMethodService.findById(payment_method_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/update/:payment_method_id" , authenticateToken , authorizeByName("ช่องทางการชำระเงิน" , ["A"]) , validateRequest(UpdateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const payment_method_id = req.params.payment_method_id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await paymentMethodService.update(payment_method_id, payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.delete("/delete/:payment_method_id" , authenticateToken , authorizeByName("ช่องทางการชำระเงิน" , ["A"]) , validateRequest(DeleteSchema), async (req: Request, res: Response) => {
        const payment_method_id = req.params.payment_method_id;
        const ServiceResponse = await paymentMethodService.delete(payment_method_id);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();