import express , {Request, Response, Router} from "express";

import { 
    handleServiceResponse, 
    validateRequest 
} from "@common/utils/httpHandlers";
import { authorizeByName } from "@common/middleware/permissions";
import { customerService } from "@modules/customer/customerService";
import { CreateSchema , DeleteSchema , GetAllSchema , GetByIdSchema  , AddCustContactSchema , AddAddressSchema , MainContactSchema , MainAddressSchema , UpdateContactSchema , UpdateAddressSchema , DeleteContactSchema , DeleteAddressSchema , UpdateSchema } from "@modules/customer/customerModel";
import authenticateToken from "@common/middleware/authenticateToken";

export const customerRouter = (() => {
    const router = express.Router();

    router.post("/create" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(CreateSchema), async (req: Request, res: Response) => {
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await customerService.create(payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.post("/customer-contact/:customer_id" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(AddCustContactSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await customerService.addCustContact(customer_id , payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.post("/customer-address/:customer_id" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(AddAddressSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await customerService.addAddress(customer_id , payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.post("/get" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(GetAllSchema), async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const searchText = (req.query.search as string) || "";
        const payload = req.body;
        const ServiceResponse = await customerService.findAll(page , limit , searchText , payload);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/get/:customer_id" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const ServiceResponse = await customerService.findById(customer_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/update/:customer_id" , authenticateToken , authorizeByName("การจัดการลูกค้า" , ["A"]) , validateRequest(UpdateSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await customerService.update(customer_id, payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/main-contact/:customer_id" , authenticateToken , authorizeByName("การจัดการลูกค้า" , ["A"]) , validateRequest(MainContactSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const customer_contact_id = req.body.customer_contact_id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await customerService.mainCustContact(customer_id, customer_contact_id, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/main-address/:customer_id" , authenticateToken , authorizeByName("การจัดการลูกค้า" , ["A"]) , validateRequest(MainAddressSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const address_id = req.body.address_id;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await customerService.mainAddress(customer_id, address_id, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/update-contact/:customer_id" , authenticateToken , authorizeByName("การจัดการลูกค้า" , ["A"]) , validateRequest(UpdateContactSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await customerService.updateCustContact(customer_id, payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.put("/update-address/:customer_id" , authenticateToken , authorizeByName("การจัดการลูกค้า" , ["A"]) , validateRequest(UpdateAddressSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const payload = req.body;
        const employee_id = req.token.payload.uuid;
        const ServiceResponse = await customerService.updateAddress(customer_id, payload, employee_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.delete("/delete/:customer_id" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(DeleteSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const ServiceResponse = await customerService.delete(customer_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.post("/delete-contact/:customer_id" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(DeleteContactSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const customer_contact_id = req.body.customer_contact_id;
        const ServiceResponse = await customerService.deleteCustContact(customer_id , customer_contact_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.post("/delete-address/:customer_id" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(DeleteAddressSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const address_id = req.body.address_id;
        const ServiceResponse = await customerService.deleteAddress(customer_id , address_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/select-customer-contact/:customer_id?" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const ServiceResponse = await customerService.selectCustContact(customer_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/select-address/:customer_id?" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const ServiceResponse = await customerService.selectAddress(customer_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/activity/:customer_id?" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const ServiceResponse = await customerService.activity(customer_id, page , limit);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/follow-quotation/:customer_id?" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const ServiceResponse = await customerService.followQuotation(customer_id);
        handleServiceResponse(ServiceResponse, res);
    })

    router.get("/sale-total/:customer_id?" , authenticateToken , authorizeByName("การจัดการลูกค้า", ["A"]), validateRequest(GetByIdSchema), async (req: Request, res: Response) => {
        const customer_id = req.params.customer_id;
        const ServiceResponse = await customerService.saleTotal(customer_id);
        handleServiceResponse(ServiceResponse, res);
    })


    return router;
})();