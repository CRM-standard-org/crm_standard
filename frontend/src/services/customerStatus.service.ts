import { 
  CREATE_CUSTOMER_STATUS,
  GET_ALL_CUSTOMER_STATUS,
  SELECT_CUSTOMER_STATUS,
  GET_CUSTOMER_STATUS_BY_ID,
  UPDATE_CUSTOMER_STATUS,
  DELETE_CUSTOMER_STATUS,
} from '@/apis/endpoint.api';
import mainApi from '@/apis/main.api';
import { PayLoadCreateCustomerStatus, PayLoadEditCustomerStatus } from '@/types/requests/request.customerStatus';
import { CustomerStatusResponse } from '@/types/response/response.customerStatus';

export const getCustomerStatus = async (page: string, pageSize: string, searchText: string) => {
  const { data: response } = await mainApi.get<CustomerStatusResponse>(`${GET_ALL_CUSTOMER_STATUS}?page=${page}&limit=${pageSize}&search=${searchText}`);
  return response;
};

export const selectCustomerStatus = async (searchText: string) => {
  const { data: response } = await mainApi.get<CustomerStatusResponse>(`${SELECT_CUSTOMER_STATUS}?search=${searchText}`);
  return response;
};

export const getCustomerStatusById = async (id: string) => {
  const encoded = encodeURIComponent(id);
  const { data: response } = await mainApi.get<CustomerStatusResponse>(`${GET_CUSTOMER_STATUS_BY_ID}/${encoded}`);
  return response;
};

export const postCustomerStatus = async (payload: PayLoadCreateCustomerStatus) => {
  return mainApi.post(CREATE_CUSTOMER_STATUS, payload).then(r => r.data);
};

export const updateCustomerStatus = async (id: string, payload: PayLoadEditCustomerStatus) => {
  return mainApi.put(`${UPDATE_CUSTOMER_STATUS}/${id}`, payload).then(r => r.data);
};

export const deleteCustomerStatus = async (id: string) => {
  const encoded = encodeURIComponent(id);
  const { data: response } = await mainApi.delete(`${DELETE_CUSTOMER_STATUS}/${encoded}`);
  return response;
};
