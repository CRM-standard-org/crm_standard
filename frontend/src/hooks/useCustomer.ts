import { getAllCustomer, getCustomer, selectCustomerAddress, selectCustomerContact } from "@/services/customer.service";
import { PayLoadFilterCustomer } from "@/types/requests/request.customer";
import { queryOptions, useQuery } from '@tanstack/react-query';

// fetch All Customer
function fetchAllCustomer({
    page,
    pageSize,
    searchText,
    payload,
}: {
    page: string,
    pageSize: string;
    searchText: string;
    payload?: PayLoadFilterCustomer;
}) {
    return queryOptions({
        queryKey: ["getAllCustomer", page, pageSize, searchText, payload],
        queryFn: () => getAllCustomer(page, pageSize, searchText, payload),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useAllCustomer = ({
    page = "1",
    pageSize = "10",
    searchText = "",
    payload,
}: {
    page?: string,
    pageSize?: string;
    searchText?: string;
    payload: PayLoadFilterCustomer;
}) => {
    return useQuery(
        fetchAllCustomer({
            page,
            pageSize,
            searchText,
            payload,
        })
    );
}

function fetchCustomerById({
    customerId
}: {
    customerId: string,
}) {
    return queryOptions({
        queryKey: ["getAllCustomer", customerId],
        queryFn: () => getCustomer(customerId),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useCustomerById = ({
    customerId
}: {
    customerId: string,

}) => {
    return useQuery(
        fetchCustomerById({
            customerId
        })
    );
}
//select Customer Contact
function fetchSelectCustomerContact({
    customerId,
    searchText,
}: {
    customerId: string,
    searchText: string;
}) {
    return queryOptions({
        queryKey: ["selectCustomerContact", customerId, searchText],
        queryFn: () => selectCustomerContact(customerId, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}
export const useSelectCustomerContact = ({
    customerId,
    searchText = "",
}: {
    customerId: string,
    searchText?: string;
}) => {
    return useQuery(
        fetchSelectCustomerContact({
            customerId,
            searchText,
        })
    );
};

//select Customer Address
function fetchSelectCustomerAddress({
    customerId,
    searchText,
}: {
    customerId: string,
    searchText: string;
}) {
    return queryOptions({
        queryKey: ["selectCustomerAddress", customerId, searchText],
        queryFn: () => selectCustomerAddress(customerId, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useSelectCustomerAddress = ({
    customerId,
    searchText = "",
}: {
    customerId: string,
    searchText?: string;
}) => {
    return useQuery(
        fetchSelectCustomerAddress({
            customerId,
            searchText,
        })
    );
};