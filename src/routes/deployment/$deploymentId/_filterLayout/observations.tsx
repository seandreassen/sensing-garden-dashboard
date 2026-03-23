import { createFileRoute } from "@tanstack/react-router";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import JSZip from "jszip";
import { Download } from "lucide-react";
import { useState } from "react";

import { columns } from "@/components/observationTable/columns";
import { DataTable } from "@/components/observationTable/DataTable";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Spinner } from "@/components/ui/Spinner";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservations } from "@/lib/hooks/useObservations";
import type { Observation } from "@/lib/types/api";

/**
 * Calls data with useObservations hook with parameters from url
 * Sorting state set in `handleSortingChange` in child `DataTable`
 * Adds a download button which supports csv, json and zipped folder of iages.
 *
 * @status - Incomplete lacks pagination, date filtering, and showing confidence as bar only for select species.
 *
 * @todo - Implement pagination, date filtering, and show confidence for only selected taxonomy.
 *
 */
export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/observations")({
  component: RouteComponent,
});

const fetchImageBlob = async (url: string): Promise<Blob | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    return await res.blob();
  } catch {
    return null;
  }
};

function RouteComponent() {
  const { hub, startDate, endDate } = useFilters();
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: false }]);

  const { data: observations, isLoading } = useObservations({
    sortBy: sorting[0]?.id,
    sortDesc: sorting[0]?.desc,
    deviceFilter: hub || undefined,
    startTime: startDate || undefined,
    endTime: endDate || undefined,
    limit: 10,
  });

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting = typeof updater === "function" ? updater(sorting) : updater;
    setSorting(newSorting);
  };

  const filters = useFilters();

  const [downloadCSV, setDownloadCSV] = useState(true);
  const [downloadJSON, setDownloadJSON] = useState(true);
  const [downloadImages, setDownloadImages] = useState(false);

  const handleDownload = async () => {
    try {
      const items: Observation[] = observations?.items ?? [];

      const headers: (keyof Observation)[] = ["timestamp", "device_id"];
      if (filters.taxonomyLevel === "family") {
        headers.push("family", "family_confidence");
      } else if (filters.taxonomyLevel === "genus") {
        headers.push("genus", "genus_confidence");
      } else if (filters.taxonomyLevel === "species") {
        headers.push("species", "species_confidence");
      }

      if (downloadCSV) {
        const now = new Date();
        const timestamp = now.toLocaleString("sv-SE").replace(/[: ]/g, "-");

        const filename = `Sensing_Garden_Observations_${timestamp}.csv`;

        const rows = items.map((obj) =>
          headers
            .map((h) => {
              const val = obj[h];
              if (val === undefined || val === null) {
                return "";
              }
              const str = String(val);
              if (str.includes(",") || str.includes('"') || str.includes("\n")) {
                return `"${str.replace(/"/g, '""')}"`;
              }
              return str;
            })
            .join(", "),
        );

        const csv = [headers.join(", "), ...rows].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      if (downloadJSON) {
        const now = new Date();
        const timestamp = now.toLocaleString("sv-SE").replace(/[: ]/g, "-");

        const filename = `Sensing_Garden_Observations_${timestamp}.json`;

        const filteredItems: Partial<Observation>[] = items.map((obj) => {
          const filtered: Record<string, string | number | undefined> = {};
          for (let i = 0; i < headers.length; i++) {
            const h = headers[i];
            filtered[h] = obj[h];
          }
          return filtered;
        });

        const blob = new Blob([JSON.stringify(filteredItems, null, 2)], {
          type: "application/json",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      if (downloadImages) {
        const now = new Date();
        const timestamp = now.toLocaleString("sv-SE").replace(/[: ]/g, "-");

        const filenameZip = `Sensing_Garden_Images_${timestamp}.zip`;

        const zip = new JSZip();
        const folder = zip.folder("images");
        if (!folder) {
          return;
        }

        for (const item of items) {
          if (!item.image_url) {
            continue;
          }

          const blob = await fetchImageBlob(item.image_url);
          if (!blob) {
            continue;
          }

          const safeTimestamp = String(item.timestamp).replace(/[: ]/g, "-");

          const filename = `${item.device_id}_${safeTimestamp}.jpg`;
          folder.file(filename, blob);
        }

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = filenameZip;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch {
      alert("Something went wrong while downloading. Please try again.");
    }
  };

  return isLoading ? (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner className="size-8" />
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Observations</h2>

        <Popover>
          <PopoverTrigger>
            <Button className="inline-flex items-center gap-2">
              <Download size={16} /> Export data
            </Button>
          </PopoverTrigger>

          <PopoverContent className="flex w-64 flex-col gap-1 p-3">
            <p className="px-2 pb-2 text-sm font-medium text-muted-foreground">Select formats</p>

            {/* CSV */}
            <button
              onClick={() => setDownloadCSV((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50"
            >
              CSV
              <span className="w-4 text-right text-xs">{downloadCSV ? "✓" : ""}</span>
            </button>

            {/* JSON */}
            <button
              onClick={() => setDownloadJSON((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50"
            >
              JSON
              <span className="w-4 text-right text-xs">{downloadJSON ? "✓" : ""}</span>
            </button>

            {/* Images */}
            <button
              onClick={() => setDownloadImages((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50"
            >
              Images (ZIP)
              <span className="w-4 text-right text-xs">{downloadImages ? "✓" : ""}</span>
            </button>

            <div className="my-2 h-px bg-border" />

            {/* Download */}
            <Button
              className="w-full hover:scale-105"
              disabled={!downloadCSV && !downloadJSON && !downloadImages}
              onClick={handleDownload}
            >
              Download data
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={observations?.items ?? []}
        nextToken={observations?.nextToken}
        isLoading={isLoading}
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
    </div>
  );
}
