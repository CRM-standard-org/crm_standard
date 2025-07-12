import { getEmployeeNoTeam, selectEmployee, selectResponsible } from "@/services/employee.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

function fetchEmployeeOptions({
    page,
    pageSize,
    searchText,
}: {
    page: string;
    pageSize: string;
    searchText: string;
}) {

    return queryOptions({
        queryKey: ["getEmployeeNoTeam", page, pageSize, searchText],
        queryFn: () => getEmployeeNoTeam(page, pageSize, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useEmployee = ({
    page = "1", // ตั้งค่า default
    pageSize = "10",
    searchText = "",
}: {
    page?: string;
    pageSize?: string;
    searchText?: string;
}) => {
    return useQuery(
        fetchEmployeeOptions({
            page,
            pageSize,
            searchText,
        })
    );
};

//select Responsible
function fetchSelectResponsible({
    team_id,
    searchText,
}: {
    team_id: string;
    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectResponsible", team_id, searchText],
        queryFn: () => selectResponsible(team_id, searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useSelectResponsible = ({
    team_id,
    searchText = "",
}: {
    team_id:string;
    searchText?: string;
}) => {
    return useQuery(
        fetchSelectResponsible({
            team_id,
            searchText,
        })
    );
};
//select Responsible
function fetchSelectEmployee({
    searchText,
}: {
    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectEmployee", searchText],
        queryFn: () => selectEmployee(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useSelectEmployee = ({
    searchText = "",
}: {
     searchText?: string;
}) => {
    return useQuery(
        fetchSelectEmployee({
            searchText,
        })
    );
};