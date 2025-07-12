import { 
    CREATE_PAYMENTMETHOD,
    GET_ALL_PAYMENTMETHOD,
    SELECT_PAYMENTMETHOD,
    GET_PAYMENTMETHOD_BY_ID,
    UPDATE_PAYMENTMETHOD,
    DELETE_PAYMENTMETHOD
} from '../apis/endpoint.api';

import mainApi from "@/apis/main.api"

import { PayLoadCreatePaymentmethod, PayLoadEditPaymentmethod } from '@/types/requests/request.payment';
import { PaymentmethodResponse  } from '@/types/response/response.payment';

import { APIResponseType } from "@/types/response";
  
  export const getAllPayment = async (page: string, pageSize: string, searchText: string) => {
    try{
      const { data: response } = await mainApi.get<PaymentmethodResponse>(
        `${GET_ALL_PAYMENTMETHOD}?page=${page}&limit=${pageSize}&search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get all payment method:", error);
      throw error;
    }
  };
  export const selectPayment = async (searchText: string) => {
    try{
      const { data: response } = await mainApi.get<PaymentmethodResponse>(
        `${SELECT_PAYMENTMETHOD}?search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get payment method:", error);
      throw error;
    }
  };

  
  export const postPayment = async (payload: PayLoadCreatePaymentmethod) => {
    try {
      const { data: response } = await mainApi.post(CREATE_PAYMENTMETHOD, payload);
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error creating payment method:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  
  export const updatePayment= async (payment_method_id: string,payload: PayLoadEditPaymentmethod) => {
  
    try {
      // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน color_name
      const encodedPaymentMethod = encodeURIComponent(payment_method_id);
      const { data: response } = await mainApi.put(`${UPDATE_PAYMENTMETHOD}/${encodedPaymentMethod}`,
        payload
      );
  
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error updating payment method:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  
  export const deletePayment = async (payment_method_id: string) => {
    try {
      // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน tag_name
      const encodedPaymentMethod = encodeURIComponent(payment_method_id);
      const { data: response } = await mainApi.delete(
        `${DELETE_PAYMENTMETHOD}/${encodedPaymentMethod}`
      );
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error deleting payment method:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  