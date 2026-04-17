import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";

import { ConfidenceProgressBar } from "@/components/observations/ConfidenceProgessBar";
import { Button } from "@/components/ui/Button";
import type { Observation } from "@/lib/types/api";
import { cn } from "@/lib/utils";

/**
 * Columns: Image, Hub, Family, Genus, Species and timestamp.
 * @status - When confirmations status is supported in backend, implement confirmations tatus row.
 */
const defaultColumnClass: string = "text-center";
const columns: ColumnDef<Observation>[] = [
  {
    header: "ID",
    meta: {
      className: `${defaultColumnClass} max-sm:w-15`,
    },
    cell: ({ row, table }) => {
      const isDesc = table.getState().sorting[0]?.desc;
      const rowCount = table.getRowCount();
      const { pageSize, pageIndex } = table.getState().pagination;
      const id = isDesc
        ? Number(row.id) + pageSize * pageIndex + 1
        : rowCount - pageSize * pageIndex - Number(row.id);
      return <div className="mx-auto min-w-10 text-wrap wrap-break-word">{id}</div>;
    },
  },
  {
    header: "PREVIEW",
    meta: {
      className: defaultColumnClass,
    },
    cell: ({ row }) => (
      <img
        className="mx-auto h-15 w-15 text-wrap sm:h-20 sm:w-20"
        src={row.original.image_url ?? ""}
        aria-label="image of observation"
        loading="lazy"
      />
    ),
  },
  {
    header: "HUB",
    meta: {
      className: defaultColumnClass,
    },
    cell: ({ row }) => {
      const hub = row.original.device_id;
      return <p className="text-wrap wrap-break-word">{hub}</p>;
    },
  },

  {
    accessorKey: "family",
    meta: {
      className: defaultColumnClass,
    },
    header: "FAMILY",
    cell: ({ row }) => {
      const family = row.original.family ?? "-";
      return <p className="text-wrap wrap-break-word">{family}</p>;
    },
  },
  {
    accessorKey: "family_confidence",
    meta: {
      className: defaultColumnClass,
    },
    header: "CONFIDENCE",
    cell: ({ row }) => <ConfidenceProgressBar confidence={row.original.family_confidence} />,
  },
  {
    accessorKey: "genus",
    meta: {
      className: defaultColumnClass,
    },
    header: "Genus",
    cell: ({ row }) => {
      const genus = row.original.genus;
      return <p className="text-wrap wrap-break-word">{genus}</p>;
    },
  },
  {
    accessorKey: "genus_confidence",
    meta: {
      className: defaultColumnClass,
    },
    header: "CONFIDENCE",
    cell: ({ row }) => <ConfidenceProgressBar confidence={row.original.genus_confidence} />,
  },
  {
    accessorKey: "species",
    meta: {
      className: defaultColumnClass,
    },
    header: "CONFIDENCE",
    cell: ({ row }) => {
      const species = row.original.species;
      return <p className="text-wrap wrap-break-word">{species}</p>;
    },
  },
  {
    accessorKey: "species_confidence",
    meta: {
      className: defaultColumnClass,
    },
    header: "CONFIDENCE",
    cell: ({ row }) => <ConfidenceProgressBar confidence={row.original.species_confidence} />,
  },
  {
    accessorKey: "timestamp",
    meta: {
      className: defaultColumnClass,
    },
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          className={cn("[font-size:inherit]")}
          variant="outline"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          TIMESTAMP
          {sorted === "asc" ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDownIcon className="h-4 w-4" />
          ) : (
            <ArrowUpDownIcon className="h-4 w-4" />
          )}
        </Button>
      );
    },
    sortingFn: "datetime",
    cell: ({ row }) => {
      const value = row.original.timestamp as string | number | Date | null;

      if (!value) {
        return "—";
      }

      const date = new Date(value);

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return (
        <p className="mx-auto text-wrap">
          {date.toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      );
    },
  },
];

export { columns };
