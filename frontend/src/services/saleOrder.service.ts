import {
    ADD_SALEORDER_FILE,
    CREATE_PAYMENT_LOG,
    DELETE_PAYMENT_LOG,
    DELETE_SALEORDER_FILE,
    GET_ALL_SALEORDER,
    GET_PAYMENT_FILE,
    GET_SALEORDER_BY_ID,
    UPDATE_PAYMENT_LOG,
    UPDATE_SALEORDER_COMPANY,
    UPDATE_SALEORDER_PAYMENT,
} from "@/apis/endpoint.api";

import mainApi from "@/apis/main.api";
import { PayLoadCreateSaleOrderPaymentLog, PayLoadDeleteSaleOrderPaymentLog, PayLoadFilterSaleOrder } from "@/types/requests/request.saleOrder";
import { PayLoadUpdateSaleOrderCompany, PayLoadUpdateSaleOrderPayment, PayLoadUpdateSaleOrderPaymentLog } from "@/types/requests/request.saleOrder";
import { APIResponseType } from "@/types/response";
import { AllSaleOrderResponse, TypeSaleOrderPaymentFileResponse, SaleOrderResponse } from "@/types/response/response.saleorder";

//sale order 
export const getAllSaleOrder = async (page: string, pageSize: string, searchText: string, payload?: PayLoadFilterSaleOrder) => {
    try {
        const { data: response } = await mainApi.post<AllSaleOrderResponse>(
            `${GET_ALL_SALEORDER}?page=${page}&limit=${pageSize}&search=${searchText}`,
            payload
        );
        // const {data:response} = await mainApi.get<AllCustomerResponse>(
        //     `${GET_ALL_CUSTOMER}?page=${page}&pageSize=${pageSize}&search=${searchText}`
        // );
        return response;
    } catch (error) {
        console.error("Error get All sale order", error);
        throw error;
    }
}
// get by id
export const getSaleOrder = async (saleorderId: string) => {
    try {
        const encodedSaleorderId = encodeURIComponent(saleorderId);

        const { data: response } = await mainApi.get<SaleOrderResponse>(
            `${GET_SALEORDER_BY_ID}/${encodedSaleorderId}`
        );
        return response;
    } catch (error) {
        console.error("Error get sale order by Id", error);
        throw error;
    }
}
// get by id
export const getPaymentFile = async (paymentLogId: string) => {
    try {
        const encodedPaymentLogId = encodeURIComponent(paymentLogId);

        const { data: response } = await mainApi.get<APIResponseType<TypeSaleOrderPaymentFileResponse>>(
            `${GET_PAYMENT_FILE}/${encodedPaymentLogId}`
        );
        return response;
    } catch (error) {
        console.error("Error get sale order payment file by Id", error);
        throw error;
    }
}

// update company data in saleorder
export const updateCompanySaleOrder = async (saleorderId: string, payload: PayLoadUpdateSaleOrderCompany) => {
    try {
        const encodedSaleorderId = encodeURIComponent(saleorderId);

        const { data: response } = await mainApi.put(`${UPDATE_SALEORDER_COMPANY}/${encodedSaleorderId}`, payload);
        return response;
    } catch (error) {
        console.error("Error update company saleorder", error);
        throw error;
    }
};
// update payment data in saleorder

export const updatePaymentSaleOrder = async (saleorderId: string, payload: PayLoadUpdateSaleOrderPayment) => {
    try {
        const encodedSaleorderId = encodeURIComponent(saleorderId);

        const { data: response } = await mainApi.put(`${UPDATE_SALEORDER_PAYMENT}/${encodedSaleorderId}`, payload);
        return response;
    } catch (error) {
        console.error("Error update payment saleorder", error);
        throw error;
    }
};
//add file  in saleorder

export const addFileInSaleOrder = async (saleorderId: string, saleOrderFiles: File[]) => {
    try {
        const formData = new FormData();

        if (saleOrderFiles && saleOrderFiles.length > 0) {
            saleOrderFiles.forEach((file) => {
                formData.append("sale-order", file);
            });
        }
        const encodedSaleOrderId = encodeURIComponent(saleorderId);

        const { data: response } = await mainApi.post(`${ADD_SALEORDER_FILE}/${encodedSaleOrderId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("service", response)

        return response;

    } catch (error) {
        console.error("Error add file saleorder", error);
        throw error;
    }
};
//delete file  in saleorder

export const deleteFileInSaleOrder = async (fileId: string) => {
    try {
        const encodedFileId = encodeURIComponent(fileId);
        
        const { data: response } = await mainApi.delete(`${DELETE_SALEORDER_FILE}/${encodedFileId}`);
        return response;
    } catch (error) {
        console.error("Error delete file saleorder", error);
        throw error;
    }
};
// create sale order payment log
export const createSaleOrderPaymentLog = async (
    saleorderId: string, 
    payload: PayLoadCreateSaleOrderPaymentLog,
    paymentLogFiles:File[]
) => {
    try {
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload));

        if(paymentLogFiles && paymentLogFiles.length > 0){
            paymentLogFiles.forEach((file)=>{
                formData.append("payment", file)
            })
        }
        const encodedSaleorderId = encodeURIComponent(saleorderId);

        const { data: response } = await mainApi.post(`${CREATE_PAYMENT_LOG}/${encodedSaleorderId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("service", response)
        return response;
    } catch (error) {
        console.error("Error update payment saleorder", error);
        throw error;
    }
};
// update saleorder payment log
export const updateSaleOrderPaymentLog = async (
    saleorderId: string, 
    payload: PayLoadUpdateSaleOrderPaymentLog,
    paymentLogFiles:File[]
) => {
    try {
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload));

        if(paymentLogFiles && paymentLogFiles.length > 0){
            paymentLogFiles.forEach((file)=>{
                formData.append("payment", file)
            })
        }
        const encodedSaleorderId = encodeURIComponent(saleorderId);

        const { data: response } = await mainApi.put(`${UPDATE_PAYMENT_LOG}/${encodedSaleorderId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("service", response)
        return response;
    } catch (error) {
        console.error("Error update payment saleorder", error);
        throw error;
    }
};

//add file  in saleorder

export const deleteSaleOrderPaymentLog = async (saleorderId: string, payload: PayLoadDeleteSaleOrderPaymentLog) => {
    try {
       
        const encodedSaleOrderId = encodeURIComponent(saleorderId);

        const { data: response } = await mainApi.post(`${DELETE_PAYMENT_LOG}/${encodedSaleOrderId}`, payload);
        console.log("service", response)

        return response;

    } catch (error) {
        console.error("Error delete saleorder payment log", error);
        throw error;
    }
};