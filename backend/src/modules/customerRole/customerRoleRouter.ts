import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { customerRoleService } from "@modules/customerRole/customerRoleService";
import { CustomerRoleSchema , UpdateSchema , DeleteSchema ,GetByIdSchema , GetAllSchema , SelectSchema } from "@modules/customerRole/customerRoleModel";
import authenticateToken from "@common/middleware/authenticateToken";

export const customerRoleRouter = (() => {
    const router = express.Router();

    router.post("/create" , authenticateToken , authorizeByName("บทบาทลูกค้า", ["A"]),validateRequest(CustomerRoleSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await customerRoleService.create(payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/select" , authenticateToken , authorizeByName("บทบาทลูกค้า" , ["A"]) ,validateRequest(SelectSchema) , async (req: Request, res: Response) => {
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await customerRoleService.select( searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get" , authenticateToken , authorizeByName("บทบาทลูกค้า" , ["A"]) ,validateRequest(GetAllSchema) , async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await customerRoleService.fineAll(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get/:customer_role_id" , authenticateToken , authorizeByName("บทบาทลูกค้า" , ["A"]) ,validateRequest(GetByIdSchema) , async (req: Request, res: Response) => {
        const character_id = req.params.customer_role_id;
        const ServiceResponse = await customerRoleService.findById(character_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/update/:customer_role_id" , authenticateToken , authorizeByName("บทบาทลูกค้า" , ["A"]) , validateRequest(UpdateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const character_id = req.params.customer_role_id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await customerRoleService.update(character_id, payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.delete("/delete/:customer_role_id" , authenticateToken , authorizeByName("บทบาทลูกค้า" , ["A"]) , validateRequest(DeleteSchema) , async (req: Request, res: Response) => {
        const character_id = req.params.customer_role_id;
        const ServiceResponse = await customerRoleService.delete(character_id);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();