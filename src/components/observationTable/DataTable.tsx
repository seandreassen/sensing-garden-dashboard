import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type OnChangeFn,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";

import { ObservationRowDialog } from "@/components/observationTable/ObservationRowDialog";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useFilters } from "@/lib/hooks/useFilters";
import type { Observation } from "@/lib/types/api";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  limit: number;
  data: TData[];
  nextToken?: string | null;
  isLoading?: boolean;
  sorting: SortingState;
  rowCount?: number;
  pageIndex: number;
  onPageChange: (direction: "forward" | "backward") => void;
  onSortingChange: OnChangeFn<SortingState>;
  onLoadMore?: (nextToken: string) => void; //Not implemented function for pagination, feel free to discard.
}

function DataTable<TData extends Observation, TValue>({
  columns,
  data,
  sorting,
  onSortingChange,
  rowCount,
  pageIndex,
  onPageChange,
  limit,
}: DataTableProps<TData, TValue>) {
  const { taxonomyLevel } = useFilters();
  const [columnVisibility, setColumnVisibility] = useState({
    family: false,
    family_confidence: false,
    genus: false,
    genus_confidence: false,
    species: false,
    species_confidence: false,
  });

  useEffect(() => {
    setColumnVisibility({
      family: false,
      family_confidence: false,
      genus: false,
      genus_confidence: false,
      species: false,
      species_confidence: false,
      [taxonomyLevel]: true,
      [`${taxonomyLevel}_confidence`]: true,
    });
  }, [taxonomyLevel]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, //Shows that filtering, sorting and pagination will not be client side.
    rowCount: rowCount,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange,
    state: {
      sorting,
      columnVisibility,
      pagination: {
        pageIndex: pageIndex,
        pageSize: limit,
      },
    },
  });
  const [open, setOpen] = useState<boolean>(false);
  const [observationData, setObservationData] = useState<Observation | undefined>();
  const openModal = (rowInfo: Observation) => {
    setObservationData(rowInfo);
    setOpen(true);
  };

  {
    /*Pagination controls below. Shows what rows are shown and total rows. eg. 1-10 of 100 */
  }
  const paginationButtons = (
    <div className="flex justify-between border-t border-t-foreground bg-muted px-6 py-4">
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
          Page <span className="font-bold text-primary">{`${pageIndex + 1} `}</span>
          of {table.getPageCount()}
        </p>
        <p>
          Rows {pageIndex * limit + 1}-
          {pageIndex === table.getPageCount() - 1 ? rowCount : (pageIndex + 1) * limit} of{" "}
          {rowCount}
        </p>
      </div>
      <Button
        className="w-18"
        variant="outline"
        size="sm"
        onClick={() => onPageChange("forward")}
        disabled={pageIndex >= table.getPageCount() - 1}
      >
        Next
      </Button>
    </div>
  );
  return (
    <div className="overflow-hidden rounded-md border">
      <ObservationRowDialog
        onClose={() => setOpen(false)}
        observationData={observationData}
        openStatus={open}
      />
      <Table className="w-full table-fixed text-wrap">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="bg-muted p-4 text-base" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="cursor-pointer text-wrap"
                onClick={() => openModal(row.original)} //Opens modal with correct row's info onclick.
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="wrap-break-word" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {paginationButtons}
    </div>
  );
}
export { DataTable };
