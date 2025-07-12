import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { quotationService } from "@modules/quotation/quotationService";
import { CreateSchema  ,GetByIdSchema , CancelSchema , GetAllSchema , UpdateCompanySchema , DeleteQuotationItemSchema , UpdateQuotationItemSchema , AddQuotationItemSchema , UpdatePaymentSchema , DeleteFileSchema , ResqustApproveSchema , ResqustEditSchema , ApproveSchema , RejectSchema , CancelApproveSchema , RejectDealSchema , CloseDealSchema } from "@modules/quotation/quotationModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAdmin from "@common/middleware/authorizeAll";
import { upload , handleMulter } from '@common/middleware/multerConfig';

export const quotationRouter = (() => {
  const router = express.Router();

  router.post("/create", authenticateToken, authorizeByName("ใบเสนอราคา", ["A"]), handleMulter(upload.array("quotation", 30)), async (req: Request, res: Response) => {
      try {
        const raw = req.body.payload; // raw = JSON string
        // console.log("raw", raw);
        let parsedData;
        parsedData = JSON.parse(raw);

        const validation = CreateSchema.safeParse({ body: parsedData });
        const payloadData = parsedData; // ใช้ค่า raw ที่ Parse มาโดยตรง
        // console.log("result check", validation.success);
        // console.log("result Data", payloadData);

        const files = req.files as Express.Multer.File[];
        const employee_id = req.token.payload.uuid;
        // console.log("files", files);
        const resultService = await quotationService.create(payloadData, employee_id, files);
        // console.log("resultService", resultService);
        handleServiceResponse(resultService, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.post("/get" , authenticateToken , authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(GetAllSchema), async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const searchText = (req.query.search as string) || "";
      const payload = req.body;
      const ServiceResponse = await quotationService.findAll(page , limit , searchText , payload);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get("/get/:quotation_id?" , authenticateToken , authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const ServiceResponse = await quotationService.findById(quotation_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/update-company/:quotation_id?" , authenticateToken , authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(UpdateCompanySchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await quotationService.updateCompany(quotation_id,payload,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post("/add-item/:quotation_id?" , authenticateToken , authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(AddQuotationItemSchema), async (req: Request, res: Response) => {
      const quotation_id = req.params.quotation_id;
      const payload = req.body;
      const employee_id = req.token.payload.uuid;
      const ServiceResponse = await quotationService.addItem(quotation_id,payload,employee_id);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/update-item/:quotation_id?" , authenticateToken , authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(UpdateQuotationItemSchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await quotationService.updateItem(quotation_id,payload,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post("/delete-item/:quotation_id?" , authenticateToken , authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(DeleteQuotationItemSchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const quotation_item_id = req.body.quotation_item_id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await quotationService.deleteItem(quotation_id,quotation_item_id,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/update-payment/:quotation_id?" , authenticateToken , authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(UpdatePaymentSchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await quotationService.updatePayment(quotation_id,payload,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post("/file/:quotation_id?", authenticateToken, authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(GetByIdSchema), handleMulter(upload.array("quotation", 30)), async (req: Request, res: Response) => {
      try {
        const quotation_id = req.params.quotation_id;
        const files = req.files as Express.Multer.File[];
        const employee_id = req.token.payload.uuid;
        const resultService = await quotationService.addFile(quotation_id, employee_id, files);
        handleServiceResponse(resultService, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.delete("/file/:quotation_file_id?", authenticateToken, authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(DeleteFileSchema), handleMulter(upload.array("quotation", 30)), async (req: Request, res: Response) => {
      try {
        const quotation_file_id = req.params.quotation_file_id;
        const resultService = await quotationService.deleteFile(quotation_file_id);
        handleServiceResponse(resultService, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.put("/cancel/:quotation_id?" , authenticateToken , authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(CancelSchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const quotation_status = req.body.quotation_status;
        const quotation_status_remark = req.body.quotation_status_remark;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await quotationService.cancel(quotation_id,quotation_status,quotation_status_remark,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/request-approve/:quotation_id?" , authenticateToken , authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(ResqustApproveSchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const quotation_status = req.body.quotation_status;
        const quotation_status_remark = req.body.quotation_status_remark;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await quotationService.requestApprove(quotation_id,quotation_status,quotation_status_remark,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/request-edit/:quotation_id?" , authenticateToken , authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(ResqustEditSchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const quotation_status = req.body.quotation_status;
        const quotation_status_remark = req.body.quotation_status_remark;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await quotationService.requestEdit(quotation_id,quotation_status,quotation_status_remark,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/approve/:quotation_id?" , authenticateToken , authorizeByName("อนุมัติใบเสนอราคา", ["A"]), validateRequest(ApproveSchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const quotation_status = req.body.quotation_status;
        const quotation_status_remark = req.body.quotation_status_remark;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await quotationService.approve(quotation_id,quotation_status,quotation_status_remark,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/reject/:quotation_id?" , authenticateToken , authorizeByName("อนุมัติใบเสนอราคา", ["A"]), validateRequest(RejectSchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const quotation_status = req.body.quotation_status;
        const quotation_status_remark = req.body.quotation_status_remark;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await quotationService.reject(quotation_id,quotation_status,quotation_status_remark,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/cancel-approve/:quotation_id?" , authenticateToken , authorizeByName("อนุมัติใบเสนอราคา", ["A"]), validateRequest(CancelApproveSchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const quotation_status = req.body.quotation_status;
        const quotation_status_remark = req.body.quotation_status_remark;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await quotationService.cancelApprove(quotation_id,quotation_status,quotation_status_remark,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/reject-deal/:quotation_id?" , authenticateToken , authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(RejectDealSchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const quotation_status = req.body.quotation_status;
        const quotation_status_remark = req.body.quotation_status_remark;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await quotationService.rejectDeal(quotation_id,quotation_status,quotation_status_remark,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/close-deal/:quotation_id?" , authenticateToken , authorizeByName("ใบเสนอราคา", ["A"]), validateRequest(CloseDealSchema), async (req: Request, res: Response) => {
        const quotation_id = req.params.quotation_id;
        const quotation_status = req.body.quotation_status;
        const quotation_status_remark = req.body.quotation_status_remark;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await quotationService.closeDeal(quotation_id,quotation_status,quotation_status_remark,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  return router;
})();