import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type OnChangeFn,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";

import { ObservationRowDialog } from "@/components/observations/ObservationRowDialog";
import { Spinner } from "@/components/ui/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useFilters } from "@/lib/hooks/useFilters";
import type { SelectedDeploymentResponse, Observation } from "@/lib/types/api";
import { cn } from "@/lib/utils";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  limit: number;
  data: TData[];
  deploymentData?: SelectedDeploymentResponse;
  isLoading: boolean;
  isError: boolean;
  sorting: SortingState;
  rowCount: number;
  pageIndex: number;
  onSortingChange: OnChangeFn<SortingState>;
}

function DataTable<TData extends Observation, TValue>({
  columns,
  data,
  deploymentData,
  isLoading,
  isError,
  sorting,
  onSortingChange,
  rowCount,
  pageIndex,
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
    rowCount: rowCount,
    manualPagination: true,
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

  return (
    <>
      <ObservationRowDialog
        onClose={() => setOpen(false)}
        observationData={observationData}
        deploymentData={deploymentData}
        openStatus={open}
      />
      <Table className="table-fixed text-wrap">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "border-b-2 bg-muted py-4 text-center text-sm text-wrap wrap-break-word text-muted-foreground md:text-base",
                      (header.column.columnDef.meta as { className?: string })?.className,
                    )}
                  >
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
          {!isLoading && !isError && table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="cursor-pointer"
                // oxlint-disable-next-line jsx_a11y/prefer-tag-over-role
                role="button"
                aria-label="More info observation"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openModal(row.original);
                  }
                }}
                onClick={() => openModal(row.original)} //Opens modal with correct row's info onclick.
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "text-center",
                      (cell.column.columnDef.meta as { className?: string })?.className,
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                style={{ height: `${limit * 6}rem` }}
                className="flex h-full"
              >
                {isLoading ? (
                  <Spinner className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2" />
                ) : isError ? (
                  <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    Failed to load data.
                  </p>
                ) : (
                  <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    No classifications found for specified filters.
                  </p>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
export { DataTable };
