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
  data: TData[];
  nextToken?: string | null;
  isLoading?: boolean;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onLoadMore?: (nextToken: string) => void; //Not implemented function for pagination, feel free to discard.
}

function DataTable<TData extends Observation, TValue>({
  columns,
  data,
  sorting,
  onSortingChange,
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
    const taxonomy: string = taxonomyLevel;
    const confidence = `${taxonomyLevel}_confidence`;
    setColumnVisibility({
      family: false,
      family_confidence: false,
      genus: false,
      genus_confidence: false,
      species: false,
      species_confidence: false,
      [taxonomy]: true,
      [confidence]: true,
    });
  }, [taxonomyLevel]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, //Shows that filtering, sorting and pagination will not be client side.
    manualSorting: true,
    manualFiltering: true,
    onSortingChange,
    state: {
      sorting,
      columnVisibility,
    },
  });
  const [open, setOpen] = useState<boolean>(false);
  const [observationData, setObservationData] = useState<Observation | undefined>();
  const openModal = (rowInfo: Observation) => {
    setObservationData(rowInfo);
    setOpen(true);
  };
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
                  <TableHead key={header.id}>
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
                className="cursor-pointer"
                onClick={() => openModal(row.original)} //Opens modal with correct row's info onclick.
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
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
    </div>
  );
}
export { DataTable };
