"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { Observation } from "@/lib/types/api";

/*
Columns: Image, Hub, Family, Genus, Species and timestamp.
  Should allow sort by timestamp.
  Maybe later an observation status will be added to allow confirmation of observations.
  */
export type ObservationsResponse = {
  //Consider moving to lib/types
  items: Observation[];
  nextToken: string | null;
};

export const columns: ColumnDef<Observation>[] = [
  {
    //Maybe cache images.
    accessorKey: "image_url",
    header: "Image",
    cell: (info) => (
      <img
        className="text-align center text-wrap"
        src={info.getValue<string>()}
        aria-label="image of observation"
        loading="lazy"
        style={{ height: 80, width: 100 }}
      />
    ),
  },
  {
    accessorKey: "device_id",
    header: "Hub",
    cell: (info) => {
      const hub = info.row.original.device_id;
      return <div className="flex max-w-40 flex-col text-wrap">{hub}</div>;
    },
  },
  {
    accessorKey: "family",
    header: "Family",
    cell: (info) => {
      const family = info.getValue<string>();
      const family_confidence = info.row.original.family_confidence;
      return (
        <div className="flex flex-col">
          <span>{family}</span>
          <span className="text-xs text-gray-500">Confidence: {family_confidence.toFixed(4)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "genus",
    header: "Genus",
    cell: (info) => {
      const genus = info.getValue<string>();
      const genus_confidence = info.row.original.genus_confidence;
      return (
        <div className="flex flex-col">
          <span>{genus}</span>
          <span className="text-xs text-gray-500">Confidence: {genus_confidence.toFixed(4)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "species",
    header: "Species",
    cell: (info) => {
      const species = info.getValue<string>();
      const species_confidence = info.row.original.species_confidence;
      return (
        <div className="flex max-w-40 flex-col text-wrap">
          <span>{species}</span>
          <span className="text-xs text-gray-500">Confidence: {species_confidence.toFixed(4)}</span>
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
      const value = row.getValue("timestamp") as string | number | Date | null;

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
