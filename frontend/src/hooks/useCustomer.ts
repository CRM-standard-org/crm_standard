import { getAllCustomer, getCustomerAllActivity, getCustomer, getFollowQuotation, getFollowSaleTotal, selectCustomerAddress, selectCustomerContact } from "@/services/customer.service";
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
        queryKey: ["getCustomer", customerId],
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
//get all customer activity
function fetchCustomerAllActivity({
    page,
    pageSize,
    searchText,
    customerId
}: {
    page: string,
    pageSize: string;
    searchText: string;
    customerId: string,
}) {
    return queryOptions({
        queryKey: ["getCustomerAllActivity", page, pageSize, searchText, customerId],
        queryFn: () => getCustomerAllActivity(page, pageSize, searchText, customerId),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useCustomerAllActivity = ({
    page,
    pageSize,
    searchText,
    customerId
}: {
    page: string,
    pageSize: string;
    searchText: string;
    customerId: string,

}) => {
    return useQuery(
        fetchCustomerAllActivity({
            page,
            pageSize,
            searchText,
            customerId
        })
    );
}
//follow quotation
function fetchFollowQuotation({
    customerId
}: {
    customerId: string,
}) {
    return queryOptions({
        queryKey: ["getFollowQuotation", customerId],
        queryFn: () => getFollowQuotation(customerId),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useFollowQuotation = ({
    customerId
}: {
    customerId: string,

}) => {
    return useQuery(
        fetchFollowQuotation({
            customerId
        })
    );
}
//follow sale total
function fetchFollowSaleTotal({
    customerId
}: {
    customerId: string,
}) {
    return queryOptions({
        queryKey: ["getFollowSaleTotal", customerId],
        queryFn: () => getFollowSaleTotal(customerId),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useFollowSaleTotal = ({
    customerId
}: {
    customerId: string,

}) => {
    return useQuery(
        fetchFollowSaleTotal({
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