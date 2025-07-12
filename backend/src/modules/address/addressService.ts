import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { addressRepository } from '@modules/address/addressRepository';
import { TypePayloadAddress } from '@modules/address/addressModel';
import { Address } from '@prisma/client';


export const addressService = {

    findAllMasterAddress: async () => {
        try{
            const address = await addressRepository.select();
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                address,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all address :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

  
}