import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { groupProductRepository } from '@modules/groupProduct/groupProductRepository';
import { TypePayloadGroupProduct } from '@modules/groupProduct/groupProductModel';
import { select } from '@common/models/selectData';


export const groupProductService = {
    
    create: async (payload: TypePayloadGroupProduct, employee_id : string ) => {
        try{
            const checkName = await groupProductRepository.findByName(payload.group_product_name);
            if(checkName){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Group product name already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }

            await groupProductRepository.create(
                payload,
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Group product created successfully.",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create group product :" + (ex as Error).message;
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
                "groupProduct",
                ["group_product_name"],
                ["group_product_id" , "group_product_name"],
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
            const errorMessage = "Error get all group product :" + (ex as Error).message;
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
            const data = await groupProductRepository.fineAllAsync(page , limit , search);
            
            const totalCount = await groupProductRepository.count(search);
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
            const errorMessage = "Error get all group product :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (group_product_id: string ) => {
        try{
            const data = await groupProductRepository.findById(group_product_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get group product by id success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error get group product by id :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    update: async (group_product_id : string , payload : TypePayloadGroupProduct , employee_id : string ) => {
        try{
            const check = await groupProductRepository.findById(group_product_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Group product not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            const {
                group_product_name,
            } = { ...check ,...payload } as TypePayloadGroupProduct;

            const data = await groupProductRepository.update(    
                group_product_id , 
                {
                    group_product_name,
                },
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update group product success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error update group product :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },

    delete: async (group_product_id: string) => {
        try{
            const check = await groupProductRepository.findById(group_product_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Group product not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            await groupProductRepository.delete(group_product_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete group product success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error delete group product :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                (ex as any).code === 'P2003' ? "Deletion failed: this data is still in use" : errorMessage ,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
        
    }
}