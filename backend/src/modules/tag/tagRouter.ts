import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { tagService } from "@modules/tag/tagService";
import { CreateTagSchema , UpdateTagSchema , SelectSchema ,GetTagByIdSchema , DeleteTagSchema , GetAllTagSchema  } from "@modules/tag/tagModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAdmin from "@common/middleware/authorizeAll";

export const tagRouter = (() => {
    const router = express.Router();

    router.post("/create" , authenticateToken , authorizeByName("กลุ่มแท็ก", ["A"]),validateRequest(CreateTagSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const { uuid } = req.token.payload;
        const employee_id = uuid;
        const ServiceResponse = await tagService.create(payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/select" , authenticateToken , authorizeByName("กลุ่มแท็ก" , ["A"]) , validateRequest(SelectSchema), async (req: Request, res: Response) => {
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await tagService.select(searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get" , authenticateToken , authorizeByName("กลุ่มแท็ก" , ["A"]) , validateRequest(GetAllTagSchema), async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await tagService.fineAll(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get/:id" , authenticateToken , authorizeByName("กลุ่มแท็ก" , ["A"]) , validateRequest(GetTagByIdSchema), async (req: Request, res: Response) => {
        const tag_id = req.params.id;
        const ServiceResponse = await tagService.findById(tag_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/update/:id" , authenticateToken , authorizeByName("กลุ่มแท็ก" , ["A"]) , validateRequest(UpdateTagSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const tag_id = req.params.id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await tagService.update(tag_id, payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.delete("/delete/:id" , authenticateToken , authorizeByName("กลุ่มแท็ก" , ["A"]) , validateRequest(DeleteTagSchema), async (req: Request, res: Response) => {
        const tag_id = req.params.id;
        const ServiceResponse = await tagService.delete(tag_id);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();