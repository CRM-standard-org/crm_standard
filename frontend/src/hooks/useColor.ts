import { getColor } from "@/services/color.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchcolorOptions({
    page,
    pageSize,
    searchText,
  }: {
    page: string;
    pageSize: string;
    searchText: string;
  }) {
    
    return queryOptions({
      queryKey: ["getColor", page, pageSize, searchText],
      queryFn: () => getColor(page, pageSize, searchText),
      staleTime: 10 * 1000,
      refetchInterval: 10 * 1000,
      retry: false,
    });
  }
  
  export const useColor = ({
    page = "1", // ตั้งค่า default
    pageSize = "10",
    searchText = "",
  }: {
    page?: string;
    pageSize?: string;
    searchText?: string;
  }) => {
    return useQuery(
      fetchcolorOptions({
        page,
        pageSize,
        searchText,
      })
    );
  };
  