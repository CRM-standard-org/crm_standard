import { StatusCodes } from "http-status-codes";
import {roleRepository} from "@modules/role/roleRepository";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";

export const roleService = {
    findAll: async () => {
        try {
            const role = await roleRepository.findAll();
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                role,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error Find All Role :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    findById: async (
        
        role_id: string) => {
        try {
            const role = await roleRepository.findById2(role_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                role,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error Find All Role :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
}

