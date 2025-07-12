import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { teamService } from "@modules/team/teamService";
import { TeamSchema , GetAllSchema , FindEmployeeSchema , GetByIdSchema ,DeleteMemberSchema ,DeleteSchema , UpdateTeamSchema ,UpdateTeamMemberSchema } from "@modules/team/teamModel";
import authenticateToken from "@common/middleware/authenticateToken";

export const teamRouter = (() => {
    const router = express.Router();

    router.post("/create" , authenticateToken , authorizeByName("การจัดการทีม", ["A"]), validateRequest(TeamSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await teamService.create(payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get" , authenticateToken , authorizeByName("การจัดการทีม" , ["A"]) ,validateRequest(GetAllSchema) , async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await teamService.findAll(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get/:team_id" , authenticateToken , authorizeByName("การจัดการทีม" , ["A"]) ,validateRequest(GetByIdSchema) , async (req: Request, res: Response) => {
        const team_id = req.params.team_id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await teamService.findById(team_id , page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.post("/search-employee" , authenticateToken , authorizeByName("การจัดการทีม" , ["A"]) ,validateRequest(FindEmployeeSchema) , async (req: Request, res: Response) => {
        const payload = req.body;
        const ServiceResponse = await teamService.searchEmployee(payload);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/team/:team_id" , authenticateToken , authorizeByName("การจัดการทีม" , ["A"]) , validateRequest(UpdateTeamSchema) , async (req: Request, res: Response) => {
        const team_id = req.params.team_id;
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await teamService.updateTeam(team_id, payload , employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/team-member/:team_id" , authenticateToken , authorizeByName("การจัดการทีม" , ["A"]) , validateRequest(UpdateTeamMemberSchema) , async (req: Request, res: Response) => {
        const team_id = req.params.team_id;
        const employee_id = req.token.payload.uuid;
        const employee_code = req.body.employee_code;
        const ServiceResponse = await teamService.updateTeamMember(team_id, employee_code , employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/delete-member/:team_id" , authenticateToken , authorizeByName("การจัดการทีม" , ["A"]) , validateRequest(DeleteMemberSchema) , async (req: Request, res: Response) => {
        const employee_id = req.body.employee_id;
        const team_id = req.params.team_id;
        const ServiceResponse = await teamService.deleteMember(team_id, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.delete("/delete/:team_id" , authenticateToken , authorizeByName("การจัดการทีม" , ["A"]) , validateRequest(DeleteSchema) , async (req: Request, res: Response) => {
        const team_id = req.params.team_id;
        const ServiceResponse = await teamService.deleteTeam(team_id);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();