import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { customerStatusRepository } from './customerStatusRepository';
import { TypePayloadCustomerStatus } from './customerStatusModel';

export const customerStatusService = {
  create: async (payload: TypePayloadCustomerStatus, employee_id: string) => {
    try {
      const exist = await customerStatusRepository.findByName(payload.name);
      if (exist) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Customer status name already exists',
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const created = await customerStatusRepository.create(payload, employee_id);
      return new ServiceResponse(
        ResponseStatus.Success,
        'Customer status created successfully',
        created,
        StatusCodes.OK
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error create customer status: ' + (ex as Error).message,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  select: async (search: string) => {
    try {
      const data = await customerStatusRepository.select(search);
      return new ServiceResponse(
        ResponseStatus.Success,
        'Get all success',
        { data },
        StatusCodes.OK
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error select customer status: ' + (ex as Error).message,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  findAll: async (page: number, limit: number, search: string) => {
    try {
      const data = await customerStatusRepository.findAll(page, limit, search);
      const totalCount = await customerStatusRepository.count(search);
      return new ServiceResponse(
        ResponseStatus.Success,
        'Get all success',
        { totalCount, totalPages: Math.ceil(totalCount / limit), data },
        StatusCodes.OK
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error get all customer status: ' + (ex as Error).message,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  findById: async (customer_status_id: string) => {
    try {
      const data = await customerStatusRepository.findById(customer_status_id);
      return new ServiceResponse(
        ResponseStatus.Success,
        'Get customer status by id success',
        data,
        StatusCodes.OK
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error get customer status by id: ' + (ex as Error).message,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  update: async (customer_status_id: string, payload: TypePayloadCustomerStatus, employee_id: string) => {
    try {
      const exist = await customerStatusRepository.findById(customer_status_id);
      if (!exist) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Customer status not found',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      const updated = await customerStatusRepository.update(customer_status_id, payload, employee_id);
      return new ServiceResponse(
        ResponseStatus.Success,
        'Update customer status success',
        updated,
        StatusCodes.OK
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error update customer status: ' + (ex as Error).message,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  delete: async (customer_status_id: string) => {
    try {
      const exist = await customerStatusRepository.findById(customer_status_id);
      if (!exist) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Customer status not found',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await customerStatusRepository.delete(customer_status_id);
      return new ServiceResponse(
        ResponseStatus.Success,
        'Delete customer status success',
        null,
        StatusCodes.OK
      );
    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Error delete customer status: ' + (ex as Error).message,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
