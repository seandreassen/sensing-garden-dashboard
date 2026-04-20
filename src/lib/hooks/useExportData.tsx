import { useMutation } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/utils/headers";

type ExportTable =
  | "detections"
  | "classifications"
  | "models"
  | "videos"
  | "environment"
  | "devices";

interface ExportParams {
  table: ExportTable;
  start_time: string;
  end_time: string;
  device_id?: string[];
  deployment_id?: string;
  model_id?: string;
  created?: string;
  sort_by?: string;
  sort_desc?: boolean;
  filename?: string;
  limit?: number;
}

interface ExportResult {
  csvText: string;
  filename: string;
}

function addQueryParams(params: URLSearchParams, queryParams: ExportParams) {
  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, String(item));
      }
      continue;
    }

    params.append(key, String(value));
  }
}

function getFilenameFromDisposition(contentDisposition: string | null, fallback: string) {
  if (!contentDisposition) {
    return fallback;
  }

  const match = contentDisposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? fallback;
}

async function exportData(queryParams: ExportParams): Promise<ExportResult> {
  const params = new URLSearchParams();
  addQueryParams(params, queryParams);

  const res = await fetch(`${env.VITE_API_BASE_URL}/export?${params.toString()}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    let message = `Export failed: ${res.status} ${res.statusText}`;

    try {
      const errorText = await res.text();
      if (errorText) {
        message = errorText;
      }
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  const csvText = await res.text();

  const fallbackFilename =
    queryParams.filename ??
    `${queryParams.table}_export_${queryParams.start_time}_${queryParams.end_time}.csv`;

  const filename = getFilenameFromDisposition(
    res.headers.get("Content-Disposition"),
    fallbackFilename,
  );

  return {
    csvText,
    filename,
  };
}

function useExportData() {
  return useMutation({
    mutationFn: exportData,
  });
}

export { useExportData };
export type { ExportParams, ExportResult, ExportTable };
