import {
    CREATE_GROUP_PRODUCT,
    SELECT_GROUP_PRODUCT,
    GETALL_GROUP_PRODUCT,
    GET_GROUP_PRODUCT_BYID,
    EDIT_GROUP_PRODUCT,
    DELETE_GROUP_PRODUCT,
    CREATE_UNIT,
    SELECT_UNIT,
    GET_ALL_UNIT,
    EDIT_UNIT,
    DELETE_UNIT,
    CREATE_PRODUCT,
    GET_ALL_PRODUCT,
    GET_PRODUCT_BY_ID,
    EDIT_PRODUCT,
    DELETE_PRODUCT,
    SELECT_PRODUCT
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreateGroupProduct, PayLoadEditGroupProduct, PayLoadCreateUnit, PayLoadEditUnit, PayLoadEditProduct, PayLoadCreateProduct } from "@/types/requests/request.product";
import { ProductByIdResponse, ProductGroupResponse, ProductResponse, UnitResponse } from "@/types/response/response.product";

//group 
export const getAllGroupProduct = async (page: string, pageSize: string, searchText: string) => {
    try {
        const { data: response } = await mainApi.get<ProductGroupResponse>(
            `${GETALL_GROUP_PRODUCT}?page=${page}&limit=${pageSize}&search=${searchText}`
        );
        return response;
    } catch (error) {
        console.log("Error get Group Product", error);
        throw error;
    }
};
export const selectGroupProduct = async (searchText: string) => {
    try {
        const { data: response } = await mainApi.get<ProductGroupResponse>(
            `${SELECT_GROUP_PRODUCT}?search=${searchText}`
        );
        return response
    } catch (error) {
        console.log("Error select Group Product");
        throw error;
    }
}

export const postGroupProduct = async (payload: PayLoadCreateGroupProduct) => {
    try {
        const { data: response } = await mainApi.post(CREATE_GROUP_PRODUCT, payload);
        return response;
    } catch (error) {
        console.error("Error creating Group product");
        throw error
    }
}
export const updateGroupProduct = async (groupId: string, payload: PayLoadEditGroupProduct) => {
    try {
        const encodeGroupId = encodeURIComponent(groupId);
        const { data: response } = await mainApi.put(`${EDIT_GROUP_PRODUCT}/${encodeGroupId}`, payload)
        return response;
    } catch (error) {
        console.error("Error update group product ", error);
        throw error;
    }
}

export const deleteGroupProduct = async (groupId: string) => {
    try {
        const encodeGroupId = encodeURIComponent(groupId);
        const { data: response } = await mainApi.delete(`${DELETE_GROUP_PRODUCT}/${encodeGroupId}`)
        return response;
    } catch (error) {
        console.error("Error update group product ", error);
        throw error;
    }
}

//unit 

export const getAllUnit = async (page: string, pageSize: string, searchText: string) => {
    try {
        const { data: response } = await mainApi.get<UnitResponse>(
            `${GET_ALL_UNIT}?page=${page}&limit=${pageSize}&search=${searchText}`
        );
        return response;
    } catch (error) {
        console.log("Error get unit", error);
        throw error;
    }
};
export const selectUnit = async (searchText: string) => {
    try {
        const { data: response } = await mainApi.get<UnitResponse>(
            `${SELECT_UNIT}?search=${searchText}`
        );
        return response
    } catch (error) {
        console.log("Error select unit");
        throw error;
    }
}

export const postUnit = async (payload: PayLoadCreateUnit) => {
    try {
        const { data: response } = await mainApi.post(CREATE_UNIT, payload);
        return response;
    } catch (error) {
        console.error("Error creating unit ");
        throw error
    }
}
export const updateUnit = async (unitId: string, payload: PayLoadEditUnit) => {
    try {
        const encodeUnitId = encodeURIComponent(unitId);
        const { data: response } = await mainApi.put(`${EDIT_UNIT}/${encodeUnitId}`, payload)
        return response;
    } catch (error) {
        console.error("Error update unit ", error);
        throw error;
    }
}

export const deleteUnit = async (unitId: string) => {
    try {
        const encodeUnitId = encodeURIComponent(unitId);
        const { data: response } = await mainApi.delete(`${DELETE_UNIT}/${encodeUnitId}`)
        return response;
    } catch (error) {
        console.error("Error delete unit  ", error);
        throw error;
    }
}


//product

export const getAllProduct = async (page: string, pageSize: string, searchText: string) => {
    try {
        const { data: response } = await mainApi.get<ProductResponse>(
            `${GET_ALL_PRODUCT}?page=${page}&limit=${pageSize}&search=${searchText}`
        );
        return response;
    } catch (error) {
        console.log("Error get product", error);
        throw error;
    }
};
export const getProductById = async (productId: string) => {
    try {
        const encodedCustomerId = encodeURIComponent(productId);

        const { data: response } = await mainApi.get<ProductByIdResponse>(
            `${GET_PRODUCT_BY_ID}/${encodedCustomerId}`
        );
        return response;
    } catch (error) {
        console.error("Error get product by Id", error);
        throw error;
    }
}
export const selectProduct = async (searchText: string) => {
    try {
        const { data: response } = await mainApi.get<ProductResponse>(
            `${SELECT_PRODUCT}?search=${searchText}`
        );
        return response
    } catch (error) {
        console.log("Error select product");
        throw error;
    }
}

export const postProduct = async (payload: PayLoadCreateProduct) => {
    try {
        const { data: response } = await mainApi.post(CREATE_PRODUCT, payload);
        return response;
    } catch (error) {
        console.error("Error creating unit ");
        throw error
    }
}
export const updateProduct = async (productId: string, payload: PayLoadEditProduct) => {
    try {
        const encodeProductId = encodeURIComponent(productId);
        const { data: response } = await mainApi.put(`${EDIT_PRODUCT}/${encodeProductId}`, payload)
        return response;
    } catch (error) {
        console.error("Error update unit ", error);
        throw error;
    }
}

export const deleteProduct = async (productId: string) => {
    try {
        const encodeProductId = encodeURIComponent(productId);
        const { data: response } = await mainApi.delete(`${DELETE_PRODUCT}/${encodeProductId}`)
        return response;
    } catch (error) {
        console.error("Error delete unit  ", error);
        throw error;
    }
}








