import { useFilters } from "@/lib/hooks/useFilters";
import type { Observation } from "@/lib/types/api";

const BASE_URL = "https://api.sensinggarden.com/v1";

function useDownloadObservations() {
  const { startDate, endDate, taxonomyLevel, selectedTaxa } = useFilters();

  const buildSearchParams = ({
    nextToken,
    sortBy,
    sortDesc,
    deviceFilter,
    limit = 1000,
  }: {
    nextToken?: string;
    sortBy?: string;
    sortDesc?: boolean;
    deviceFilter?: string;
    limit?: number;
  }) => {
    const params = new URLSearchParams();

    if (startDate) {
      params.set("start_time", startDate);
    }
    if (endDate) {
      params.set("end_time", endDate);
    }
    if (taxonomyLevel) {
      params.set("taxonomy_level", taxonomyLevel);
    }
    if (selectedTaxa && selectedTaxa.length > 0) {
      params.set("taxa", selectedTaxa.join(","));
    }
    if (sortBy) {
      params.set("sort_by", sortBy);
    }
    if (typeof sortDesc === "boolean") {
      params.set("sort_desc", String(sortDesc));
    }
    if (deviceFilter) {
      params.set("device_id", deviceFilter);
    }
    if (nextToken) {
      params.set("next_token", nextToken);
    }
    params.set("limit", String(limit));

    return params;
  };

  const fetchObservationsForDownload = async ({
    nextToken,
    sortBy,
    sortDesc,
    deviceFilter,
  }: {
    nextToken?: string;
    sortBy?: string;
    sortDesc?: boolean;
    deviceFilter?: string;
  } = {}) => {
    let allItems: Observation[] = [];
    let token: string | undefined = nextToken;

    do {
      const params = buildSearchParams({ nextToken: token, sortBy, sortDesc, deviceFilter });
      const res = await fetch(`${BASE_URL}/classifications?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch observations for download");
      }

      const data = await res.json();
      allItems = allItems.concat(data.items ?? []);
      token = data.next_token ?? undefined;
    } while (token);

    return { items: allItems };
  };

  return {
    fetchObservationsForDownload,
  };
}

export { useDownloadObservations };
