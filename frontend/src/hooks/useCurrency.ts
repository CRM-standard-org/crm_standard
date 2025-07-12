import { getAllCurrency, selectCurrency } from "@/services/currency.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchCurrencyOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["getAllCurrency", page, pageSize, searchText],
    queryFn: () => getAllCurrency(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}
export const useCurrency = ({
  page = "1", // ตั้งค่า default
  pageSize = "10",
  searchText = "",
}: {
  page?: string;
  pageSize?: string;
  searchText?: string;
}) => {
  return useQuery(
    fetchCurrencyOptions({
      page,
      pageSize,
      searchText,
    })
  );
};

//select Customer Role
function fetchSelectCurrency({
  searchText,
}: {
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["selectCurrency", searchText],
    queryFn: () => selectCurrency(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}
export const useSelectCurrency = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery(
    fetchSelectCurrency({
      searchText,
    })
  );
};