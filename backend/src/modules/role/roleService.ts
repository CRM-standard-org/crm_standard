import { StatusCodes } from "http-status-codes";
import {roleRepository} from "@modules/role/roleRepository";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { select  } from '@common/models/selectData';

export const roleService = {
    select: async (search : string ) => {
        try{
            const data = await select(
                "roles",
                ["role_name"],
                ["role_id" , "role_name" ],
                { name: "created_at" , by : "asc"},
                search
            )
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data : data,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all role :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
}

