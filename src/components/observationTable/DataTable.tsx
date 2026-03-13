import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type OnChangeFn,
} from "@tanstack/react-table";
import { useState } from "react";

import { MoreInfoObservation } from "@/components/observationTable/MoreInfoObservation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, //Shows that filtering, sorting and pagination will not be client side.
    manualSorting: true,
    manualFiltering: true,
    onSortingChange,
    state: { sorting },
  });
  const [open, setOpen] = useState<boolean>(false);
  const [observationData, setObservationData] = useState<Observation | undefined>();
  const openModal = (rowInfo: Observation) => {
    setObservationData(rowInfo);
    setOpen(true);
  };
  return (
    <div className="overflow-hidden rounded-md border">
      <MoreInfoObservation
        onClose={() => setOpen(false)}
        observationData={observationData}
        openStatus={open}
      />
      <Table>
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
