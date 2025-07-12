import {
    CREATE_TAG,
    GET_ALL_TAG,
    SELECT_TAG,
    GET_TAG_BY_ID,
    UPDATE_TAG,
    DELETE_TAG,
  } from "@/apis/endpoint.api";
  import mainApi from "@/apis/main.api";
  
  import {PayLoadCreateTag, PayLoadEditTag} from "@/types/requests/request.tagColor";
  import { TagResponse, TypeTagAllResponse } from "@/types/response/response.tagColor";
  import { APIResponseType } from "@/types/response";
  
  export const getTag = async (page: string, pageSize: string, searchText: string) => {
    try{
      const { data: response } = await mainApi.get<TagResponse>(
        `${GET_ALL_TAG}?page=${page}&limit=${pageSize}&search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get Tag:", error);
      throw error;
    }
  };
  export const selectTag = async (searchText: string) => {
    try{
      const { data: response } = await mainApi.get<TagResponse>(
        `${SELECT_TAG}?search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get Tag:", error);
      throw error;
    }
  };
  
  export const getAllTags = async () => {
    try {
      const { data: response } = await mainApi.get<TagResponse>(
        GET_ALL_TAG
      );
      return response;
    } catch (error) {
      console.error("Error get all tags:", error);
      throw error;
    }
  };
  
  export const postTag = async (payload: PayLoadCreateTag) => {
    try {
      const { data: response } = await mainApi.post(CREATE_TAG, payload);
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error creating tag:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  
  export const updateTag = async (tag_id: string,payload: PayLoadEditTag) => {
  
    try {
      // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน color_name
      const encodedTagName = encodeURIComponent(tag_id);
      const { data: response } = await mainApi.put(`${UPDATE_TAG}/${encodedTagName}`,
        payload
      );
  
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error updating tag:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  
  export const deleteTag = async (tag_id: string) => {
    try {
      // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน tag_name
      const encodedTagName = encodeURIComponent(tag_id);
      const { data: response } = await mainApi.delete(
        `${DELETE_TAG}/${encodedTagName}`
      );
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error deleting tag:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  