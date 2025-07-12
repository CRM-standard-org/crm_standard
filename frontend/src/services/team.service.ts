import {
  CREATE_TEAM,
  GET_ALL_TEAM,
  GET_TEAM,
  SEARCH_EMPLOYEE,
  DELETE_MEMBER_TEAM,
  EDIT_TEAM,
  EDIT_MEMBER_TEAM,
  DELETE_TEAM,
} from "@/apis/endpoint.api";

import mainApi from "@/apis/main.api";
import {PayLoadCreateTeam, PayLoadDeleteMemberTeam, PayLoadEditTeam,PayLoadEditMemberTeam } from "@/types/requests/request.team";
import { TeamResponse, TeamMemberResponse } from "@/types/response/response.team";
import { APIResponseType } from "@/types/response";



export const getTeam = async (page: string, pageSize: string, searchText: string) => {
  try {
    const { data: response } = await mainApi.get<TeamResponse>(
      `${GET_ALL_TEAM}?page=${page}&limit=${pageSize}&search=${searchText}`
    );
  
    return response;
  } catch (error) {
    console.error("Error get team:", error);
    throw error;
  }
}

export const getMembersInTeam = async (team_id: string, page: string, pageSize: string, searchText: string) => {
  try {
    const { data: response } = await mainApi.get<TeamMemberResponse>(
      `${GET_TEAM}/${team_id}?page=${page}&limit=${pageSize}&search=${searchText}`,
    );

    return response;
  } catch (error) {
    console.error("Error get members in team:", error);
    throw error;
  }
};

export const postTeam = async (payload: PayLoadCreateTeam) => {
  try {
    const { data: response } = await mainApi.post(CREATE_TEAM, payload);
    console.log("API Response:", response); // Log the response
    return response;
  } catch (error) {
    console.error("Error creating create team:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const deleteMemberTeam = async (team_id: string, payload: PayLoadDeleteMemberTeam) => {

  try {
    // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน color_name
    const encodedTagName = encodeURIComponent(team_id);
    const { data: response } = await mainApi.put(`${DELETE_MEMBER_TEAM}/${encodedTagName}`,
      payload
    );

    console.log("API Response:", response); // Log the response
    return response;
  } catch (error) {
    console.error("Error updating delete member team:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};
export const editTeam = async (team_id: string, payload: PayLoadEditTeam) => {

  try {
    // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน color_name
    const encodedTagName = encodeURIComponent(team_id);
    const { data: response } = await mainApi.put(`${EDIT_TEAM}/${encodedTagName}`,
      payload
    );

    console.log("API Response:", response); // Log the response
    return response;
  } catch (error) {
    console.error("Error updating team:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const editMemberTeam = async (team_id: string, payload: PayLoadEditMemberTeam) => {
  console.log(payload)
  try {
    // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน color_name
    const encodedTagName = encodeURIComponent(team_id);
    const { data: response } = await mainApi.put(`${EDIT_MEMBER_TEAM}/${encodedTagName}`,
      payload
    );

    console.log("API Response:", response); // Log the response
    return response;
  } catch (error) {
    console.error("Error updating member team:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const deleteTeam = async (team_id: string) => {
  try {
    // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน tag_name
    const encodedTagName = encodeURIComponent(team_id);
    const { data: response } = await mainApi.delete(
      `${DELETE_TEAM}/${encodedTagName}`
    );
    console.log("API Response:", response); // Log the response
    return response;
  } catch (error) {
    console.error("Error deleting team:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};
