import { selectSocial } from "@/services/social.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchSocialOptions({

    searchText,
}: {

    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectSocial",searchText],
        queryFn: () => selectSocial(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useSocial = ({
    searchText = "",
}: {
    searchText?: string;
}) => {
    return useQuery(
        fetchSocialOptions({
            searchText,
        })
    );
};
