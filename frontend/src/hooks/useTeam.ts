import { getTeam, getMembersInTeam} from "@/services/team.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchTeamOptions({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) {

    return queryOptions({
        queryKey: ["getTeam", page, pageSize, searchText],
        queryFn: () => getTeam(page, pageSize, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useTeam = ({
    page = "1", // ตั้งค่า default
    pageSize = "10",
    searchText = "",
}: {
    page?: string;
    pageSize?: string;
    searchText?: string;
}) => {
    return useQuery(
        fetchTeamOptions({
            page,
            pageSize,
            searchText,
        })
    );
};

//เรียกสมาชิกในทีมๆนั้น
function fetchTeamMemberOptions({
    team_id,
    page,
    pageSize,
    searchText,
  }: {
    team_id: string;
    page: string;
    pageSize: string;
    searchText: string;
  }) {
  
    return queryOptions({
      queryKey: ["getMembersInTeam", team_id, page, pageSize, searchText],
      queryFn: () => getMembersInTeam(team_id, page, pageSize, searchText),
      staleTime: 10 * 1000,
      refetchInterval: 10 * 1000,
      retry: false,
    });
  }
  
  export const useTeamMember = ({
    team_id,
    page = "1", // ตั้งค่า default
    pageSize = "10",
    searchText = "",
  }: {
    team_id:string;
    page?: string;
    pageSize?: string;
    searchText?: string;
  }) => {
    return useQuery(
      fetchTeamMemberOptions({
        team_id,
        page,
        pageSize,
        searchText,
      })
    );
  };
  