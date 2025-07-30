import { getActivity, getAllActivities } from "@/services/activity.service";
import { PayLoadFilterActivity } from "@/types/requests/request.activity";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchAllActivityOptions({
  page,
  pageSize,
  searchText,
  payload,
}: {
  page: string;
  pageSize: string;
  searchText: string;
  payload?: PayLoadFilterActivity;
}) {

  return queryOptions({
    queryKey: ["getAllActivities", page, pageSize, searchText, payload],
    queryFn: () => getAllActivities(page, pageSize, searchText, payload),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useAllActivities = ({
  page = "1", // ตั้งค่า default
  pageSize = "10",
  searchText = "",
  payload,
}: {
  page?: string;
  pageSize?: string;
  searchText?: string;
  payload?: PayLoadFilterActivity;
}) => {
  return useQuery(
    fetchAllActivityOptions({
      page,
      pageSize,
      searchText,
      payload,
    })
  );
};

//fetch activity by id
function fetchQuotationById({
  activityId
}: {
    activityId: string,
}) {
  return queryOptions({
    queryKey: ["getActivity", activityId],
    queryFn: () => getActivity(activityId),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useActivityById = ({
    activityId
}: {
    activityId: string,

}) => {
  return useQuery(
    fetchQuotationById({
        activityId
    })
  );
}