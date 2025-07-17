import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { currencyRepository } from '@modules/currency/currencyRepository';
import { TypePayloadCurrency } from '@modules/currency/currencyModel';
import { select } from '@common/models/selectData';

export const currencyService = {
    
    create: async (payload: TypePayloadCurrency, employee_id : string ) => {
        try{
            const checkName = await currencyRepository.findByName(payload.currency_name);
            if(checkName){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Currency name already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }

            await currencyRepository.create(
                payload,
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Currency created successfully.",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create currency :" + (ex as Error).message;
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
                "currency",
                ["currency_name"],
                ["currency_id" , "currency_name"],
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
            const errorMessage = "Error select all currency :" + (ex as Error).message;
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
            const data = await currencyRepository.fineAllAsync(page , limit , search);
            
            const totalCount = await currencyRepository.count(search);
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
            const errorMessage = "Error get all currency :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (currency_id: string ) => {
        try{
            const data = await currencyRepository.findById(currency_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get currency by id success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get currency by id :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    update: async (currency_id : string , payload : TypePayloadCurrency , employee_id : string ) => {
        try{
            const check = await currencyRepository.findById(currency_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Currency not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            const {
                currency_name,
            } = { ...check ,...payload } as TypePayloadCurrency;

            const data = await currencyRepository.update(    
                currency_id , 
                {
                    currency_name,
                },
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update currency success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error update currency :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },

    delete: async (currency_id: string) => {
        try{
            const check = await currencyRepository.findById(currency_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Currency not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            await currencyRepository.delete(currency_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete currency success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error delete currency :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                (ex as any).code === 'P2003' ? "Deletion failed: this data is still in use" : errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
        
    }
}