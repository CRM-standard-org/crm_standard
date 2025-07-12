import { 
    SEARCH_EMPLOYEE,  
    GET_ALL_EMPLOYEE,
    GET_EMPLOYEE_NO_TEAM,
    SELECT_RESPONSIBLE,
    SELECT_EMPLOYEE
} from "@/apis/endpoint.api";

import mainApi from "@/apis/main.api";
import {  EmployeeResponse, SearchEmployeeResponse } from "@/types/response/response.employee";
import { APIResponseType } from "@/types/response";


export const searchEmployee = async (employee_code: string) => {
    try {
      const { data: response } = await mainApi.get<SearchEmployeeResponse>(
        `${SEARCH_EMPLOYEE}`, 
        { params: { employee_code } } 
      );
      return response;
    } catch (error) {
      console.error("Error search employee:", error);
      throw error;
    }
  }


export const getEmployeeNoTeam= async (page: string, pageSize: string, searchText: string) => {
    try {
      const { data: response } = await mainApi.get<EmployeeResponse>(
        `${GET_EMPLOYEE_NO_TEAM}?page=${page}&limit=${pageSize}&search=${searchText}`

      );

      return response;
    } catch (error) {
      console.error("Error get Employeee No Team:", error);
      throw error;
    }
  };
  
  export const getAllEmployees= async (page: string, pageSize: string, searchText: string) => {
    try {
      const { data: response } = await mainApi.get<EmployeeResponse>(
        `${GET_ALL_EMPLOYEE}?page=${page}&limit=${pageSize}&search=${searchText}`

      );

      return response;
    } catch (error) {
      console.error("Error get All Employee:", error);
      throw error;
    }
  };

  export const selectEmployee = async (searchText: string) => {
    try{
      const { data: response } = await mainApi.get<EmployeeResponse>(
        `${SELECT_EMPLOYEE}?search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get Employee:", error);
      throw error;
    }
  };
  
  export const selectResponsible = async (team_id:string,searchText: string) => {
    try{
      const encodedTeamId = encodeURIComponent(team_id);
      const { data: response } = await mainApi.get<EmployeeResponse>(
        `${SELECT_RESPONSIBLE}/${encodedTeamId}?search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get Employee:", error);
      throw error;
    }
  };
  
//   export const postTeam = async (payload: PayLoadCreateTeam) => {
//     try {
//       const { data: response } = await mainApi.post(CREATE_TEAM, payload);
//       console.log("API Response:", response); // Log the response
//       return response;
//     } catch (error) {
//       console.error("Error creating color:", error); // Log the error
//       throw error; // Optionally rethrow the error for further handling
//     }
//   };
  
//   export const updateTag = async (team_id: string,payload: PayLoadEditTag) => {
  
//     try {
//       // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน color_name
//       const encodedTagName = encodeURIComponent(tag_id);
//       const { data: response } = await mainApi.put(`${UPDATE_TAG}/${encodedTagName}`,
//         payload
//       );
  
//       console.log("API Response:", response); // Log the response
//       return response;
//     } catch (error) {
//       console.error("Error updating color:", error); // Log the error
//       throw error; // Optionally rethrow the error for further handling
//     }
//   };
  
//   export const deleteTeam = async (team_id: string) => {
//     try {
//       // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน tag_name
//       const encodedTagName = encodeURIComponent(team_id);
//       const { data: response } = await mainApi.delete(
//         `${DELETE_TEAM}/${encodedTagName}`
//       );
//       console.log("API Response:", response); // Log the response
//       return response;
//     } catch (error) {
//       console.error("Error deleting color:", error); // Log the error
//       throw error; // Optionally rethrow the error for further handling
//     }
//   };
//   export const deleteMemberTeam = async (team_id: string) => {
//     try {
//       // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน tag_name
//       const encodedTagName = encodeURIComponent(team_id);
//       const { data: response } = await mainApi.delete(
//         `${DELETE_MEMBER_TEAM}/${encodedTagName}`
//       );
//       console.log("API Response:", response); // Log the response
//       return response;
//     } catch (error) {
//       console.error("Error deleting color:", error); // Log the error
//       throw error; // Optionally rethrow the error for further handling
//     }
//   };
  