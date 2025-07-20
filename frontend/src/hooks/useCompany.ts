import { getCompany } from "@/services/company.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchCompany() {

    return queryOptions({
        queryKey: ["getCompany"],
        queryFn: () => getCompany(),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useCompany = () => {
    return useQuery(
      fetchCompany()
    );
};
