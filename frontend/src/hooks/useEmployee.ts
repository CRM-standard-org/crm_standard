import { getAllEmployees, getEmployee, getEmployeeNoTeam, selectEmployee, selectEmployeeStatus, selectResponsible } from "@/services/employee.service";
import { PayLoadFilterEmployee } from "@/types/response/response.employee";
import { queryOptions, useQuery } from "@tanstack/react-query";

//พนักงานที่ยังไม่มีทีม
function fetchEmployeeNoneTeamOptions({
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

export const useEmployeeNoneTeam = ({
    page = "1", // ตั้งค่า default
    pageSize = "10",
    searchText = "",
}: {
    page?: string;
    pageSize?: string;
    searchText?: string;
}) => {
    return useQuery(
        fetchEmployeeNoneTeamOptions({
            page,
            pageSize,
            searchText,
        })
    );
};
//get all employoee
function fetchAllEmployees({
    page,
    pageSize,
    searchText,
    payload,
}: {
    page: string,
    pageSize: string;
    searchText: string;
    payload?: PayLoadFilterEmployee;
}) {

    return queryOptions({
        queryKey: ["getAllEmployees", page, pageSize, searchText,payload],
        queryFn: () => getAllEmployees(page, pageSize, searchText,payload),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useAllEmployee = ({
    page = "1", // ตั้งค่า default
    pageSize = "10",
    searchText = "",
    payload,
}: {
    page?: string;
    pageSize?: string;
    searchText?: string;
    payload?: PayLoadFilterEmployee;
}) => {
    return useQuery(
        fetchAllEmployees({
            page,
            pageSize,
            searchText,
            payload,
        })
    );
};
//get  employoee by id
function fetchEmployees({
    employeeId,
}: {
    employeeId: string,

}) {

    return queryOptions({
        queryKey: ["getEmployee", employeeId],
        queryFn: () => getEmployee(employeeId),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useEmployeeById = ({
    employeeId
}: {
 
    employeeId: string,

}) => {
    return useQuery(
        fetchEmployees({
            employeeId
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
    team_id: string;
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

//select employee status
function fetchSelectEmployeeStatus({
    searchText,
}: {
    searchText: string;
}) {

    return queryOptions({
        queryKey: ["selectEmployeeStatus", searchText],
        queryFn: () => selectEmployeeStatus(searchText),
        staleTime: 10 * 1000,
        refetchInterval: 10 * 1000,
        retry: false,
    });
}

export const useSelectEmployeeStatus = ({

    searchText = "",
}: {

    searchText?: string;
}) => {
    return useQuery(
        fetchSelectEmployeeStatus({
            searchText,
        })
    );
};