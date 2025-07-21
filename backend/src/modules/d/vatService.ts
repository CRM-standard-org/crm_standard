import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { vatRepository } from '@modules/vat/vatRepository';
import { TypePayloadVat } from '@modules/vat/vatModel';
import { select } from '@common/models/selectData';

export const vatService = {


    select: async (search : string ) => {
        try{
            const data = await vatRepository.select( search );
            return new ServiceResponse(
                ResponseStatus.Success,
                "select success",
                {
                    data : data,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get select :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
  
    
}