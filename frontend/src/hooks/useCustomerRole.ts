import { getCustomerRole, selectCustomerRole } from "@/services/customerRole.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchCustomerRoleOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["getCustomerRole", page, pageSize, searchText],
    queryFn: () => getCustomerRole(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}
export const useCustomerRole = ({
  page = "1", // ตั้งค่า default
  pageSize = "10",
  searchText = "",
}: {
  page?: string;
  pageSize?: string;
  searchText?: string;
}) => {
  return useQuery(
    fetchCustomerRoleOptions({
      page,
      pageSize,
      searchText,
    })
  );
};

//select Customer Role
function fetchSelectCustomerRole({
  searchText,
}: {
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["selectCustomerRole", searchText],
    queryFn: () => selectCustomerRole(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}
export const useSelectCustomerRole = ({
  searchText = "",
}: {
  searchText?: string;
}) => {
  return useQuery(
    fetchSelectCustomerRole({
      searchText,
    })
  );
};