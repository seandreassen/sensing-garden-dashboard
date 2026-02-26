"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/Button";

//Maybe later an observation status will be added to allow confirmation of observations.

export type Observation = {
  species: string;
  genus: string;
  family: string;
  species_confidence: number;
  genus_confidence: number;
  family_confidence: number;
  timestamp: string;
  device_id: string;
  model_id: string;
  image_url: string;
  image_bucket: string;
  image_key: string;
};

export type ObservationsResponse = {
  items: Observation[];
};

const failedImagesCache = new Set<string>();
export const columns: ColumnDef<Observation>[] = [
  {
    accessorKey: "image_url",
    header: "Image",
    cell: (info) =>
      failedImagesCache.has(info.getValue<string>()) ? (
        "observation"
      ) : (
        <img
          src={info.getValue<string>()}
          onError={() => failedImagesCache.add(info.getValue<string>())}
          alt="observation"
          aria-label="image of observation"
          loading="lazy"
          style={{ height: 80 }}
        />
      ),
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
      const species_confidence = info.row.original.family_confidence;
      return (
        <div className="flex flex-col">
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
      });
    },
  },
];
