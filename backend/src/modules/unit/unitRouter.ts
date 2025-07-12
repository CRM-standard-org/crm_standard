import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { unitService } from "@modules/unit/unitService";
import { CreateSchema , GetByIdSchema , GetAllSchema , SelectSchema , UpdateSchema , DeleteSchema  } from "@modules/unit/unitModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAdmin from "@common/middleware/authorizeAll";

export const unitRouter = (() => {
    const router = express.Router();

    router.post("/create" , authenticateToken , authorizeByName("หน่วยสินค้า", ["A"]) , validateRequest(CreateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await unitService.create(payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/select" , authenticateToken , authorizeByName("หน่วยสินค้า" , ["A"]) , validateRequest(SelectSchema), async (req: Request, res: Response) => {
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await unitService.select(searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get" , authenticateToken , authorizeByName("หน่วยสินค้า" , ["A"]) ,validateRequest(GetAllSchema), async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await unitService.fineAll(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get/:unit_id" , authenticateToken , authorizeByName("หน่วยสินค้า" , ["A"]) , validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const unit_id = req.params.unit_id;
        const ServiceResponse = await unitService.findById(unit_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/update/:unit_id" , authenticateToken , authorizeByName("หน่วยสินค้า" , ["A"]) , validateRequest(UpdateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const unit_id = req.params.unit_id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await unitService.update(unit_id, payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.delete("/delete/:unit_id" , authenticateToken , authorizeByName("หน่วยสินค้า" , ["A"]) , validateRequest(DeleteSchema), async (req: Request, res: Response) => {
        const unit_id = req.params.unit_id;
        const ServiceResponse = await unitService.delete(unit_id);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();