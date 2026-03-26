interface GlobalQueryParameters {
  limit?: number;
  next_token?: string | null;
  sortBy?: string;
  sortDesc?: boolean;
}

function addGlobalQueryParameters(
  params: URLSearchParams,
  { limit, next_token, sortBy, sortDesc }: GlobalQueryParameters = {},
) {
  if (limit && Number.isInteger(limit)) {
    params.set("limit", String(limit));
  }
  if (next_token) {
    params.set("next_token", next_token);
  }
  if (sortBy) {
    params.set("sort_by", sortBy);
  }
  if (sortDesc) {
    params.set("sort_desc", String(sortDesc));
  }
}

interface TimeQueryParameters {
  startTime?: string;
  endTime?: string;
}

function addTimeQueryParameters(
  params: URLSearchParams,
  { startTime, endTime }: TimeQueryParameters = {},
) {
  if (startTime && !isNaN(Date.parse(startTime))) {
    params.set("start_time", new Date(startTime).toISOString());
  }
  if (endTime && !isNaN(Date.parse(endTime))) {
    params.set("end_time", new Date(endTime).toISOString());
  }
}

export { addGlobalQueryParameters, addTimeQueryParameters };
