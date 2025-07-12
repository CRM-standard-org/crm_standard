import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { employeeStatusRepository } from '@modules/employeeStatus/employeeStatusRepository';
import { TypePayloademployeeStatus } from '@modules/employeeStatus/employeeStatusModel';
import { employeeStatus } from '@prisma/client';


export const employeeStatusService = {

    fineAll: async (page : number , limit : number , search : string ) => {
        try{
            const social = await employeeStatusRepository.fineAllAsync(page , limit , search);
            const totalCount = await employeeStatusRepository.count(search);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    data : social,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all social :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

  
}