import {
    CREATE_CUSTOMER,
    DELETE_CUSTOMER,
    GET_ALL_CUSTOMER,
    GET_CUSTOMER_BY_ID,
    ADD_CUSTOMER_ADDRESS,
    ADD_CUSTOMER_CONTACT,
    CHANGE_MAIN_CONTACT,
    CHANGE_MAIN_ADDRESS,
    EDIT_CUSTOMER_CONTACT,
    EDIT_CUSTOMER_ADDRESS,
    DELETE_CUSTOMER_CONTACT,
    DELETE_CUSTOMER_ADDRESS,
    EDIT_CUSTOMER,
    SELECT_CUSTOMER_CONTACT,
    SELECT_CUSTOMER_ADDRESS,
    GET_ALL_CUSTOMER_ACTIVITY,
    FOLLOW_QUOTATION,
    FOLLOW_SALE_TOTAL
} from "@/apis/endpoint.api";

import mainApi from "@/apis/main.api";
import { PayLoadCreateCustomer, PayLoadCreateCustomerAddress, PayLoadCreateCustomerContact, PayLoadDeleteAddress, PayLoadDeleteContact, PayLoadEditAddress, PayLoadEditContact, PayLoadEditCustomer, PayLoadEditMainAddress, PayLoadEditMainContact, PayLoadFilterCustomer } from "@/types/requests/request.customer";
import { APIResponseType } from "@/types/response";
import { AllCustomerResponse, CustomerActivityResponse, CustomerResponse, FollowQuotationResponse, FollowSaleTotalResponse, TypeCustomerAddress, TypeCustomerContacts } from "@/types/response/response.customer";

