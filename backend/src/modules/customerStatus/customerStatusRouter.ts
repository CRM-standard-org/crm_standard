import express, { Request, Response } from 'express';
import { handleServiceResponse, validateRequest } from '@common/utils/httpHandlers';
import authenticateToken from '@common/middleware/authenticateToken';
import { authorizeByName } from '@common/middleware/permissions';
import { customerStatusService } from './customerStatusService';
import {
  CreateCustomerStatusSchema,
  UpdateCustomerStatusSchema,
  DeleteCustomerStatusSchema,
  GetAllCustomerStatusSchema,
  GetCustomerStatusByIdSchema,
  SelectCustomerStatusSchema,
} from './customerStatusModel';

export const customerStatusRouter = (() => {
  const router = express.Router();

  router.post('/create', authenticateToken, authorizeByName('กำหนดข้อมูลพื้นฐานลูกค้า', ['A']), validateRequest(CreateCustomerStatusSchema), async (req: Request, res: Response) => {
    const payload = req.body;
    const employee_id = req.token.payload.uuid;
    const serviceResponse = await customerStatusService.create(payload, employee_id);
    handleServiceResponse(serviceResponse, res);
  });

  router.get('/select', authenticateToken, authorizeByName('กำหนดข้อมูลพื้นฐานลูกค้า', ['A']), validateRequest(SelectCustomerStatusSchema), async (req: Request, res: Response) => {
    const search = (req.query.search as string) || '';
    const serviceResponse = await customerStatusService.select(search);
    handleServiceResponse(serviceResponse, res);
  });

  router.get('/get', authenticateToken, authorizeByName('กำหนดข้อมูลพื้นฐานลูกค้า', ['A']), validateRequest(GetAllCustomerStatusSchema), async (req: Request, res: Response) => {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '50', 10);
    const search = (req.query.search as string) || '';
    const serviceResponse = await customerStatusService.findAll(page, limit, search);
    handleServiceResponse(serviceResponse, res);
  });

  router.get('/get/:customer_status_id', authenticateToken, authorizeByName('กำหนดข้อมูลพื้นฐานลูกค้า', ['A']), validateRequest(GetCustomerStatusByIdSchema), async (req: Request, res: Response) => {
    const customer_status_id = req.params.customer_status_id;
    const serviceResponse = await customerStatusService.findById(customer_status_id);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/update/:customer_status_id', authenticateToken, authorizeByName('กำหนดข้อมูลพื้นฐานลูกค้า', ['A']), validateRequest(UpdateCustomerStatusSchema), async (req: Request, res: Response) => {
    const customer_status_id = req.params.customer_status_id;
    const payload = req.body;
    const employee_id = req.token.payload.uuid;
    const serviceResponse = await customerStatusService.update(customer_status_id, payload, employee_id);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/delete/:customer_status_id', authenticateToken, authorizeByName('กำหนดข้อมูลพื้นฐานลูกค้า', ['A']), validateRequest(DeleteCustomerStatusSchema), async (req: Request, res: Response) => {
    const customer_status_id = req.params.customer_status_id;
    const serviceResponse = await customerStatusService.delete(customer_status_id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
