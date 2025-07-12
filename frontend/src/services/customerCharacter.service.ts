import { 
    CREATE_CHARACTER,
    GET_ALL_CHARACTER,
    SELECT_CHARACTER,
    GET_CHARACTER_BY_ID,
    UPDATE_CHARACTER,
    DELETE_CHARACTER
} from '../apis/endpoint.api';

import mainApi from "@/apis/main.api"

import { PayLoadCreateCharacter, PayLoadEditCharacter } from '@/types/requests/request.customerCharacter';
import { CharacterResponse, TypeCharacterAllResponse } from '@/types/response/response.customerCharacter';

import { APIResponseType } from "@/types/response";
  
  export const getCharacter = async (page: string, pageSize: string, searchText: string) => {
    try{
      const { data: response } = await mainApi.get<CharacterResponse>(
        `${GET_ALL_CHARACTER}?page=${page}&limit=${pageSize}&search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get Character:", error);
      throw error;
    }
  };
  export const selectCharacter = async (searchText: string) => {
    try{
      const { data: response } = await mainApi.get<CharacterResponse>(
        `${SELECT_CHARACTER}?search=${searchText}`
      );
      return response;
    } catch (error) {
      console.error("Error get Character:", error);
      throw error;
    }
  };
  export const getAllCharacters = async () => {
    try {
      const { data: response } = await mainApi.get<CharacterResponse>(
        GET_ALL_CHARACTER
      );
      return response;
    } catch (error) {
      console.error("Error get all Character:", error);
      throw error;
    }
  };
  
  export const postCharacter= async (payload: PayLoadCreateCharacter) => {
    try {
      const { data: response } = await mainApi.post(CREATE_CHARACTER, payload);
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error creating Character:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  
  export const updateCharacter = async (character_id: string,payload: PayLoadEditCharacter) => {
  
    try {
      // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน color_name
      const encodedCharacter = encodeURIComponent(character_id);
      const { data: response } = await mainApi.put(`${UPDATE_CHARACTER}/${encodedCharacter}`,
        payload
      );
  
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error updating Character:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  
  export const deleteCharacter = async (character_id: string) => {
    try {
      // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน tag_name
      const encodedCharacter = encodeURIComponent(character_id);
      const { data: response } = await mainApi.delete(
        `${DELETE_CHARACTER}/${encodedCharacter}`
      );
      console.log("API Response:", response); // Log the response
      return response;
    } catch (error) {
      console.error("Error deleting Character:", error); // Log the error
      throw error; // Optionally rethrow the error for further handling
    }
  };
  