import { getTag, selectTag } from "@/services/tagColor.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchTagOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {

  return queryOptions({
    queryKey: ["getTag", page, pageSize, searchText],
    queryFn: () => getTag(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useTag = ({
  page = "1", // ตั้งค่า default
  pageSize = "10",
  searchText = "",
}: {
  page?: string;
  pageSize?: string;
  searchText?: string;
}) => {
  return useQuery(
    fetchTagOptions({
      page,
      pageSize,
      searchText,
    })
  );
};

//select tag
function fetchSelectTag({
  searchText,
}: {
  searchText: string;
}) {

  return queryOptions({
    queryKey: ["selectTag", searchText],
    queryFn: () => selectTag(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useSelectTag = ({

  searchText = "",
}: {

  searchText?: string;
}) => {
  return useQuery(
    fetchSelectTag({
      searchText,
    })
  );
};