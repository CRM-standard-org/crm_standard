
import { GET_COMPANY, UPDATE_COMPANY } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadEditCompany } from "@/types/requests/request.company";
import { CompanyResponse } from "@/types/response/response.company";


export const getCompany = async () => {
    try {

        const { data: response } = await mainApi.get<CompanyResponse>(
            `${GET_COMPANY}`
        );
        return response;
    } catch (error) {
        console.error("Error get Company", error);
        throw error;
    }
}



//update company
export const updateCompany = async (
    companyId: string,
    payload: PayLoadEditCompany,
    companyFiles: File
) => {
    try {
        const formData = new FormData();
        const encodedCompanyId = encodeURIComponent(companyId);

        formData.append("payload", JSON.stringify(payload));

        if (companyFiles) {
            formData.append("company", companyFiles);
        }

        const { data: response } = await mainApi.put(`${UPDATE_COMPANY}/${encodedCompanyId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("service", response)

        return response;

    } catch (error) {
        console.error("Error update Company", error);
        throw error;
    }
};

