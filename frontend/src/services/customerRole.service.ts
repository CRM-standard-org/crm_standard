import { 
    CREATE_ROLE,
    GET_ALL_ROLE,
    SELECT_ROLE,
    GET_ROLE_BY_ID,
    UPDATE_ROLE,
    DELETE_ROLE
} from '../apis/endpoint.api';

import mainApi from "@/apis/main.api"

import { PayLoadCreateRole, PayLoadEditRole } from '@/types/requests/request.customerRole';
import { RoleResponse, TypeRoleAllResponse } from '@/types/response/response.customerRole';

import { APIResponseType } from "@/types/response";
  
  export const getRole = async (page: string, pageSize: string, searchText: string) => {
    try{
      const { data: response } = await mainApi.get<RoleResponse>(
        `${GET_ALL_ROLE}?page=${page}&limit=${pageSize}&search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get role:", error);
      throw error;
    }
  };
  export const selectRole = async (searchText: string) => {
    try{
      const { data: response } = await mainApi.get<RoleResponse>(
        `${SELECT_ROLE}?search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get role:", error);
      throw error;
    }
  };
  export const getAllRoles = async () => {
    try {
      const { data: response } = await mainApi.get<RoleResponse>(
        GET_ALL_ROLE
      );
      return response;
    } catch (error) {
      console.error("Error get all role:", error);
      throw error;
    }
  };
  
  export const postRole = async (payload: PayLoadCreateRole) => {
    try {
      const { data: response } = await mainApi.post(CREATE_ROLE, payload);
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error creating role:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  
  export const updateRole = async (role_id: string,payload: PayLoadEditRole) => {
  
    try {
      // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน color_name
      const encodedRole = encodeURIComponent(role_id);
      const { data: response } = await mainApi.put(`${UPDATE_ROLE}/${encodedRole}`,
        payload
      );
  
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error updating role:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  
  export const deleteRole = async (role_id: string) => {
    try {
      // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน tag_name
      const encodedRole = encodeURIComponent(role_id);
      const { data: response } = await mainApi.delete(
        `${DELETE_ROLE}/${encodedRole}`
      );
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error deleting role:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  