import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { saleOrderService } from "@modules/saleOrder/saleOrderService";
import { GetAllSchema , GetByIdSchema , UpdateCompanySchema , DeleteFileSchema , UpdatePaymentSchema , PaymentSchema , PaymentUpdateSchema , GetByIdFilePaymentSchema , DeletePaymentSchema , ManufactureSchema , ExpectedManufactureSchema , DeliverySchema , ExpectedDeliverySchema , ReceiptSchema , ExpectedReceiptSchema } from "@modules/saleOrder/saleOrderModel";
import authenticateToken from "@common/middleware/authenticateToken";
import authorizeAdmin from "@common/middleware/authorizeAll";
import { upload , handleMulter } from '@common/middleware/multerConfig';

export const saleOrderRouter = (() => {
  const router = express.Router();

  router.post("/get" , authenticateToken , authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(GetAllSchema), async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const searchText = (req.query.search as string) || "";
      const payload = req.body;
      const ServiceResponse = await saleOrderService.findAll(page , limit , searchText , payload);
      handleServiceResponse(ServiceResponse, res);
    }
  );

  router.get("/get/:sale_order_id?" , authenticateToken , authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const sale_order_id = req.params.sale_order_id;
        const ServiceResponse = await saleOrderService.findById(sale_order_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/update-company/:sale_order_id?" , authenticateToken , authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(UpdateCompanySchema), async (req: Request, res: Response) => {
        const sale_order_id = req.params.sale_order_id;
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await saleOrderService.updateCompany(sale_order_id,payload,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/payment-detail/:sale_order_id?" , authenticateToken , authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(UpdatePaymentSchema), async (req: Request, res: Response) => {
        const sale_order_id = req.params.sale_order_id;
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await saleOrderService.updatePaymentDetail(sale_order_id,payload,employee_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.post("/file/:sale_order_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(GetByIdSchema), handleMulter(upload.array("sale-order", 30)), async (req: Request, res: Response) => {
      try {
        const sale_order_id = req.params.sale_order_id;
        const files = req.files as Express.Multer.File[];
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await saleOrderService.addFile(sale_order_id, employee_id, files);
        handleServiceResponse(ServiceResponse, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.delete("/file/:sale_order_file_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(DeleteFileSchema), handleMulter(upload.array("quotation", 30)), async (req: Request, res: Response) => {
      try {
        const sale_order_file_id = req.params.sale_order_file_id;
        const ServiceResponse = await saleOrderService.deleteFile(sale_order_file_id);
        handleServiceResponse(ServiceResponse, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  ); 

  router.post("/payment/:sale_order_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), handleMulter(upload.array("payment", 30)), async (req: Request, res: Response) => {
      try {
        const sale_order_id = req.params.sale_order_id;
        const raw = req.body.payload; // raw = JSON string
        // console.log("raw", raw);
        let parsedData;
        parsedData = JSON.parse(raw);

        const validation = PaymentSchema.safeParse({ body: parsedData });
        const payloadData = parsedData; // ใช้ค่า raw ที่ Parse มาโดยตรง
        // console.log("result check", validation.success);
        // console.log("result Data", payloadData);

        const files = req.files as Express.Multer.File[];
        const employee_id = req.token.payload.uuid;
        // console.log("files", files);
        const resultService = await saleOrderService.payment(sale_order_id,payloadData, employee_id, files);
        // console.log("resultService", resultService);
        handleServiceResponse(resultService, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.get("/file/:payment_log_id?" , authenticateToken , authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(GetByIdFilePaymentSchema), async (req: Request, res: Response) => {
        const payment_log_id = req.params.payment_log_id;
        const ServiceResponse = await saleOrderService.paymentFile(payment_log_id);
        handleServiceResponse(ServiceResponse, res);
    }
  );

  router.put("/payment-update/:sale_order_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), handleMulter(upload.array("payment", 30)), async (req: Request, res: Response) => {
      try {
        const sale_order_id = req.params.sale_order_id;
        const raw = req.body.payload; // raw = JSON string
        // console.log("raw", raw);
        let parsedData;
        parsedData = JSON.parse(raw);

        const validation = PaymentUpdateSchema.safeParse({ body: parsedData });
        const payloadData = parsedData; // ใช้ค่า raw ที่ Parse มาโดยตรง
        // console.log("result check", validation.success);
        // console.log("result Data", payloadData);

        const files = req.files as Express.Multer.File[];
        const employee_id = req.token.payload.uuid;
        // console.log("files", files);
        const resultService = await saleOrderService.paymentUpdate(sale_order_id,payloadData, employee_id, files);
        // console.log("resultService", resultService);
        handleServiceResponse(resultService, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.post("/delete-payment/:sale_order_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(DeletePaymentSchema), async (req: Request, res: Response) => {
      try {
        const sale_order_id = req.params.sale_order_id;
        const payment_log_id = req.body.payment_log_id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await saleOrderService.deletePayment(sale_order_id,payment_log_id, employee_id);
        handleServiceResponse(ServiceResponse, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.post("/manufacture/:sale_order_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(ManufactureSchema), async (req: Request, res: Response) => {
      try {
        const sale_order_id = req.params.sale_order_id;
        const manufacture_factory_date = req.body.manufacture_factory_date;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await saleOrderService.manufactureDate(sale_order_id, manufacture_factory_date , employee_id);
        handleServiceResponse(ServiceResponse, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.post("/expected-manufacture/:sale_order_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(ExpectedManufactureSchema), async (req: Request, res: Response) => {
      try {
        const sale_order_id = req.params.sale_order_id;
        const expected_manufacture_factory_date = req.body.expected_manufacture_factory_date;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await saleOrderService.expectedManufactureDate(sale_order_id, expected_manufacture_factory_date, employee_id);
        handleServiceResponse(ServiceResponse, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.post("/delivery/:sale_order_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(DeliverySchema),  async (req: Request, res: Response) => {
      try {
        const sale_order_id = req.params.sale_order_id;
        const delivery_date_success = req.body.delivery_date_success;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await saleOrderService.deliveryDate(sale_order_id, delivery_date_success , employee_id);
        handleServiceResponse(ServiceResponse, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.post("/expected-delivery/:sale_order_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(ExpectedDeliverySchema),  async (req: Request, res: Response) => {
      try {
        const sale_order_id = req.params.sale_order_id;
        const expected_delivery_date_success = req.body.expected_delivery_date_success;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await saleOrderService.expectedDeliveryDate(sale_order_id, expected_delivery_date_success , employee_id);
        handleServiceResponse(ServiceResponse, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  

  router.post("/receipt/:sale_order_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(ReceiptSchema),  async (req: Request, res: Response) => {
      try {
        const sale_order_id = req.params.sale_order_id;
        const receipt_date = req.body.receipt_date;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await saleOrderService.receiptDate(sale_order_id, receipt_date , employee_id);
        handleServiceResponse(ServiceResponse, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.post("/expected-receipt/:sale_order_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(ExpectedReceiptSchema), async (req: Request, res: Response) => {
      try {
        const sale_order_id = req.params.sale_order_id;
        const expected_receipt_date = req.body.expected_receipt_date;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await saleOrderService.expectedReceiptDate(sale_order_id, expected_receipt_date , employee_id);
        handleServiceResponse(ServiceResponse, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.put("/close-sale/:sale_order_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
      try {
        const sale_order_id = req.params.sale_order_id;
        const sale_order_status_remark = req.body.sale_order_status_remark;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await saleOrderService.closeSale(sale_order_id ,sale_order_status_remark ,employee_id);
        handleServiceResponse(ServiceResponse, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  router.put("/reject-sale/:sale_order_id?", authenticateToken, authorizeByName("ใบสั่งขาย", ["A"]), validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
      try {
        const sale_order_id = req.params.sale_order_id;
        const sale_order_status_remark = req.body.sale_order_status_remark;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await saleOrderService.rejectSale(sale_order_id ,sale_order_status_remark ,employee_id);
        handleServiceResponse(ServiceResponse, res);
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  );

  return router;
})();