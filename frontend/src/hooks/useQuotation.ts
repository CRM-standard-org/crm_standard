import { getAllQuotations, getQuotation, selectVat } from "@/services/quotation.service";
import { PayLoadFilterQuotation } from "@/types/requests/request.quotation";
import { queryOptions, useQuery } from "@tanstack/react-query";

// fetch all quotation
function fetchAllQuotations({
  page,
  pageSize,
  searchText,
  payload,
}: {
  page: string,
  pageSize: string;
  searchText: string;
  payload?: PayLoadFilterQuotation;
}) {
  return queryOptions({
    queryKey: ["getAllQuotations", page, pageSize, searchText, payload],
    queryFn: () => getAllQuotations(page, pageSize, searchText, payload),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useAllQuotations = ({
  page = "1",
  pageSize = "10",
  searchText = "",
  payload,
}: {
  page?: string,
  pageSize?: string;
  searchText?: string;
  payload?: PayLoadFilterQuotation;
}) => {
  return useQuery(
    fetchAllQuotations({
      page,
      pageSize,
      searchText,
      payload,
    })
  );
}
//fetch quotation by id
function fetchQuotationById({
  quotationId
}: {
  quotationId: string,
}) {
  return queryOptions({
    queryKey: ["getQuotation", quotationId],
    queryFn: () => getQuotation(quotationId),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useQuotationById = ({
  quotationId
}: {
  quotationId: string,

}) => {
  return useQuery(
    fetchQuotationById({
      quotationId
    })
  );
}
//select tag
function fetchSelectVat({
  searchText,
}: {
  searchText: string;
}) {

  return queryOptions({
    queryKey: ["selectVat", searchText],
    queryFn: () => selectVat(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useSelectVat = ({

  searchText = "",
}: {

  searchText?: string;
}) => {
  return useQuery(
    fetchSelectVat({
      searchText,
    })
  );
};