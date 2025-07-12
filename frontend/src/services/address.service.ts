import { SELECT_ADDRESS } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { AddressResponse } from "@/types/response/response.address";

export const selectAddress = async (searchText: string) => {
    try {
        const { data: response } = await mainApi.get<AddressResponse>(
          `${SELECT_ADDRESS}?search=${searchText}`
  
        );

        return response;
      } catch (error) {
        console.error("Error get Address:", error);
        throw error;
      }
}