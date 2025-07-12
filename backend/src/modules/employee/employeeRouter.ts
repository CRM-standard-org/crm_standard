import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { employeeService } from "@modules/employee/employeeService";
import { GetAllSchema , SelectResponsibleInTeamSchema , SelectResponsibleSchema } from "@modules/employee/employeeModel";
import authenticateToken from "@common/middleware/authenticateToken";

export const employeeRouter = (() => {
    const router = express.Router();

    router.get("/get-team" , authenticateToken , authorizeByName("พนักงาน" , ["A"]) , validateRequest(GetAllSchema) , async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await employeeService.findAllCreateTeam(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get-employee" , authenticateToken , authorizeByName("พนักงาน" , ["A"]) , validateRequest(GetAllSchema) , async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await employeeService.findAllEmployee(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/select-responsible/:team_id?" , authenticateToken , authorizeByName("การจัดการลูกค้า" , ["A"]) , validateRequest(SelectResponsibleInTeamSchema) , async (req: Request, res: Response) => {
        const team_id = req.params.team_id;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await employeeService.selectResponsibleInTeam(team_id, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/select-employee" , authenticateToken , authorizeByName("การจัดการลูกค้า" , ["A"]) , validateRequest(SelectResponsibleSchema) , async (req: Request, res: Response) => {
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await employeeService.selectResponsible(searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();