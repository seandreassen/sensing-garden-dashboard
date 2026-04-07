import { createFileRoute } from "@tanstack/react-router";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";

import { columns } from "@/components/observationTable/columns";
import { DataTable } from "@/components/observationTable/DataTable";
import { Spinner } from "@/components/ui/Spinner";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservationCount } from "@/lib/hooks/useObservationCount";
import { useObservations } from "@/lib/hooks/useObservations";
import type { Observation } from "@/lib/types/api";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/observations")({
  head: () => ({
    meta: [{ title: "Observations | Sensing Garden Dashboard" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const limit: number = 10;
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: true }]);
  const [pageIndex, setPageIndex] = useState<number>(0);
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
    limit: limit,
    next_token: `{"offset":${limit * pageIndex}}`,
  });

  const { data: totalCount } = useObservationCount({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
  });

  useEffect(() => {
    setPageIndex(0);
  }, [sorting, startDate, endDate, hub, minConfidence, taxonomyLevel, selectedTaxa]);

  const onPageChange = (direction: string) => {
    if (direction === "forward" && data?.next_token) {
      setPageIndex((i) => i + 1);
    }
    if (direction === "backward" && pageIndex >= 1) {
      setPageIndex((i) => i - 1);
    }
  };

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
        limit={limit}
        data={data?.items ?? []}
        isLoading={isLoading}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        pageIndex={pageIndex}
        onPageChange={(direction) => onPageChange(direction)}
        rowCount={typeof totalCount?.count === "number" ? totalCount.count : 0}
      />
    </div>
  );
}
