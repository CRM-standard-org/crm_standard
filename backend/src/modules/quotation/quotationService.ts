import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from '@common/models/serviceResponse';
import { quotationRepository } from '@modules/quotation/quotationRepository';
import { TypePayloadQuotation , Filter , TypeUpdateCompany , UpdateItem , AddItem ,TypeUpdatePayment } from '@modules/quotation/quotationModel';
import { select  } from '@common/models/selectData';
import { rejects } from 'assert';


export const quotationService = {
    
    create: async (payload: TypePayloadQuotation, employee_id : string , files: Express.Multer.File[] ) => {
        try{
            const data = await quotationRepository.create(payload , employee_id , files);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Quotation created successfully",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create quotation :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    findAll: async (page: number , limit: number , searchText: string , payload : Filter ) => {
        try{
            const totalCount = await quotationRepository.count(searchText , payload );
            const data = await quotationRepository.findAll(page , limit , searchText , payload);
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
    findById: async (quotation_id: string) => {
        try{
            const data = await quotationRepository.findById(quotation_id);
            if(!data){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    data,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get by customer id success",
                data,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error get by quotation id :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    updateCompany: async (quotation_id: string , payload: TypeUpdateCompany , employee_id: string) => {
        try{

            const check = await quotationRepository.findById(quotation_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
    
            const {
                customer_id,
                priority,
                issue_date ,
                team_id,
                responsible_employee,
                price_date,
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
                expected_closing_date,
            } = {...check , ...payload} as TypeUpdateCompany
    
            const data = await quotationRepository.updateCompany(
                quotation_id,
                {
                    customer_id,
                    priority,
                    issue_date ,
                    team_id,
                    responsible_employee,
                    price_date,
                    expected_closing_date,
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
                },
                employee_id
            );
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation Invalid status",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update quotation success",
                null,
                StatusCodes.OK
            );
        } catch (ex){
            const errorMessage = "Error update quotation :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    addItem: async (quotation_id: string , payload: AddItem , employee_id : string ) => {
        try{
            const checkQuotation = await quotationRepository.findById(quotation_id);
            if(!checkQuotation){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            const { currency_id }  = {...checkQuotation , ...payload}
            const data = await quotationRepository.addProductItem(
                quotation_id, 
                {
                    currency_id,
                    items: payload.items
                } , 
                employee_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation item not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Add item success",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create quotation :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    updateItem: async (quotation_id: string , payload: UpdateItem , employee_id: string) => {
        try{

            const check = await quotationRepository.findById(quotation_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
    
            const {
                quotation_item_id,
                product_id,
                quotation_item_count ,
                unit_id,
                unit_price,
                unit_discount,
                unit_discount_percent,
                quotation_item_price,
                group_product_id,
            } = {...check , ...payload} as UpdateItem
    
            const data = await quotationRepository.updateProductItem(
                quotation_id,
                {
                    quotation_item_id,
                    product_id,
                    quotation_item_count ,
                    unit_id,
                    unit_price,
                    unit_discount,
                    unit_discount_percent,
                    quotation_item_price,
                    group_product_id,
                },
                employee_id
            );
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation item not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update quotation item success",
                null,
                StatusCodes.OK
            );
        } catch (ex){
            const errorMessage = "Error update  item :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    deleteItem: async (quotation_id:string , quotation_item_id: string , employee_id: string) => {
        try{
            const checkQuotation = await quotationRepository.findById(quotation_id);
            if(!checkQuotation){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            const data = await quotationRepository.deleteProductItem(quotation_id , quotation_item_id , employee_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation item not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            if(data == "min"){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation item already at minimum",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete product item success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error delete item :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    updatePayment: async (quotation_id: string , payload: TypeUpdatePayment , employee_id: string) => {
        try{

            const check = await quotationRepository.findById(quotation_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }

            const {
                total_amount,
                special_discount,
                amount_after_discount ,
                vat_id,
                vat_amount,
                grand_total,
                additional_notes,
                payment_term_name,
                payment_term_day,
                payment_term_installment,
                payment_method_id,
                remark,
                
            } = {...check , ...payload} as TypeUpdatePayment
    
            const data = await quotationRepository.updatePayment(
                quotation_id,
                {
                    total_amount,
                    special_discount,
                    amount_after_discount ,
                    vat_id: vat_id ?? check.vat.vat_id,
                    vat_amount,
                    grand_total,
                    additional_notes,
                    payment_term_name,
                    payment_term_day,
                    payment_term_installment,
                    payment_method_id: payment_method_id ?? check.payment_method.payment_method_id,
                    remark,
                    payment_term: payload.payment_term
                },
                employee_id
            );
            if(data == 'failed'){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Total amount does not match",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update quotation payment success",
                null,
                StatusCodes.OK
            );
        } catch (ex){
            const errorMessage = "Error update quotation payment :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    addFile: async (quotation_id:string, employee_id : string , files: Express.Multer.File[] ) => {
        try{
            const check = await quotationRepository.findById(quotation_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await quotationRepository.addQuotationFile(quotation_id , employee_id , files);
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
    deleteFile: async (quotation_file_id: string ) => {
        try{
            const data = await quotationRepository.deleteQuotationFile(quotation_file_id);
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
    cancel: async (quotation_id: string , quotation_status: string , quotation_status_remark: string , employee_id: string) => {
        try{
            const check = await quotationRepository.findById(quotation_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            await quotationRepository.cancel(quotation_id , quotation_status , quotation_status_remark , employee_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Cancel quotation success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error cancel quotation :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    requestApprove: async (quotation_id: string , quotation_status: string , quotation_status_remark: string , employee_id: string ) => {
        try{
            const check = await quotationRepository.findById(quotation_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await quotationRepository.requestApprove(quotation_id,quotation_status,quotation_status_remark,employee_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Request approve failed",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Request approve quotation success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error request approve quotation :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    requestEdit: async (quotation_id: string , quotation_status: string , quotation_status_remark: string , employee_id: string ) => {
        try{
            const check = await quotationRepository.findById(quotation_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await quotationRepository.requestEdit(quotation_id,quotation_status,quotation_status_remark,employee_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Request edit failed",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Request edit quotation success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error request edit quotation :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    approve: async (quotation_id: string , quotation_status: string , quotation_status_remark: string , employee_id: string ) => {
        try{
            const check = await quotationRepository.findById(quotation_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await quotationRepository.approve(quotation_id,quotation_status,quotation_status_remark,employee_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Approve failed",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Approve quotation success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error approve quotation :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    reject: async (quotation_id: string , quotation_status: string , quotation_status_remark: string , employee_id: string ) => {
        try{
            const check = await quotationRepository.findById(quotation_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await quotationRepository.reject(quotation_id,quotation_status,quotation_status_remark,employee_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Reject failed",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Reject quotation success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error reject quotation :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    cancelApprove: async (quotation_id: string , quotation_status: string , quotation_status_remark: string , employee_id: string ) => {
        try{
            const check = await quotationRepository.findById(quotation_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await quotationRepository.cancelApprove(quotation_id,quotation_status,quotation_status_remark,employee_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Cancel approve failed",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Cancel approve quotation success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error cancel approve quotation :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    rejectDeal: async (quotation_id: string , quotation_status: string , quotation_status_remark: string , employee_id: string ) => {
        try{
            const check = await quotationRepository.findById(quotation_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await quotationRepository.rejectDeal(quotation_id,quotation_status,quotation_status_remark,employee_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Reject deal failed",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Reject deal quotation success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error reject deal quotation :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    closeDeal: async (quotation_id: string , quotation_status: string , quotation_status_remark: string , employee_id: string ) => {
        try{
            const check = await quotationRepository.findById(quotation_id);
            if(!check){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Quotation not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const data = await quotationRepository.closeDeal(quotation_id,quotation_status,quotation_status_remark,employee_id);
            if(data == null){
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Close deal failed",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Close deal quotation success",
                null,
                StatusCodes.OK
            )
        }catch (ex){
            const errorMessage = "Error close deal quotation :" + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
}