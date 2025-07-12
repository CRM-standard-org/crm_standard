import { getAllGroupProduct, selectGroupProduct, getAllUnit, selectUnit, getAllProduct, selectProduct, getProductById } from "@/services/product.service";
import { queryOptions, useQuery } from "@tanstack/react-query";

//group
function fetchGroupOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {

  return queryOptions({
    queryKey: ["getAllGroupProduct", page, pageSize, searchText],
    queryFn: () => getAllGroupProduct(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useProductGroup = ({
  page = "1", // ตั้งค่า default
  pageSize = "10",
  searchText = "",
}: {
  page?: string;
  pageSize?: string;
  searchText?: string;
}) => {
  return useQuery(
    fetchGroupOptions({
      page,
      pageSize,
      searchText,
    })
  );
};

//select group
function fetchSelectGroup({
  searchText,
}: {
  searchText: string;
}) {

  return queryOptions({
    queryKey: ["selectGroupProduct", searchText],
    queryFn: () => selectGroupProduct(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useSelectGroupProduct = ({

  searchText = "",
}: {

  searchText?: string;
}) => {
  return useQuery(
    fetchSelectGroup({
      searchText,
    })
  );
};

//unit
function fetchUnitOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {

  return queryOptions({
    queryKey: ["getAllUnit", page, pageSize, searchText],
    queryFn: () => getAllUnit(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useUnit = ({
  page = "1", // ตั้งค่า default
  pageSize = "10",
  searchText = "",
}: {
  page?: string;
  pageSize?: string;
  searchText?: string;
}) => {
  return useQuery(
    fetchUnitOptions({
      page,
      pageSize,
      searchText,
    })
  );
};

//select unit
function fetchSelectUnit({
  searchText,
}: {
  searchText: string;
}) {

  return queryOptions({
    queryKey: ["selectUnit", searchText],
    queryFn: () => selectUnit(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useSelectUnit = ({

  searchText = "",
}: {

  searchText?: string;
}) => {
  return useQuery(
    fetchSelectUnit({
      searchText,
    })
  );
};
//product
function fetchProductOptions({
  page,
  pageSize,
  searchText,
}: {
  page: string;
  pageSize: string;
  searchText: string;
}) {

  return queryOptions({
    queryKey: ["getAllProduct", page, pageSize, searchText],
    queryFn: () => getAllProduct(page, pageSize, searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useProduct = ({
  page = "1", // ตั้งค่า default
  pageSize = "10",
  searchText = "",
}: {
  page?: string;
  pageSize?: string;
  searchText?: string;
}) => {
  return useQuery(
    fetchProductOptions({
      page,
      pageSize,
      searchText,
    })
  );
};
function fetchProductById({
    productId
}: {
  productId: string;
}) {

  return queryOptions({
    queryKey: ["getProduct", productId],
    queryFn: () => getProductById(productId),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useProductById = ({
  productId
}: {
  productId: string;
}) => {
  return useQuery(
    fetchProductById({
      productId,
    })
  );
};

//select product
function fetchSelectProduct({
  searchText,
}: {
  searchText: string;
}) {

  return queryOptions({
    queryKey: ["selectProduct", searchText],
    queryFn: () => selectProduct(searchText),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    retry: false,
  });
}

export const useSelectProduct = ({

  searchText = "",
}: {

  searchText?: string;
}) => {
  return useQuery(
    fetchSelectProduct({
      searchText,
    })
  );
};