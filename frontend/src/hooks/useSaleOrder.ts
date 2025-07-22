import { getAllSaleOrder, getPaymentFile, getSaleOrder } from "@/services/saleOrder.service";
import { PayLoadFilterSaleOrder } from "@/types/requests/request.saleOrder";
import { queryOptions, useQuery } from "@tanstack/react-query";

// fetch all sale order
function fetchAllSaleOrders({
  page,
  pageSize,
  searchText,
  payload,
}: {
  page: string,
  pageSize: string;
  searchText: string;
  payload?: PayLoadFilterSaleOrder;
}) {
  return queryOptions({
    queryKey: ["getAllSaleOrder", page, pageSize, searchText, payload],
    queryFn: () => getAllSaleOrder(page, pageSize, searchText, payload),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useAllSaleOrders = ({
  page = "1",
  pageSize = "10",
  searchText = "",
  payload,
}: {
  page?: string,
  pageSize?: string;
  searchText?: string;
  payload?: PayLoadFilterSaleOrder;
}) => {
  return useQuery(
    fetchAllSaleOrders({
      page,
      pageSize,
      searchText,
      payload,
    })
  );
}

//fetch SaleOrder by id
function fetchSaleOrderById({
  saleOrderId
}: {
  saleOrderId: string,
}) {
  return queryOptions({
    queryKey: ["getSaleOrder", saleOrderId],
    queryFn: () => getSaleOrder(saleOrderId),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useSaleOrderById = ({
  saleOrderId
}: {
  saleOrderId: string,

}) => {
  return useQuery(
    fetchSaleOrderById({
      saleOrderId
    })
  );
}
//fetch SaleOrder payment file by id
function fetchPaymentFileById({
  paymentLogId
}: {
  paymentLogId: string,
}) {
  return queryOptions({
    queryKey: ["getPaymentFile", paymentLogId],
    queryFn: () => getPaymentFile(paymentLogId),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
    enabled: !!paymentLogId,
  });
}

export const usePaymentFileById = ({
  paymentLogId
}: {
  paymentLogId: string,

}) => {
  return useQuery(
    fetchPaymentFileById({
      paymentLogId
    })
  );
}
