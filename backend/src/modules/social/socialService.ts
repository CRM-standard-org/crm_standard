import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { SocialRepository } from '@modules/social/socialRepository';
import { select  } from '@common/models/selectData';
import { TypePayloadSocial } from '@modules/social/socialModel';
import { Social } from '@prisma/client';


export const socialService = {

    select: async (search : string ) => {
        try{
            const social = await select(
                "social",
                ["name"],
                ["social_id" , "name"],
                { name: "created_at" , by : "asc"},
                search
            )
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
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