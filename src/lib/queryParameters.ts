import type { QueryParameters } from "@/lib/types/api";

function addGlobalQueryParameters(
  params: URLSearchParams,
  { startTime, endTime, hubId, limit, sortBy, sortDesc }: QueryParameters,
) {
  if (startTime && !isNaN(Date.parse(startTime))) {
    params.set("start_time", new Date(startTime).toISOString());
  }
  if (endTime && !isNaN(Date.parse(endTime))) {
    params.set("end_time", new Date(endTime).toISOString());
  }
  if (hubId) {
    params.set("device_id", hubId);
  }
  if (limit && Number.isInteger(limit)) {
    params.set("limit", String(limit));
  }
  if (sortBy) {
    params.set("sort_by", sortBy);
  }
  if (sortDesc) {
    params.set("sort_desc", String(sortDesc));
  }
}

export { addGlobalQueryParameters };
