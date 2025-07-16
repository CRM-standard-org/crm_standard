
import mainApi from "@/apis/main.api";

import { PayLoadCreateTag, PayLoadEditTag } from "@/types/requests/request.tagColor";
import { TagResponse, TypeTagAllResponse } from "@/types/response/response.tagColor";
import { APIResponseType } from "@/types/response";
import { ActivityResponse, AllActivityResponse } from "@/types/response/response.activity";
import { CREATE_ACTIVITY, DELETE_ACTIVITY, EDIT_ACTIVITY, GET_ACTIVITY_BY_ID, GET_ALL_ACTIVITY } from "@/apis/endpoint.api";
import { PayLoadCreateActivity, PayLoadEditActivity, PayLoadFilterActivity } from "@/types/requests/request.activity";

export const getAllActivities = async (page: string, pageSize: string, searchText: string, payload?: PayLoadFilterActivity) => {
    try {
        const { data: response } = await mainApi.post<AllActivityResponse>(
            `${GET_ALL_ACTIVITY}?page=${page}&limit=${pageSize}&search=${searchText}`,
            payload
        );
        return response;
    } catch (error) {
        console.error("Error get Tag:", error);
        throw error;
    }
};


// get by id
export const getActivity = async (activityId: string) => {
    try {
        const encodedActivityId = encodeURIComponent(activityId);

        const { data: response } = await mainApi.get<ActivityResponse>(
            `${GET_ACTIVITY_BY_ID}/${encodedActivityId}`
        );
        return response;
    } catch (error) {
        console.error("Error get Activity by Id", error);
        throw error;
    }
}
export const postActivity = async (payload: PayLoadCreateActivity) => {
    try {
        const { data: response } = await mainApi.post(CREATE_ACTIVITY, payload);
        console.log("API Response:", response); // Log the response
        return response;
    } catch (error) {
        console.error("Error creating Activity:", error); // Log the error
        throw error; // Optionally rethrow the error for further handling
    }
};

export const updateActivity = async (activityId: string, payload: PayLoadEditActivity) => {

    try {
        
        const encodedActivityId = encodeURIComponent(activityId);
        const { data: response } = await mainApi.put(`${EDIT_ACTIVITY}/${encodedActivityId}`,
            payload
        );

        console.log("API Response:", response); // Log the response
        return response;
    } catch (error) {
        console.error("Error updating Activity:", error); // Log the error
        throw error; // Optionally rethrow the error for further handling
    }
};

export const deleteActivity = async (activityId: string) => {
    try {
       
        const encodedActivityId = encodeURIComponent(activityId);
        const { data: response } = await mainApi.delete(
            `${DELETE_ACTIVITY}/${encodedActivityId}`
        );
        console.log("API Response:", response); // Log the response
        return response;
    } catch (error) {
        console.error("Error deleting Activity:", error); // Log the error
        throw error; // Optionally rethrow the error for further handling
    }
};
