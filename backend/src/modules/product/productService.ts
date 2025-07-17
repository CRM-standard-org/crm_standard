import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { productRepository } from '@modules/product/productRepository';
import { TypePayloadProduct } from '@modules/product/productModel';
import { select } from '@common/models/selectData';


export const productService = {
    
    create: async (payload: TypePayloadProduct, employee_id : string ) => {
        try{
            const checkName = await productRepository.findByName(payload.product_name);
            if(checkName){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Product name already exists",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }

            await productRepository.create(
                payload,
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Product created successfully.",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create product :" + (ex as Error).message;
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
                "product",
                ["product_name"],
                ["product_id" , "product_name"],
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
            const errorMessage = "Error get all product :" + (ex as Error).message;
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
            const data = await productRepository.fineAllAsync(page , limit , search);
            
            const totalCount = await productRepository.count(search);
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
            const errorMessage = "Error get all product :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (product_id: string ) => {
        try{
            const data = await productRepository.findById(product_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get product by id success",
                data,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error getproduct by id :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    update: async (product_id : string , payload : TypePayloadProduct , employee_id : string ) => {
        try{
            const check = await productRepository.findById(product_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Product not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            const {
                product_name,
                product_description,
                unit_price,
                unit_id,
                group_product_id,
            } = { ...check ,...payload } as TypePayloadProduct;

            const data = await productRepository.update(    
                product_id , 
                {
                    product_name,
                    product_description,
                    unit_price,
                    unit_id,
                    group_product_id,
                },
                employee_id
            );
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update product success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error update product :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );

        }
    },

    delete: async (product_id: string) => {
        try{
            const check = await productRepository.findById(product_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Product not found.",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }
            await productRepository.delete(product_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete product success",
                null,
                StatusCodes.OK
            )
        } catch (ex) {
            const errorMessage = "Error delete product :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                (ex as any).code === 'P2003' ? "Deletion failed: this data is still in use" : errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
        
    }
}