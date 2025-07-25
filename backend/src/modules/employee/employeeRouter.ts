import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { employeeService } from "@modules/employee/employeeService";
import { CreateSchema , GetAllEmployeeSchema , SelectResponsibleInTeamSchema , SelectResponsibleSchema , GetAllSchema , GetByIdSchema , UpdateSchema } from "@modules/employee/employeeModel";
import authenticateToken from "@common/middleware/authenticateToken";
import { upload , handleMulter } from '@common/middleware/multerConfig';


export const employeeRouter = (() => {
    const router = express.Router();

    router.post("/create", authenticateToken, authorizeByName("พนักงาน", ["A"]), handleMulter(upload.array("emp", 1)), async (req: Request, res: Response) => {
        try {
            const raw = req.body.payload; // raw = JSON string
            let parsedData;
            parsedData = JSON.parse(raw);
            const validation = CreateSchema.safeParse({ body: parsedData });
            const payloadData = parsedData; // ใช้ค่า raw ที่ Parse มาโดยตรง
            const files = req.files as Express.Multer.File[];
            const employee_id = req.token.payload.uuid;
            const resultService = await employeeService.create(payloadData, employee_id, files);
            handleServiceResponse(resultService, res);
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }}
    );

    router.get("/none-team" , authenticateToken , authorizeByName("พนักงาน" , ["A"]) , validateRequest(GetAllEmployeeSchema) , async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await employeeService.findAllNoneTeam(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.post("/get-employee" , authenticateToken , authorizeByName("พนักงาน", ["A"]), validateRequest(GetAllSchema), async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const payload = req.body;
        const ServiceResponse = await employeeService.findAll(page , limit , searchText , payload);
        handleServiceResponse(ServiceResponse, res);
    });

    router.get("/select-responsible/:team_id?" , authenticateToken , authorizeByName("การจัดการลูกค้า" , ["A"]) , validateRequest(SelectResponsibleInTeamSchema) , async (req: Request, res: Response) => {
        const team_id = req.params.team_id;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await employeeService.selectResponsibleInTeam(team_id, searchText);
        handleServiceResponse(ServiceResponse, res);
    });

    router.get("/select-employee" , authenticateToken , authorizeByName("การจัดการลูกค้า" , ["A"]) , validateRequest(SelectResponsibleSchema) , async (req: Request, res: Response) => {
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await employeeService.selectResponsible(searchText);
        handleServiceResponse(ServiceResponse, res);
    });

    router.get("/get/:employee_id?" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const employee_id = req.params.employee_id;
        const ServiceResponse = await employeeService.findById(employee_id);
        handleServiceResponse(ServiceResponse, res);
    });
    
    router.put("/update/:employee_id?", authenticateToken, authorizeByName("พนักงาน", ["A"]), handleMulter(upload.array("emp", 1)), async (req: Request, res: Response) => {
        try {
            const employee_id = req.params.employee_id;
            const raw = req.body.payload; // raw = JSON string
            let parsedData;
            parsedData = JSON.parse(raw);
            const validation = UpdateSchema.safeParse({ body: parsedData });
            const payloadData = parsedData; // ใช้ค่า raw ที่ Parse มาโดยตรง
            const files = req.files as Express.Multer.File[];
            const employee_id_by = req.token.payload.uuid;
            const resultService = await employeeService.update(employee_id,payloadData, employee_id_by, files);
            handleServiceResponse(resultService, res);
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
    });

    return router;
})();