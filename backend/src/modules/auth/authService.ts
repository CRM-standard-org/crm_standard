import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { authRepository } from '@modules/auth/authRepository';
import { TypePayloadAuth } from '@modules/auth/authModel';
import bcrypt from 'bcrypt';
import { jwtGenerator } from '@common/utils/jwtGenerator';
import { UUID } from 'crypto';

export const authService = {

    login: async (payload: TypePayloadAuth , res: Response) => {
        try{
            const checkEmployee = await authRepository.findByUsername(payload.username);
            if(!checkEmployee){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "The username or password is incorrect.",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            const password = payload.password;
            const passwordDB = checkEmployee.password;

            const inValidPassword = await bcrypt.compare(password, passwordDB);
            if(!inValidPassword){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "The username or password is incorrect.",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            const uuid = checkEmployee.employee_id;

            const dataPayload = {
                uuid: uuid,
            }
            const token = await jwtGenerator.generate(dataPayload);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'production',
                maxAge:  (10 * 60 * 60 * 1000)
            });
            return new ServiceResponse(
                ResponseStatus.Success,
                "User authenticated successfully.",
                null,
                StatusCodes.OK
            )
        }catch (ex) {
            const errorMessage = "Error create user : " + (ex as Error).message;
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
    authStatus: async (req: any, user_id: UUID) => {
        try {
            const token = req.cookies.token;
            const emp = await authRepository.authCurrentUser(user_id);
            if (token && emp) {
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "User authenticated successfully",
                    emp,
                    StatusCodes.OK
                );
            }else {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Authentication required",
                    null,
                    StatusCodes.UNAUTHORIZED
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