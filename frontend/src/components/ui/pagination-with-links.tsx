"use client";

import { type ReactNode, useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "@/lib/utils";
import { useLocation, useSearchParams } from "react-router-dom";

export interface PaginationWithLinksProps {
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string;
    pageSizeOptions: number[];
  };
  totalCount: number;
  pageSize: number;
  page: number;
  pageSearchParam?: string;
}

/**
 * Navigate with Nextjs links (need to update your own `pagination.tsx` to use Nextjs Link)
 * 
 * @example
 * ```
 * <PaginationWithLinks
    page={1}
    pageSize={20}
    totalCount={500}
  />
 * ```
 */
export function PaginationWithLinks({
  pageSizeSelectOptions,
  pageSize,
  totalCount,
  page,
  pageSearchParam,
}: PaginationWithLinksProps) {
  // const router = useRouter();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const totalPageCount = Math.ceil(totalCount / pageSize);

  const buildLink = useCallback(
    (newPage: number) => {
      const key = pageSearchParam || "page";
      const keyPageSize =
        pageSizeSelectOptions?.pageSizeSearchParam || "pageSize";
      if (!searchParams.get(key))
        return `${location.pathname}?${key}=${newPage}`;
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(key, String(newPage));

      // const pageSize = searchParams.get(
      //   pageSizeSelectOptions?.pageSizeSearchParam || "pageSize"
      // );
      // newSearchParams.set(keyPageSize, String(pageSize ?? "25"));

      const newUrl = `${location.pathname}?${newSearchParams.toString()}`; // Create the link
      setSearchParams(newSearchParams); // directly update searchParams
      console.log("newUrl", newUrl);
    },
    [
      // searchParams.get(pageSearchParam || "page"),
      // searchParams.get(
      //   pageSizeSelectOptions?.pageSizeSearchParam || "pageSize"
      // ),
      // location.pathname,
    ]
  );

  const navToPage = (newPage: number) => {
    const key = pageSearchParam || "page";
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(key, String(newPage));
    setSearchParams(newSearchParams); // directly update searchParams
  };

  const navToPageSize = useCallback(
    (newPageSize: number) => {
      const key = pageSizeSelectOptions?.pageSizeSearchParam || "pageSize";
      const newSearchParams = new URLSearchParams(searchParams.toString()); // clone searchParams
      newSearchParams.set(key, String(newPageSize)); // set new pageSize
      newSearchParams.set("page", "1");
      setSearchParams(newSearchParams); // directly update searchParams
    },
    [
      searchParams.get(
        pageSizeSelectOptions?.pageSizeSearchParam || "pageSize"
      ),
      location.pathname,
    ]
  );

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i} className=" w-[32px] h-[32px]">
            <PaginationLink
              // href={buildLink(i)}
              onClick={() => navToPage(i)}
              isActive={page === i}
              className=" w-[32px] h-[32px]"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1} className=" w-[32px] h-[32px]">
          <PaginationLink
            // href={buildLink(1)}
            onClick={() => navToPage(1)}
            isActive={page === 1}
            className=" w-[32px] h-[32px]"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start" className=" w-[32px] h-[32px]">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPageCount - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i} className=" w-[32px] h-[32px]">
            <PaginationLink
              // href={buildLink(i)}
              onClick={() => navToPage(i)}
              isActive={page === i}
              className=" w-[32px] h-[32px]"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (page < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end" className=" w-[32px] h-[32px]">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPageCount} className=" w-[32px] h-[32px]">
          <PaginationLink
            // href={buildLink(totalPageCount)}
            onClick={() => navToPage(totalPageCount)}
            isActive={page === totalPageCount}
            className=" w-[32px] h-[32px]"
          >
            {totalPageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      {pageSizeSelectOptions && (
        <div className="flex flex-col gap-4 flex-1">
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
      <Pagination className={cn({ "md:justify-end": pageSizeSelectOptions })}>
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem className=" h-[32px]">
            <PaginationPrevious
              // href={buildLink(Math.max(page - 1, 1))}
              onClick={() => navToPage(Math.max(page - 1, 1))}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : undefined}
              className={
                (page === 1 ? "pointer-events-none opacity-50" : undefined) +
                " h-[32px]"
              }
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem className="  h-[32px]">
            <PaginationNext
              // href={buildLink(Math.min(page + 1, totalPageCount))}
              onClick={() => navToPage(Math.min(page + 1, totalPageCount))}
              aria-disabled={page === totalPageCount}
              tabIndex={page === totalPageCount ? -1 : undefined}
              className={
                (page === totalPageCount
                  ? "pointer-events-none opacity-50 "
                  : undefined) + " h-[32px]"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function SelectRowsPerPage({
  options,
  setPageSize,
  pageSize,
}: {
  options: number[];
  setPageSize: (newSize: number) => void;
  pageSize: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-sm">จำนวนแถวต่อหน้า</span>

      <Select
        value={String(pageSize)}
        onValueChange={(value) => setPageSize(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select page size">
            {String(pageSize)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
