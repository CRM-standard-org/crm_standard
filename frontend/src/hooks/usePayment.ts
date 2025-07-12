import { getAllPayment, selectPayment } from "@/services/paymentMethod.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchPaymentOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["getAllPayment", page, pageSize, searchText],
    queryFn: () => getAllPayment(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}
export const usePayment = ({
  page = "1", // ตั้งค่า default
  pageSize = "10",
  searchText = "",
}: {
  page?: string;
  pageSize?: string;
  searchText?: string;
}) => {
  return useQuery(
    fetchPaymentOptions({
      page,
      pageSize,
      searchText,
    })
  );
};

//select Payment 
function fetchSelectPayment({
  searchText,
}: {
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["selectPayment", searchText],
    queryFn: () => selectPayment(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}
export const useSelectPayment = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery(
    fetchSelectPayment({
      searchText,
    })
  );
};