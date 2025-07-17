import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { paymentMethodRepository } from '@modules/paymentMethod/paymentMethodRepository';
import { TypePayloadPaymentMethod } from '@modules/paymentMethod/paymentMethodModel';
import { select } from '@common/models/selectData';

export const paymentMethodService = {
    
    create: async (payload: TypePayloadPaymentMethod, employee_id : string ) => {
        try{
            const checkName = await paymentMethodRepository.findByName(payload.payment_method_name);
            if(checkName){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Payment method name already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }

            await paymentMethodRepository.create(
                payload,
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Payment method created successfully.",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create payment method :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    select: async (search : string ) => {
        try{
            const data = await select(
                "paymentMethod",
                ["payment_method_name"],
                ["payment_method_id" , "payment_method_name"],
                { name: "created_at" , by : "asc"},
                search
            )
            return new ServiceResponse(
                ResponseStatus.Success,
                "Select all success",
                {
                    data : data,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error select all payment method :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    fineAll: async (page : number , limit : number , search : string ) => {
        try{
            const data = await paymentMethodRepository.fineAllAsync(page , limit , search);
            
            const totalCount = await paymentMethodRepository.count(search);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    data : data,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all payment method :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (payment_method_id: string ) => {
        try{
            const data = await paymentMethodRepository.findById(payment_method_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get payment method by id success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get payment method by id :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    update: async (payment_method_id : string , payload : TypePayloadPaymentMethod , employee_id : string ) => {
        try{
            const check = await paymentMethodRepository.findById(payment_method_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Payment method not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            const {
                payment_method_name,
            } = { ...check ,...payload } as TypePayloadPaymentMethod;

            const data = await paymentMethodRepository.update(    
                payment_method_id , 
                {
                    payment_method_name,
                },
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update payment method success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error update payment method :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },

    delete: async (payment_method_id: string) => {
        try{
            const check = await paymentMethodRepository.findById(payment_method_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Payment method not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            await paymentMethodRepository.delete(payment_method_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete payment method success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error delete payment method :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                (ex as any).code === 'P2003' ? "Deletion failed: this data is still in use" : errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
        
    }
}