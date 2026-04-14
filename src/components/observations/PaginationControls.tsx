import { Button } from "@/components/ui/Button";

interface PaginationControlProps {
  isCountLoading: boolean;
  isCountError: boolean;
  rowCount: number;
  pageIndex: number;
  limit: number;
  onPageChange: (direction: "forward" | "backward") => void;
}

function PaginationControls({
  isCountLoading,
  isCountError,
  rowCount,
  pageIndex,
  limit,
  onPageChange,
}: PaginationControlProps) {
  const pageCount: number = Math.ceil(rowCount / limit);

  return (
    <div className="mb-0 flex justify-between border-t border-t-foreground bg-muted px-6 py-4">
      <Button
        className="w-18"
        variant="outline"
        size="sm"
        onClick={() => onPageChange("backward")}
        disabled={pageIndex < 1}
      >
        Previous
      </Button>
      <div className="flex flex-col items-center text-xs">
        <p>
          Page{" "}
          <span className="font-bold text-primary">
            {`${pageCount === 0 ? 0 : pageIndex + 1} `}{" "}
          </span>
          of {isCountError ? "?" : isCountLoading ? "..." : pageCount}
        </p>
        <p>
          {!isCountError && !isCountLoading
            ? `Rows ${rowCount > 0 ? pageIndex * limit + 1 : 0} - 
                ${pageIndex === pageCount - 1 ? rowCount : (pageIndex + 1) * limit}
                of 
                ${rowCount}`
            : isCountLoading
              ? "Loading..."
              : "Error fetching row count."}
        </p>
      </div>
      <Button
        className="w-18"
        variant="outline"
        size="sm"
        onClick={() => onPageChange("forward")}
        disabled={pageIndex >= pageCount - 1}
      >
        Next
      </Button>
    </div>
  );
}
export { PaginationControls };
