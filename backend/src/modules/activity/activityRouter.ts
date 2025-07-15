import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { activityService } from "@modules/activity/activityService";
import { CreateSchema , GetByIdSchema , GetAllSchema , UpdateSchema , DeleteSchema  } from "@modules/activity/activityModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAdmin from "@common/middleware/authorizeAll";

export const activityRouter = (() => {
    const router = express.Router();

    router.post("/create" , authenticateToken , authorizeByName("บันทึกกิจกรรม", ["A"]) , validateRequest(CreateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await activityService.create(payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })


    router.post("/get" , authenticateToken , authorizeByName("บันทึกกิจกรรม" , ["A"]) ,validateRequest(GetAllSchema), async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const payload = req.body;
        const ServiceResponse = await activityService.fineAll(payload, page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get/:activity_id?" , authenticateToken , authorizeByName("บันทึกกิจกรรม" , ["A"]) , validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const activity_id = req.params.activity_id;
        const ServiceResponse = await activityService.findById(activity_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/update/:activity_id?" , authenticateToken , authorizeByName("บันทึกกิจกรรม" , ["A"]) , validateRequest(UpdateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const activity_id = req.params.activity_id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await activityService.update(activity_id, payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.delete("/delete/:activity_id?" , authenticateToken , authorizeByName("บันทึกกิจกรรม" , ["A"]) , validateRequest(DeleteSchema), async (req: Request, res: Response) => {
        const activity_id = req.params.activity_id;
        const ServiceResponse = await activityService.delete(activity_id);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();