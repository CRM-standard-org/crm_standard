import { 
    CREATE_CURRENCY,
    GET_ALL_CURRENCY,
    SELECT_CURRENCY,
    GET_CURRENCY_BY_ID,
    UPDATE_CURRENCY,
    DELETE_CURRENCY
} from '../apis/endpoint.api';

import mainApi from "@/apis/main.api"

import { PayLoadCreateCurrency, PayLoadEditCurrency } from '@/types/requests/request.currency';
import { CurrencyResponse, TypeCurrencyResponse } from '@/types/response/response.currency';

import { APIResponseType } from "@/types/response";
  
  export const getAllCurrency = async (page: string, pageSize: string, searchText: string) => {
    try{
      const { data: response } = await mainApi.get<CurrencyResponse>(
        `${GET_ALL_CURRENCY}?page=${page}&limit=${pageSize}&search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get all currency:", error);
      throw error;
    }
  };
  export const selectCurrency = async (searchText: string) => {
    try{
      const { data: response } = await mainApi.get<CurrencyResponse>(
        `${SELECT_CURRENCY}?search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get select currency:", error);
      throw error;
    }
  };
  
  export const postCurrency = async (payload: PayLoadCreateCurrency) => {
    try {
      const { data: response } = await mainApi.post(CREATE_CURRENCY, payload);
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error creating currency:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  
  export const updateCurrency  = async (currency_id: string,payload: PayLoadEditCurrency) => {
  
    try {
      // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน color_name
      const encodedCurrency = encodeURIComponent(currency_id);
      const { data: response } = await mainApi.put(`${UPDATE_CURRENCY}/${encodedCurrency}`,
        payload
      );
  
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error updating currency:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  
  export const deleteCurrency  = async (currency_id: string) => {
    try {
      // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน tag_name
      const encodedCurrency = encodeURIComponent(currency_id);
      const { data: response } = await mainApi.delete(
        `${DELETE_CURRENCY}/${encodedCurrency}`
      );
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error deleting currency:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  