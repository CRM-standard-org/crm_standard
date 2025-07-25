import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { saleOrderRepository } from '@modules/saleOrder/saleOrderRepository';
import { Filter , TypeUpdateCompany , TypeUpdatePaymentDetail , Payment , PaymentUpdate} from '@modules/saleOrder/saleOrderModel';
import { select  } from '@common/models/selectData';
import { rejects } from 'assert';

export const saleOrderService = {
    findAll: async (page: number , limit: number , searchText: string , payload : Filter ) => {
        try{
            const totalCount = await saleOrderRepository.count(searchText , payload );
            const data = await saleOrderRepository.findAll(page , limit , searchText , payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    data : data
                },
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error get all :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    findById: async (sale_order_id: string) => {
        try{
            const data = await saleOrderRepository.findById(sale_order_id);
            if(!data){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    data,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get by sale order id success",
                data,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error get by sale order id :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    updateCompany: async (sale_order_id: string , payload: TypeUpdateCompany , employee_id: string) => {
        try{

            const check = await saleOrderRepository.findById(sale_order_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
    
            const {
                shipping_method,
                shipping_remark,
                expected_delivery_date,
                place_name,
                address,
                country_id,
                province_id,
                district_id,
                contact_name,
                contact_email,
                contact_phone,
            } = {...check , ...payload} as TypeUpdateCompany
    
            const data = await saleOrderRepository.updateCompany(
                sale_order_id,
                {
                    shipping_method,
                    shipping_remark,
                    expected_delivery_date,
                    place_name,
                    address,
                    country_id: country_id ?? check.country.country_id,
                    province_id: province_id ?? check.province.province_id,
                    district_id: district_id ?? check.district.district_id,
                    contact_name,
                    contact_email,
                    contact_phone,
                },
                employee_id
            );
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order Invalid status",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update sale order success",
                null,
                StatusCodes.OK
            );
        } catch (ex){
            const errorMessage = "Error update sale order :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    updatePaymentDetail: async (sale_order_id: string , payload: TypeUpdatePaymentDetail , employee_id: string) => {
        try{

            const check = await saleOrderRepository.findById(sale_order_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
    
            const {
                additional_notes,
                remark,
            } = {...check , ...payload} as TypeUpdatePaymentDetail
    
            const data = await saleOrderRepository.updatePaymentDetail(
                sale_order_id,
                {
                    additional_notes,
                    remark,
                },
                employee_id
            );
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update sale order payment success",
                null,
                StatusCodes.OK
            );
        } catch (ex){
            const errorMessage = "Error update sale order payment :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    addFile: async (sale_order_id:string, employee_id : string , files: Express.Multer.File[] ) => {
        try{
            const check = await saleOrderRepository.findById(sale_order_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await saleOrderRepository.addFile(sale_order_id , employee_id , files);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Add file success",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error add file :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    deleteFile: async (sale_order_id: string ) => {
        try{
            const data = await saleOrderRepository.deleteFile(sale_order_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "File not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete file success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error delete file :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    payment: async (sale_order_id: string , payload: Payment , employee_id: string , files: Express.Multer.File[]) => {
        try{
            const check = await saleOrderRepository.findById(sale_order_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await saleOrderRepository.payment(sale_order_id, payload , employee_id , files);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Can not paid",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Add payment success",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error add payment :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    paymentFile: async (payment_log_id: string) => {
        try{
            const data = await saleOrderRepository.findByIdPaymentFile(payment_log_id);
            if(!data){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "payment log id not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get success",
                data,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error get file payment :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    paymentUpdate: async (sale_order_id: string , payload: PaymentUpdate , employee_id: string , files: Express.Multer.File[]) => {
        try{
            const spread = await saleOrderRepository.findByPaymentId(sale_order_id, payload.payment_log_id);

            const {
                payment_log_id,
                payment_date,
                payment_term_name,
                amount_paid,
                payment_method_id,
                payment_remark,
            } = {...spread , ...payload}
            const data = await saleOrderRepository.updatePayment(
                sale_order_id, 
                {
                    payment_log_id,
                    payment_date,
                    payment_term_name,
                    amount_paid,
                    payment_method_id,
                    payment_remark,
                } , 
                employee_id , 
                files);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            if(data == "failed"){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Can not edit",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "update payment success",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error edit payment :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    deletePayment: async (sale_order_id: string , payment_log_id: string, employee_id: string) => {
        try{
            const data = await saleOrderRepository.deletePayment(sale_order_id,payment_log_id,employee_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Payment record not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete payment record success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error delete payment record :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    manufactureDate: async (sale_order_id: string , manufacture_factory_date:string, employee_id:string ) => {
        try{
            const check = await saleOrderRepository.findById(sale_order_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await saleOrderRepository.manufactureDate(sale_order_id,manufacture_factory_date,employee_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update manufacture success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error Update manufacture :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    expectedManufactureDate: async (sale_order_id: string , expected_manufacture_factory_date:string, employee_id:string ) => {
        try{
            const check = await saleOrderRepository.findById(sale_order_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await saleOrderRepository.expectedManufactureDate(sale_order_id,expected_manufacture_factory_date,employee_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update expected manufacture success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error Update manufacture expected :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    deliveryDate: async (sale_order_id: string , delivery_date_success:string, employee_id:string ) => {
        try{
            const check = await saleOrderRepository.findById(sale_order_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await saleOrderRepository.deliveryDate(sale_order_id,delivery_date_success,employee_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update delivery success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error Update delivery :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    expectedDeliveryDate: async (sale_order_id: string , expected_delivery_date_success:string, employee_id:string ) => {
        try{
            const check = await saleOrderRepository.findById(sale_order_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await saleOrderRepository.expectedDeliveryDate(sale_order_id,expected_delivery_date_success,employee_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update expected delivery success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error Update expected delivery :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    receiptDate: async (sale_order_id: string , receipt_date:string, employee_id:string ) => {
        try{
            const check = await saleOrderRepository.findById(sale_order_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await saleOrderRepository.receiptDate(sale_order_id,receipt_date,employee_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update receipt success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error Update receipt :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    expectedReceiptDate: async (sale_order_id: string , expected_receipt_date:string, employee_id:string ) => {
        try{
            const check = await saleOrderRepository.findById(sale_order_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await saleOrderRepository.expectedReceiptDate(sale_order_id,expected_receipt_date,employee_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update expected receipt success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error Update expected receipt :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    closeSale: async (sale_order_id: string , remark:string, employee_id:string ) => {
        try{
            const check = await saleOrderRepository.findById(sale_order_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await saleOrderRepository.closeSale(sale_order_id, remark, employee_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Awaiting receipt or full payment",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Close sale success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error close sale :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    rejectSale: async (sale_order_id: string , remark:string, employee_id:string ) => {
        try{
            const check = await saleOrderRepository.findById(sale_order_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Sale order not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await saleOrderRepository.closeSale(sale_order_id, remark, employee_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Awaiting Receipt",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Reject sale success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error reject sale :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    
}