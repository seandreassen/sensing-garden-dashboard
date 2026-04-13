import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { Observation } from "@/lib/types/api";
import { cn } from "@/lib/utils";

import { ConfidenceProgressBar } from "./ConfidenceProgessBar";

/**
 * Columns: Image, Hub, Family, Genus, Species and timestamp.
 * @status - When confirmations status is supported in backend, implement confirmations tatus row.
 */

const columns: ColumnDef<Observation>[] = [
  {
    header: "Image",
    cell: ({ row }) => (
      <img
        className="h-20 w-20 text-wrap"
        src={row.original.image_url ?? ""}
        aria-label="image of observation"
        loading="lazy"
      />
    ),
  },
  {
    header: "ID",
    cell: ({ row, table }) => {
      const isDesc = table.getState().sorting[0]?.desc;
      const rowCount = table.getRowCount();
      const { pageSize, pageIndex } = table.getState().pagination;
      const id = isDesc
        ? Number(row.id) + pageSize * pageIndex + 1
        : rowCount - pageSize * pageIndex - Number(row.id);
      return <div className="flex max-w-40 flex-col text-wrap">{id}</div>;
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          className={cn("[font-size:inherit]")}
          variant="outline"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Timestamp
          {sorted === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
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

      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  },
  {
    header: "Hub",
    cell: ({ row }) => {
      const hub = row.original.device_id;
      return <div className="flex max-w-40 flex-col text-wrap">{hub}</div>;
    },
  },
  {
    accessorKey: "family",
    header: "Family",
    cell: ({ row }) => {
      const family = row.original.family ?? "-";
      return <span>{family}</span>;
    },
  },
  {
    accessorKey: "family_confidence",
    header: "Confidence",
    cell: ({ row }) => <ConfidenceProgressBar confidence={row.original.family_confidence} />,
  },
  {
    accessorKey: "genus",
    header: "Genus",
    cell: ({ row }) => {
      const genus = row.original.genus;
      return <span>{genus}</span>;
    },
  },
  {
    accessorKey: "genus_confidence",
    header: "Confidence",
    cell: ({ row }) => <ConfidenceProgressBar confidence={row.original.genus_confidence} />,
  },
  {
    accessorKey: "species",
    header: "Species",
    cell: ({ row }) => {
      const species = row.original.species;
      return <span>{species}</span>;
    },
  },
  {
    accessorKey: "species_confidence",
    header: "Confidence",
    cell: ({ row }) => <ConfidenceProgressBar confidence={row.original.species_confidence} />,
  },
];

export { columns };
