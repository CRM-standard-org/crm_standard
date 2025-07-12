import express, { Request, Response, Router } from "express";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import { TypePayloadrole ,GetroleSchema,GetRoleByIdSchema} from "./rolemodel";
import { roleService } from "./roleService";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAll from "@common/middleware/authorizeAll";

export const roleRouter = (()=>{
 const router= express.Router();

 router.get("/get", authenticateToken, authorizeAll, async (req: Request, res: Response) => {
     try{
        //const companyId =req.token.company_id;
        const ServiceResponse =await roleService.findAll();
        handleServiceResponse(ServiceResponse, res);
     }
     catch(error){
        console.error("Error in GET request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
     }
  });

  router.get(
    "/get/:role_id",
    authenticateToken,
    authorizeAll,
    validateRequest(GetRoleByIdSchema),
    async (req: Request, res: Response) => {
      try {
        const { company_id } = req.token.payload;
        const { role_id } = req.params;
        const companyId = company_id;
        const ServiceResponse = await roleService.findById(
       
          role_id
        );
        handleServiceResponse(ServiceResponse, res);
      } catch (error) {
        console.error("Error in GET request:", error);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    })


  return router;
})();

