import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { productService } from "@modules/product/productService";
import { CreateSchema , GetByIdSchema , GetAllSchema , SelectSchema , UpdateSchema , DeleteSchema  } from "@modules/product/productModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAdmin from "@common/middleware/authorizeAll";

export const productRouter = (() => {
    const router = express.Router();

    router.post("/create" , authenticateToken , authorizeByName("สินค้า", ["A"]) , validateRequest(CreateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await productService.create(payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/select" , authenticateToken , authorizeByName("สินค้า" , ["A"]) , validateRequest(SelectSchema), async (req: Request, res: Response) => {
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await productService.select(searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get" , authenticateToken , authorizeByName("สินค้า" , ["A"]) ,validateRequest(GetAllSchema), async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await productService.fineAll(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get/:product_id" , authenticateToken , authorizeByName("สินค้า" , ["A"]) , validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const product_id = req.params.product_id;
        const ServiceResponse = await productService.findById(product_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/update/:product_id" , authenticateToken , authorizeByName("สินค้า" , ["A"]) , validateRequest(UpdateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const product_id = req.params.product_id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await productService.update(product_id, payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.delete("/delete/:product_id" , authenticateToken , authorizeByName("สินค้า" , ["A"]) , validateRequest(DeleteSchema), async (req: Request, res: Response) => {
        const product_id = req.params.product_id;
        const ServiceResponse = await productService.delete(product_id);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();