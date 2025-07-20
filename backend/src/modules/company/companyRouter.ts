import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { companyService } from "@modules/company/companyService";
import { GetByIdSchema , UpdateCompanySchema } from "@modules/company/companyModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAdmin from "@common/middleware/authorizeAll";
import { upload , handleMulter } from '@common/middleware/multerConfig';

export const companyRouter = (() => {
  const router = express.Router();

  router.get("/get/" , authenticateToken , authorizeByName("บริษัท", ["A"]), async (req: Request, res: Response) => {
        const ServiceResponse = await companyService.findCompany();
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/update/:company_id?", authenticateToken, authorizeByName("บริษัท", ["A"]), handleMulter(upload.array("company", 1)), async (req: Request, res: Response) => {
      try {
        const company_id = req.params.company_id;
        const raw = req.body.payload; // raw = JSON string
        let parsedData;
        parsedData = JSON.parse(raw);
        const validation = UpdateCompanySchema.safeParse({ body: parsedData });
        const payloadData = parsedData; // ใช้ค่า raw ที่ Parse มาโดยตรง
        const files = req.files as Express.Multer.File[];
        const employee_id = req.token.payload.uuid;
        const resultService = await companyService.updateCompany(company_id,payloadData, employee_id, files);
        handleServiceResponse(resultService, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  return router;
})();