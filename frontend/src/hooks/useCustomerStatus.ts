import { getCustomerStatus } from '@/services/customerStatus.service';
import { queryOptions, useQuery } from '@tanstack/react-query';

function fetchCustomerStatus({ page, pageSize, searchText }: { page: string; pageSize: string; searchText: string; }) {
  return queryOptions({
    queryKey: ['getCustomerStatus', page, pageSize, searchText],
    queryFn: () => getCustomerStatus(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useCustomerStatus = ({ page = '1', pageSize = '10', searchText = '' }: { page?: string; pageSize?: string; searchText?: string; }) => {
  return useQuery(fetchCustomerStatus({ page, pageSize, searchText }));
};
