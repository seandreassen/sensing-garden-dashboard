import JSZip from "jszip";
import { Download } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useExportData } from "@/lib/hooks/useExportData";
import { useFilters } from "@/lib/hooks/useFilters";
import { cn } from "@/lib/utils";

interface ExportDataProps {
  deploymentId: string;
}

type CsvRow = Record<string, string>;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function parseLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsv(csvText: string): CsvRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseLine(lines[0]);
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row: CsvRow = {};

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] ?? "";
    }

    rows.push(row);
  }

  return rows;
}

function normalizeImageUrl(url: string): string {
  const match = url.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{6}_\d{4}/);

  if (!match) {
    return url;
  }

  const badTimestamp = match[0];

  const normalizedTimestamp = badTimestamp.replace(
    /^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{6})_(\d{4})$/,
    "$1T$2:$3:$4.$5Z",
  );

  return url.replace(badTimestamp, normalizedTimestamp);
}

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

function ExportData({ deploymentId }: ExportDataProps) {
  const { startDate, endDate, hub } = useFilters();
  const { mutateAsync: exportData, isPending } = useExportData();

  const [downloadCSV, setDownloadCSV] = useState(true);
  const [downloadJSON, setDownloadJSON] = useState(true);
  const [downloadImages, setDownloadImages] = useState(false);

  const handleDownload = async () => {
    try {
      const result = await exportData({
        table: "classifications",
        start_time: startDate,
        end_time: endDate,
        device_id: hub ? [hub] : undefined,
        deployment_id: deploymentId,
        limit: 1000,
      });

      if (!result) {
        throw new Error("No data returned from export.");
      }

      const { csvText, filename } = result;

      if (downloadCSV) {
        const csvBlob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
        downloadBlob(csvBlob, filename);
      }

      if (downloadJSON) {
        const rows = parseCsv(csvText);
        const jsonFilename = filename.replace(/\.csv$/i, ".json");
        const jsonBlob = new Blob([JSON.stringify(rows, null, 2)], {
          type: "application/json",
        });
        downloadBlob(jsonBlob, jsonFilename);
      }

      if (downloadImages) {
        const rows = parseCsv(csvText);

        const now = new Date();
        const timestamp = now.toLocaleString("sv-SE").replace(/[: ]/g, "-");
        const filenameZip = `Sensing_Garden_Images_${timestamp}.zip`;

        const zip = new JSZip();
        const folder = zip.folder("images");

        if (!folder) {
          throw new Error("Could not create zip folder.");
        }

        let imageCount = 0;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const imageUrl = row.image_url;

          if (!imageUrl) {
            continue;
          }

          const normalizedImageUrl = normalizeImageUrl(imageUrl);
          const blob = await fetchImageBlob(normalizedImageUrl);

          if (!blob) {
            continue;
          }

          const safeTimestamp = String(row.timestamp || "unknown-time").replace(/[: ]/g, "-");
          const deviceId = row.device_id || "unknown-device";
          const imageFilename = `${deviceId}_${safeTimestamp}.jpg`;

          folder.file(imageFilename, blob);
          imageCount++;
        }

        if (imageCount === 0) {
          alert("No image_url field was found in the CSV, or the image URLs could not be fetched.");
          return;
        }

        const content = await zip.generateAsync({ type: "blob" });
        downloadBlob(content, filenameZip);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong while downloading.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger className={cn(buttonVariants(), "inline-flex items-center gap-2")}>
        <Download size={16} /> Export data
      </PopoverTrigger>

      <PopoverContent className="flex w-64 flex-col gap-1 p-3">
        <div className="mb-2 rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">Hub:</span> {hub ?? "All hubs"}
          </div>
          <div>
            <span className="font-medium text-foreground">From:</span>{" "}
            {new Date(startDate).toLocaleString()}
          </div>
          <div>
            <span className="font-medium text-foreground">To:</span>{" "}
            {new Date(endDate).toLocaleString()}
          </div>
        </div>

        <p className="px-2 pb-2 text-sm font-medium text-muted-foreground">Select formats</p>

        <button
          onClick={() => setDownloadCSV((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50"
        >
          CSV
          <span className="w-4 text-right text-xs">{downloadCSV ? "✓" : ""}</span>
        </button>

        <button
          onClick={() => setDownloadJSON((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50"
        >
          JSON
          <span className="w-4 text-right text-xs">{downloadJSON ? "✓" : ""}</span>
        </button>

        <button
          onClick={() => setDownloadImages((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50"
        >
          Images (ZIP)
          <span className="w-4 text-right text-xs">{downloadImages ? "✓" : ""}</span>
        </button>

        <div className="my-2 h-px bg-border" />

        <Button
          className="w-full hover:scale-105"
          disabled={(!downloadCSV && !downloadJSON && !downloadImages) || isPending}
          onClick={handleDownload}
        >
          {isPending ? "Loading..." : "Download data"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export { ExportData };
