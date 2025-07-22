import { 
    CREATE_CUSTOMER_ROLE,
    GET_ALL_CUSTOMER_ROLE,
    SELECT_CUSTOMER_ROLE,
    GET_CUSTOMER_ROLE_BY_ID,
    UPDATE_CUSTOMER_ROLE,
    DELETE_CUSTOMER_ROLE
} from '../apis/endpoint.api';

import mainApi from "@/apis/main.api"

import { PayLoadCreateRole, PayLoadEditRole } from '@/types/requests/request.customerRole';
import { CustomerRoleResponse, TypeCustomerRoleAllResponse } from '@/types/response/response.customerRole';

import { APIResponseType } from "@/types/response";
  
  export const getCustomerRole = async (page: string, pageSize: string, searchText: string) => {
    try{
      const { data: response } = await mainApi.get<CustomerRoleResponse>(
        `${GET_ALL_CUSTOMER_ROLE}?page=${page}&limit=${pageSize}&search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get role:", error);
      throw error;
    }
  };
  export const selectCustomerRole = async (searchText: string) => {
    try{
      const { data: response } = await mainApi.get<CustomerRoleResponse>(
        `${SELECT_CUSTOMER_ROLE}?search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get role:", error);
      throw error;
    }
  };
  export const getAllCustomerRoles = async () => {
    try {
      const { data: response } = await mainApi.get<CustomerRoleResponse>(
        GET_ALL_CUSTOMER_ROLE
      );
      return response;
    } catch (error) {
      console.error("Error get all role:", error);
      throw error;
    }
  };
  
  export const postCustomerRole = async (payload: PayLoadCreateRole) => {
    try {
      const { data: response } = await mainApi.post(CREATE_CUSTOMER_ROLE, payload);
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error creating role:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  
  export const updateCustomerRole = async (role_id: string,payload: PayLoadEditRole) => {
  
    try {
      // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน color_name
      const encodedRole = encodeURIComponent(role_id);
      const { data: response } = await mainApi.put(`${UPDATE_CUSTOMER_ROLE}/${encodedRole}`,
        payload
      );
  
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error updating role:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  
  export const deleteCustomerRole = async (role_id: string) => {
    try {
      // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน tag_name
      const encodedRole = encodeURIComponent(role_id);
      const { data: response } = await mainApi.delete(
        `${DELETE_CUSTOMER_ROLE}/${encodedRole}`
      );
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error deleting role:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  