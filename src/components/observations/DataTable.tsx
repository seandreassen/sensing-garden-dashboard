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
import type { Observation } from "@/lib/types/api";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  limit: number;
  data: TData[];
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
    manualPagination: true, //Shows that filtering, sorting and pagination is done server side.
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
        openStatus={open}
      />
      <Table className="table-fixed text-wrap">
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
          {!isLoading && !isError && table.getRowModel().rows?.length ? (
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
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                style={{ height: `${limit * 6}rem` }}
                className="flex h-full w-screen items-center justify-center"
              >
                {isLoading ? (
                  <Spinner className="size-8" />
                ) : isError ? (
                  "Failed to load data"
                ) : (
                  "No classifications found for specified filters."
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
