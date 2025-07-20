import {
    ADD_FILE,
    ADD_ITEM,
    APPROVE_QUOTATION,
    CANCEL_QUOTATION,
    CANCLE_APPROVE,
    CLOSE_DEAL,
    CREATE_QUOTATION,
    DELETE_FILE,
    DELETE_ITEM,
    GET_ALL_QUOTATION,
    GET_QUOTATION_BY_ID,
    REJECT_DEAL,
    REJECT_QUOTATION,
    REQUEST_APPROVE,
    REQUEST_EDIT,
    SELECT_VAT,
    UPDATE_QUOTATION_COMPANY,
    UPDATE_ITEM,
    UPDATE_PAYMENT,

} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadAddItemQuotation, PayLoadCreateQuotation, PayLoadDeleteItemQuotation, PayLoadFilterQuotation, PayLoadStatusQuotation, PayLoadUpdateCompany, PayLoadUpdateItemQuotation, PayLoadUpdatePayment } from "@/types/requests/request.quotation";
import { AllQuotationResponse, QuotationResponse, VatResponse } from "@/types/response/response.quotation";

//quotation
export const getAllQuotations = async (page: string, pageSize: string, searchText: string, payload?: PayLoadFilterQuotation) => {
    try {
        const { data: response } = await mainApi.post<AllQuotationResponse>(
            `${GET_ALL_QUOTATION}?page=${page}&limit=${pageSize}&search=${searchText}`,
            payload
        );
        // const {data:response} = await mainApi.get<AllCustomerResponse>(
        //     `${GET_ALL_CUSTOMER}?page=${page}&pageSize=${pageSize}&search=${searchText}`
        // );
        return response;
    } catch (error) {
        console.error("Error get All customer", error);
        throw error;
    }
}
// get by id
export const getQuotation = async (quotationId: string) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.get<QuotationResponse>(
            `${GET_QUOTATION_BY_ID}/${encodedQuotationId}`
        );
        return response;
    } catch (error) {
        console.error("Error get Customer by Id", error);
        throw error;
    }
}
//create quotation
export const postQuotation = async (
    payload: PayLoadCreateQuotation,
    quotationFiles: File[]
) => {
    try {
        const formData = new FormData();

        formData.append("payload", JSON.stringify(payload));

        if (quotationFiles && quotationFiles.length > 0) {
            quotationFiles.forEach((file) => {
                formData.append("quotation", file);
            });
        }


        const { data: response } = await mainApi.post(CREATE_QUOTATION, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("service", response)

        return response;

    } catch (error) {
        console.error("Error creating quotation", error);
        throw error;
    }
};

// update company data in quotation
export const updateQuotationCompany = async (quotationId: string, payload: PayLoadUpdateCompany) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.put(`${UPDATE_QUOTATION_COMPANY}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error update company quotation", error);
        throw error;
    }
};
// update item product in quotation
export const updateItemInQuotation = async (quotationId: string, payload: PayLoadUpdateItemQuotation) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.put(`${UPDATE_ITEM}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error update item quotation", error);
        throw error;
    }
};
// delete item product in quotation
export const deleteItemInQuotation = async (quotationId: string, payload: PayLoadDeleteItemQuotation) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.post(`${DELETE_ITEM}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error delete item quotation", error);
        throw error;
    }
};
// add item product in quotation

export const addItemInQuotation = async (quotationId: string, payload: PayLoadAddItemQuotation) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);
        const { data: response } = await mainApi.post(`${ADD_ITEM}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error delete item quotation", error);
        throw error;
    }
};
// update payment data in quotation

export const updatePaymentQuotation = async (quotationId: string, payload: PayLoadUpdatePayment) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.put(`${UPDATE_PAYMENT}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error update payment quotation", error);
        throw error;
    }
};
//add file  in quotation

export const addFileInQuotation = async (quotationId: string, quotationFiles: File[]) => {
    try {
        const formData = new FormData();

        if (quotationFiles && quotationFiles.length > 0) {
            quotationFiles.forEach((file) => {
                formData.append("quotation", file);
            });
        }
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.post(`${ADD_FILE}/${encodedQuotationId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("service", response)

        return response;

    } catch (error) {
        console.error("Error add file  quotation", error);
        throw error;
    }
};
//delete file  in quotation

export const deleteFileInQuotation = async (fileId: string) => {
    try {
        const encodedFileId = encodeURIComponent(fileId);
        
        const { data: response } = await mainApi.delete(`${DELETE_FILE}/${encodedFileId}`);
        return response;
    } catch (error) {
        console.error("Error delete file quotation", error);
        throw error;
    }
};



export const selectVat = async (searchText: string) => {
    try {
        const { data: response } = await mainApi.get<VatResponse>(
            `${SELECT_VAT}?search=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error get Tag:", error);
        throw error;
    }
};

//cancel quottation
export const cancelQuotation = async (quotationId: string, payload: PayLoadStatusQuotation) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.put(`${CANCEL_QUOTATION}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error cancel quotation", error);
        throw error;
    }
};
//request approve quotation

export const requestApproveQuotation = async (quotationId: string, payload: PayLoadStatusQuotation) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.put(`${REQUEST_APPROVE}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error request approve  quotation", error);
        throw error;
    }
};

//request Edit Quotation
export const requestEditQuotation = async (quotationId: string, payload: PayLoadStatusQuotation) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.put(`${REQUEST_EDIT}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error request edit quotation", error);
        throw error;
    }
};
// approve Quotation
export const approveQuotation = async (quotationId: string, payload: PayLoadStatusQuotation) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.put(`${APPROVE_QUOTATION}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error approve quotation", error);
        throw error;
    }
};
// reject Quotation
export const rejectQuotation = async (quotationId: string, payload: PayLoadStatusQuotation) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.put(`${REJECT_QUOTATION}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error reject quotation", error);
        throw error;
    }
};
// cancel Approve Quotationn
export const cancelApproveQuotation = async (quotationId: string, payload: PayLoadStatusQuotation) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.put(`${CANCLE_APPROVE}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error cancel approve quotation", error);
        throw error;
    }
};
// reject Deal Quotation
export const rejectDealQuotation = async (quotationId: string, payload: PayLoadStatusQuotation) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.put(`${REJECT_DEAL}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error reject deal quotation", error);
        throw error;
    }
};
// close Deal Quotation
export const closeDealQuotation = async (quotationId: string, payload: PayLoadStatusQuotation) => {
    try {
        const encodedQuotationId = encodeURIComponent(quotationId);

        const { data: response } = await mainApi.put(`${CLOSE_DEAL}/${encodedQuotationId}`, payload);
        return response;
    } catch (error) {
        console.error("Error reject deal quotation", error);
        throw error;
    }
};