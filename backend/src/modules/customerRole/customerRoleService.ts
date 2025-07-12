import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { customerRoleRepository } from '@modules/customerRole/customerRoleRepository';
import { TypePayloadCustomerRole } from '@modules/customerRole/customerRoleModel';
import { select  } from '@common/models/selectData';
import { CustomerRole } from '@prisma/client';

export const customerRoleService = {
    
    create: async (payload: TypePayloadCustomerRole, employee_id : string ) => {
        try{
            const checkCustomerRole = await customerRoleRepository.findByname(payload.name);
            if(checkCustomerRole){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer Role name already exists.",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }

            const customerRole = await customerRoleRepository.create(
                {
                    name : payload.name ,
                    description : payload.description
                },
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Character created successfully.",
                customerRole,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create Customer Role :" + (ex as Error).message;
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
            const social = await select(
                "customerRole",
                ["name"],
                ["customer_role_id" , "name"],
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

    fineAll: async (page : number , limit : number , search : string ) => {
        try{
            const customerRole = await customerRoleRepository.fineAllAsync(page , limit , search);
            
            const totalCount = await customerRoleRepository.count(search);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    data : customerRole,
                },
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get all Customer Role :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (customer_role_id: string ) => {
        try{
            const data = await customerRoleRepository.findById(customer_role_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get by customer role id success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get by customer role id :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    update: async (customer_role_id : string , payload : TypePayloadCustomerRole , employee_id : string ) => {
        try{
            const checkCustomerRole = await customerRoleRepository.findById(customer_role_id);
            if(!checkCustomerRole){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer Role not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            const {
                name,
                description 
            } = { ...checkCustomerRole , ...payload } as CustomerRole;

            const data = await customerRoleRepository.update(    
                customer_role_id , 
                {
                    name,
                    description
                },
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update customer role success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error update customer role :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },

    delete: async (customer_role_id: string) => {
        try{
            const checkCustomerRole = await customerRoleRepository.findById(customer_role_id);
            if(!checkCustomerRole){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Customer Role not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            await customerRoleRepository.delete(customer_role_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete customer role success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error delete customer role :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
        
    }
}