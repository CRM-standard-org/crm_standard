import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { groupProductService } from "@modules/groupProduct/groupProductService";
import { CreateSchema , GetByIdSchema , GetAllSchema , SelectSchema , UpdateSchema , DeleteSchema  } from "@modules/groupProduct/groupProductModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAdmin from "@common/middleware/authorizeAll";

export const groupProductRouter = (() => {
    const router = express.Router();

    router.post("/create" , authenticateToken , authorizeByName("กลุ่มสินค้า", ["A"]) , validateRequest(CreateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await groupProductService.create(payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/select" , authenticateToken , authorizeByName("กลุ่มสินค้า" , ["A"]) , validateRequest(SelectSchema), async (req: Request, res: Response) => {
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await groupProductService.select(searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get" , authenticateToken , authorizeByName("กลุ่มสินค้า" , ["A"]) ,validateRequest(GetAllSchema), async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await groupProductService.fineAll(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get/:group_product_id" , authenticateToken , authorizeByName("กลุ่มสินค้า" , ["A"]) , validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const group_product_id = req.params.group_product_id;
        const ServiceResponse = await groupProductService.findById(group_product_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/update/:group_product_id" , authenticateToken , authorizeByName("กลุ่มสินค้า" , ["A"]) , validateRequest(UpdateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const group_product_id = req.params.group_product_id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await groupProductService.update(group_product_id, payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.delete("/delete/:group_product_id" , authenticateToken , authorizeByName("กลุ่มสินค้า" , ["A"]) , validateRequest(DeleteSchema), async (req: Request, res: Response) => {
        const group_product_id = req.params.group_product_id;
        const ServiceResponse = await groupProductService.delete(group_product_id);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();