import { selectEmployeeStatus } from "@/services/employee.service";
import { selectRole } from "@/services/role.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

//select employee status
function fetchSelectRole({
    searchText,
  }: {
    searchText: string;
  }) {
  
    return queryOptions({
      queryKey: ["selectRole", searchText],
      queryFn: () => selectRole(searchText),
      staleTime: 10 * 1000,
      refetchInterval: 10 * 1000,
      retry: false,
    });
  }
  
  export const useSelectRole = ({
  
    searchText = "",
  }: {
  
    searchText?: string;
  }) => {
    return useQuery(
        fetchSelectRole({
        searchText,
      })
    );
  };
