import { selectAddress } from "@/services/address.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchAddressOptions({
    searchText,
}: {
    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectAddress", searchText],
        queryFn: () => selectAddress(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useAddress = ({
    searchText = "",
}: {
    searchText?: string;
}) => {
    return useQuery(
        fetchAddressOptions({
            searchText,
        })
    );
};
