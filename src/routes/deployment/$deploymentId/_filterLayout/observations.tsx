import { createFileRoute } from "@tanstack/react-router";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";

import { columns } from "@/components/observations/columns";
import { DataTable } from "@/components/observations/DataTable";
import { PaginationControls } from "@/components/observations/PaginationControls";
import { useDeployment } from "@/lib/hooks/useDeployment";
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
  const limit: number = 5;
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: true }]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { deploymentId } = Route.useParams();
  const { startDate, endDate, hub, minConfidence, taxonomyLevel, selectedTaxa } = useFilters();
  const {
    data: tableData,
    isLoading: isTableLoading,
    isError: isTableError,
  } = useObservations({
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

  const {
    data: observationCount,
    isLoading: isCountLoading,
    isError: isCountError,
  } = useObservationCount({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    selected_taxa: selectedTaxa,
  });

  const { data: deploymentData } = useDeployment({
    deployment_id: deploymentId,
  });

  useEffect(() => {
    setPageIndex(0);
  }, [sorting, startDate, endDate, hub, minConfidence, taxonomyLevel, selectedTaxa]);

  const onPageChange = (direction: string) => {
    if (direction === "forward" && tableData?.next_token) {
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

  return (
    <div className="w-full overflow-hidden rounded-sm border">
      {/* Table */}
      <DataTable
        columns={columns}
        limit={limit}
        pageIndex={pageIndex}
        rowCount={observationCount?.count ? observationCount.count : 0}
        data={tableData?.items ?? []}
        deploymentData={deploymentData ?? undefined}
        isLoading={isTableLoading}
        isError={isTableError}
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
      <PaginationControls
        limit={limit}
        isCountLoading={isCountLoading}
        pageIndex={pageIndex}
        onPageChange={(direction) => onPageChange(direction)}
        rowCount={observationCount?.count ? observationCount.count : 0}
        isCountError={isCountError}
      />
    </div>
  );
}
