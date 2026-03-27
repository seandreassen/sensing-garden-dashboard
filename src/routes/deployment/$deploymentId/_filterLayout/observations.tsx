import { createFileRoute } from "@tanstack/react-router";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useState } from "react";

import { columns } from "@/components/observationTable/columns";
import { DataTable } from "@/components/observationTable/DataTable";
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
  head: () => ({
    meta: [{ title: "Observations | Sensing Garden Dashboard" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: false }]);

  const { deploymentId } = Route.useParams();
  const { startDate, endDate, hub, minConfidence, taxonomyLevel, selectedTaxa } = useFilters();
  const { data, isLoading } = useObservations({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    selected_taxa: selectedTaxa,
    sort_by: sorting[0].id as keyof Observation,
    sort_desc: sorting[0].desc,
    limit: 10,
  });

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting = typeof updater === "function" ? updater(sorting) : updater;
    setSorting(newSorting);
  };

  return isLoading ? (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner className="size-8" />
    </div>
  ) : (
    <div className="flex items-center justify-between">
      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
    </div>
  );
}
