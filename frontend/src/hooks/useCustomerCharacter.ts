import { getCharacter, selectCharacter } from "@/services/customerCharacter.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchChararterOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["getCharacter", page, pageSize, searchText],
    queryFn: () => getCharacter(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}
export const useCustomerCharacter = ({
  page = "1", // ตั้งค่า default
  pageSize = "10",
  searchText = "",
}: {
  page?: string;
  pageSize?: string;
  searchText?: string;
}) => {
  return useQuery(
    fetchChararterOptions({
      page,
      pageSize,
      searchText,
    })
  );
};
//select Character
function fetchSelectChararter({
  searchText,
}: {
  searchText: string;
}) {
  return queryOptions({
    queryKey: ["selectCharacter", searchText],
    queryFn: () => selectCharacter(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}
export const useSelectCharacter = ({
  searchText = "",
}: {

  searchText?: string;
}) => {
  return useQuery(
    fetchSelectChararter({
      searchText,
    })
  );
};