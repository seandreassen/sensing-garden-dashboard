import { createFileRoute } from "@tanstack/react-router";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useState } from "react";

import { columns } from "@/components/observationTable/columns";
import { DataTable } from "@/components/observationTable/DataTable";
import { Spinner } from "@/components/ui/Spinner";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservations } from "@/lib/hooks/useObservations";

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
  const { hub, startDate, endDate } = useFilters();
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: false }]);

  const { data: observations, isLoading } = useObservations({
    startTime: startDate,
    endTime: endDate,
    hubId: hub,
    sortBy: sorting[0]?.id,
    sortDesc: sorting[0]?.desc,
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
        data={observations?.items ?? []}
        isLoading={isLoading}
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
    </div>
  );
}
