import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { Observation } from "@/lib/types/api";

/**
* Columns: Image, Hub, Family, Genus, Species and timestamp.
* Should allow sort by timestamp.
* Maybe later an observation status will be added to allow confirmation of observations.

*/

const columns: ColumnDef<Observation>[] = [
  {
    header: "Image",
    cell: ({ row }) => (
      <img
        className="text-align center h-20 w-20 text-wrap"
        src={row.original.image_url ?? ""}
        aria-label="image of observation"
      />
    ),
  },
  {
    header: "Hub",
    cell: ({ row }) => {
      const hub = row.original.device_id;
      return <div className="flex max-w-40 flex-col text-wrap">{hub}</div>;
    },
  },
  {
    header: "Family",
    cell: ({ row }) => {
      const family = row.original.family ?? "-";
      const family_confidence = row.original.family_confidence;
      return (
        <div className="flex flex-col">
          <span>{family}</span>
          <span className="text-xs text-gray-500">
            Confidence: {family_confidence?.toFixed(4) ?? "-"}
          </span>
        </div>
      );
    },
  },
  {
    header: "Genus",
    cell: ({ row }) => {
      const genus = row.original.genus ?? "-";
      const genus_confidence = row.original.genus_confidence;
      return (
        <div className="flex flex-col">
          <span>{genus}</span>
          <span className="text-xs text-gray-500">Confidence: {genus_confidence?.toFixed(4)}</span>
        </div>
      );
    },
  },
  {
    header: "Species",
    cell: ({ row }) => {
      const species = row.original.species;
      const species_confidence = row.original.species_confidence;
      return (
        <div className="flex max-w-40 flex-col text-wrap">
          <span>{species}</span>
          <span className="text-xs text-gray-500">
            Confidence: {species_confidence?.toFixed(4)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
];

export { columns };
