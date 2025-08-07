import { SelectRowsPerPage } from "@/components/ui/pagination-with-links";
import { Flex, Button } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

const PaginationComponent = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) => {
  return (
    <Flex justify="between" align="center" className="mt-4 p-4 border-t">
      <SelectRowsPerPage
        options={[5, 10, 20, 50]}
        setPageSize={onPageSizeChange}
        pageSize={itemsPerPage}
      />

      {/* Page Navigation */}
      <Flex align="center" gap="2">
        <Button
          variant="outline"
          size="1"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-2"
        >
          <ChevronLeftIcon />
        </Button>

        {/* Page Numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "solid" : "outline"}
              size="1"
              onClick={() => onPageChange(pageNum)}
              className="px-2 min-w-8"
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="1"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-2"
        >
          <ChevronRightIcon />
        </Button>
      </Flex>
    </Flex>
  );
};
export default PaginationComponent;
