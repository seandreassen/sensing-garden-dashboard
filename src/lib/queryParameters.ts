import type { IntervalUnit, TaxonomyLevel } from "@/lib/types/api";

interface QueryParameters {
  start_time?: string;
  end_time?: string;
  device_id?: string | string[];
  deployment_id?: string;
  model_id?: string;
  min_confidence?: number;
  taxonomy_level?: TaxonomyLevel;
  selected_taxa?: string[];
  limit?: number;
  next_token?: string | null;
  sort_by?: string;
  sort_desc?: boolean;
  interval_length?: number;
  interval_unit?: IntervalUnit;
}

function addQueryParameters(
  params: URLSearchParams,
  {
    start_time,
    end_time,
    device_id,
    deployment_id,
    model_id,
    min_confidence,
    taxonomy_level,
    selected_taxa,
    limit,
    next_token,
    sort_by,
    sort_desc,
    interval_length,
    interval_unit,
  }: QueryParameters = {},
) {
  if (start_time && !isNaN(Date.parse(start_time))) {
    params.set("start_time", new Date(start_time).toISOString());
  }
  if (end_time && !isNaN(Date.parse(end_time))) {
    params.set("end_time", new Date(end_time).toISOString());
  }
  if (device_id) {
    if (typeof device_id === "string") {
      params.set("device_id", device_id);
    } else if (device_id.length > 0) {
      params.set("device_id", device_id.join(","));
    }
  }
  if (deployment_id) {
    params.set("deployment_id", deployment_id);
  }
  if (model_id) {
    params.set("model_id", model_id);
  }
  if (min_confidence) {
    params.set("min_confidence", String(min_confidence));
  }
  if (taxonomy_level) {
    params.set("taxonomy_level", taxonomy_level);
  }
  if (selected_taxa && selected_taxa.length > 0) {
    params.set("selected_taxa", selected_taxa.join(","));
  }
  if (limit && Number.isInteger(limit)) {
    params.set("limit", String(limit));
  }
  if (next_token) {
    params.set("next_token", next_token);
  }
  if (sort_by) {
    params.set("sort_by", sort_by);
  }
  if (sort_desc) {
    params.set("sort_desc", String(sort_desc));
  }
  if (interval_length && Number.isInteger(interval_length)) {
    params.set("interval_length", String(interval_length));
  }
  if (interval_unit) {
    params.set("interval_unit", interval_unit);
  }
}

export { addQueryParameters };
