import express, { Request, Response, Router } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { SelectSchema } from "./rolemodel";
import { roleService } from "./roleService";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";
import { authorizeByName } from "@common/middleware/permissions";


export const roleRouter = (()=>{
 const router= express.Router();

  router.get("/select" , authenticateToken , authorizeByName("บทบาท" , ["A"]) , validateRequest(SelectSchema), async (req: Request, res: Response) => {
      const searchText = (req.query.search as string) || "";
      const ServiceResponse = await roleService.select(searchText);
      handleServiceResponse(ServiceResponse, res);
  })

  return router;
})();

