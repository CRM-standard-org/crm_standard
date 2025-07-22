import { SELECT_ROLE } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { RoleResponse } from "@/types/response/response.role";

//select role 
export const selectRole = async (searchText: string) => {
    try{
      const { data: response } = await mainApi.get<RoleResponse>(
        `${SELECT_ROLE}?search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error select Employee Status:", error);
      throw error;
    }
  };