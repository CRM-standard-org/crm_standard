import {
  SELECT_SOCIAL,
} from "@/apis/endpoint.api";

import mainApi from "@/apis/main.api";
import { SocialResponse } from "@/types/response/response.social";
import { APIResponseType } from "@/types/response";

export const selectSocial = async (searchText: string) => {
    try {
        const { data: response } = await mainApi.get<SocialResponse>(
          `${SELECT_SOCIAL}?search=${searchText}`
  
        );

        return response;
      } catch (error) {
        console.error("Error get Social:", error);
        throw error;
      }
}
