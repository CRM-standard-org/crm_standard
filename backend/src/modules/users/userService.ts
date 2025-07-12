import {Response} from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { userRepository } from "@modules/users/userRepository";
import { TypePayloadUser } from "@modules/users/userModel";
import { users } from "@prisma/client";
import bcrypt from "bcrypt";
import { jwtGenerator } from "@common/utils/jwtGenerator";

export const userService = {
  
    login: async (payload: TypePayloadUser, res: Response) => {
        try {
            const checkUser = await userRepository.findByUsername(payload.username);
            if(!checkUser){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "The username or password is incorrect.",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            const password = payload.password;
            const passwordDB = checkUser.password;
            
            const isValidPassword = await bcrypt.compare(password, passwordDB);
            if (!isValidPassword) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "The username or password is incorrect.",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            
            const uuid = checkUser.employee_id;

            const dataPayload = {
                uuid: uuid,
            }
            const token = await jwtGenerator.generate(dataPayload);
            res.cookie('token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV !== 'production',
                maxAge: (10 * 60 * 60 * 1000 )
            });
            return new ServiceResponse(
                ResponseStatus.Success,
                "User authenticated successfully.",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error create user :" + (ex as Error).message;
            return new ServiceResponse(
              ResponseStatus.Failed,
              errorMessage,
              null,
              StatusCodes.INTERNAL_SERVER_ERROR
            );  
        }
    },

    logout: (res: Response) => {
        try {
            res.clearCookie('token', {
                httpOnly: true, 
                secure: process.env.NODE_ENV !== 'production', 
                sameSite: 'strict'
            });
    
            return new ServiceResponse(
                ResponseStatus.Success,
                "User logged out successfully.",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error during logout: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );  
        }
    },

    authStatus:(req: any) => {
        try {
            const token = req.cookies.token;
            if (token) {
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "User authenticated successfully",
                    null,
                    StatusCodes.OK
                );
            }else {
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "Authentication required",
                    null,
                    StatusCodes.OK
                )
            }  
        } catch (ex) {
            const errorMessage = "Error auth status: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );  
        }
    },
}