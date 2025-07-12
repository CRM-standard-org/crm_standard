import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { characterService } from "@modules/character/characterService";
import { CharacterSchema , UpdateCharacterSchema , DeleteCharacterSchema ,GetCharacterByIdSchema , GetAllSchema , SelectSchema } from "@modules/character/characterModel";
import authenticateToken from "@common/middleware/authenticateToken";

export const characterRouter = (() => {
    const router = express.Router();

    router.post("/create" , authenticateToken , authorizeByName("นิสัย", ["A"]),validateRequest(CharacterSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await characterService.create(payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/select" , authenticateToken , authorizeByName("นิสัย" , ["A"]) ,validateRequest(SelectSchema) , async (req: Request, res: Response) => {
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await characterService.select(searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get" , authenticateToken , authorizeByName("นิสัย" , ["A"]) ,validateRequest(GetAllSchema) , async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const ServiceResponse = await characterService.fineAll(page, limit, searchText);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get/:character_id" , authenticateToken , authorizeByName("นิสัย" , ["A"]) ,validateRequest(GetCharacterByIdSchema) , async (req: Request, res: Response) => {
        const character_id = req.params.character_id;
        const ServiceResponse = await characterService.findById(character_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/update/:character_id" , authenticateToken , authorizeByName("นิสัย" , ["A"]) , validateRequest(UpdateCharacterSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const character_id = req.params.character_id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await characterService.update(character_id, payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.delete("/delete/:character_id" , authenticateToken , authorizeByName("นิสัย" , ["A"]) , validateRequest(DeleteCharacterSchema) , async (req: Request, res: Response) => {
        const character_id = req.params.character_id;
        const ServiceResponse = await characterService.delete(character_id);
        handleServiceResponse(ServiceResponse, res);
    })

    return router;
})();