export const getAllCustomer = async (page: string, pageSize: string, searchText: string, payload?: PayLoadFilterCustomer) => {
    try {
        const { data: response } = await mainApi.post<AllCustomerResponse>(
            `${GET_ALL_CUSTOMER}?page=${page}&limit=${pageSize}&search=${searchText}`,
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
export const getCustomer = async (customerId: string) => {
    try {
        const encodedCustomerId = encodeURIComponent(customerId);

        const { data: response } = await mainApi.get<CustomerResponse>(
            `${GET_CUSTOMER_BY_ID}/${encodedCustomerId}`
        );
        return response;
    } catch (error) {
        console.error("Error get Customer by Id", error);
        throw error;
    }
}
//get all customer activity
export const getCustomerAllActivity= async (page: string, pageSize: string, searchText: string,customerId: string) => {
    try {
        const encodedCustomerId = encodeURIComponent(customerId);
        const { data: response } = await mainApi.get<CustomerActivityResponse>(
            `${GET_ALL_CUSTOMER_ACTIVITY}/${encodedCustomerId}?page=${page}&limit=${pageSize}&search=${searchText}`
        );
        
        return response;
    } catch (error) {
        console.error("Error get Customer by Id", error);
        throw error;
    }
}
//follow quotation
export const getFollowQuotation = async (customerId: string) => {
    try {
        const encodedCustomerId = encodeURIComponent(customerId);

        const { data: response } = await mainApi.get<FollowQuotationResponse>(
            `${FOLLOW_QUOTATION}/${encodedCustomerId}`
        );
        return response;
    } catch (error) {
        console.error("Error get Customer by Id", error);
        throw error;
    }
}
//follow sale total
export const getFollowSaleTotal = async (customerId: string) => {
    try {
        const encodedCustomerId = encodeURIComponent(customerId);

        const { data: response } = await mainApi.get<FollowSaleTotalResponse>(
            `${FOLLOW_SALE_TOTAL}/${encodedCustomerId}`
        );
        return response;
    } catch (error) {
        console.error("Error get Customer by Id", error);
        throw error;
    }
}
export const selectCustomerContact = async (customerId: string, searchText: string) => {
    try {
        const encodedCustomerId = encodeURIComponent(customerId);

        const { data: response } = await mainApi.get<APIResponseType<TypeCustomerContacts[]>>(
            `${SELECT_CUSTOMER_CONTACT}/${encodedCustomerId}?search=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error get select customer contact:", error);
        throw error;
    }
};
export const selectCustomerAddress = async (customerId: string, searchText: string) => {
    try {
        const encodedCustomerId = encodeURIComponent(customerId);

        const { data: response } = await mainApi.get<APIResponseType<TypeCustomerAddress[]>>(
            `${SELECT_CUSTOMER_ADDRESS}/${encodedCustomerId}?search=${searchText}`
        );
        return response;
    } catch (error) {
        console.error("Error get select customer address:", error);
        throw error;
    }
};
export const postCustomer = async (payload: PayLoadCreateCustomer) => {
    console.log(payload)
    try {
        const { data: response } = await mainApi.post(CREATE_CUSTOMER, payload);
        return response;

    } catch (error) {
        console.error("Error creating customer", error);
        throw error;
    }
}
export const postCustomerContact = async (customerId: string, payload: PayLoadCreateCustomerContact) => {
    console.log(payload)
    try {
        const encodedCustomerId = encodeURIComponent(customerId);
        const { data: response } = await mainApi.post(`${ADD_CUSTOMER_CONTACT}/${encodedCustomerId}`, payload);
        return response;

    } catch (error) {
        console.error("Error creating customer contact", error);
        throw error;
    }
}
export const updateCustomer = async (customerId: string, payload: PayLoadEditCustomer) => {
    console.log(payload)
    try {
        const encodedCustomerId = encodeURIComponent(customerId);
        const { data: response } = await mainApi.put(`${EDIT_CUSTOMER}/${encodedCustomerId}`, payload);
        return response;
    } catch (error) {
        console.error("Error Edit customer ", error);
        throw error;
    }
}
export const postCustomerAddress = async (customerId: string, payload: PayLoadCreateCustomerAddress) => {
    // console.log(payload)
    try {
        const encodedCustomerId = encodeURIComponent(customerId);
        const { data: response } = await mainApi.post(`${ADD_CUSTOMER_ADDRESS}/${encodedCustomerId}`, payload);
        return response;

    } catch (error) {
        console.error("Error creating customer Address", error);
        throw error;
    }
}
export const updateCustomerMainContact = async (customerId: string, payload: PayLoadEditMainContact) => {
    console.log(payload)
    try {
        const encodedCustomerId = encodeURIComponent(customerId);
        const { data: response } = await mainApi.put(`${CHANGE_MAIN_CONTACT}/${encodedCustomerId}`, payload)
        return response;
    } catch (error) {
        console.error("Error edit customer main contact", error);
        throw error;
    }
}
export const updateCustomerMainAddress = async (customerId: string, payload: PayLoadEditMainAddress) => {
    try {
        const encodedCustomerId = encodeURIComponent(customerId);
        const { data: response } = await mainApi.put(`${CHANGE_MAIN_ADDRESS}/${encodedCustomerId}`, payload)
        return response;
    } catch (error) {
        console.error("Error edit customer main address", error);
        throw error;
    }
}
export const updateCustomerContact = async (customerId: string, payload: PayLoadEditContact) => {
    console.log(payload)
    try {
        const encodedCustomerId = encodeURIComponent(customerId);
        const { data: response } = await mainApi.put(`${EDIT_CUSTOMER_CONTACT}/${encodedCustomerId}`, payload);
        return response;
    } catch (error) {
        console.error("Error edit customer main contact", error);
        throw error;
    }
}
export const updateCustomerAddress = async (customerId: string, payload: PayLoadEditAddress) => {
    console.log(payload)
    try {
        const encodedCustomerId = encodeURIComponent(customerId);
        const { data: response } = await mainApi.put(`${EDIT_CUSTOMER_ADDRESS}/${encodedCustomerId}`, payload);
        return response;
    } catch (error) {
        console.error("Error edit customer main address", error);
        throw error;
    }
}
export const deleteCustomer = async (customerId: string) => {
    try {
        const encodedCustomerId = encodeURIComponent(customerId);
        const { data: response } = await mainApi.delete(`${DELETE_CUSTOMER}/${encodedCustomerId}`);
        return response;
    } catch (error) {
        console.error("Error Delete Customer", error);
    }
}
export const deleteCustomerContact = async (customerId: string, payload: PayLoadDeleteContact) => {
    try {
        const encodedCustomerId = encodeURIComponent(customerId);
        const { data: response } = await mainApi.post(`${DELETE_CUSTOMER_CONTACT}/${encodedCustomerId}`, payload);
        return response;
    } catch (error) {
        console.error("Error delete customer contact", error)
    }
}
export const deleteCustomerAddress = async (customerId: string, payload: PayLoadDeleteAddress) => {
    try {
        const encodedCustomerId = encodeURIComponent(customerId);
        const { data: response } = await mainApi.post(`${DELETE_CUSTOMER_ADDRESS}/${encodedCustomerId}`, payload);
        return response;
    } catch (error) {
        console.error("Error delete customer contact", error)
    }
}