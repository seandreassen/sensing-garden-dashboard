import { createFileRoute } from "@tanstack/react-router";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";

import { columns } from "@/components/observationTable/columns";
import { DataTable } from "@/components/observationTable/DataTable";
import { Spinner } from "@/components/ui/Spinner";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservationCount } from "@/lib/hooks/useObservationCount";
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
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [cursorStack, setCursorStack] = useState<string[]>([""]);
  const currentToken = cursorStack[pageIndex];
  const { data: observations, isLoading } = useObservations({
    startTime: startDate,
    endTime: endDate,
    hubId: hub,
    sortBy: sorting[0]?.id,
    sortDesc: sorting[0]?.desc,
    limit: 10,
    nextToken: currentToken,
  });
  const { data: totalCount } = useObservationCount({
    startTime: startDate,
    endTime: endDate,
    hubId: hub,
  });

  useEffect(() => {
    if (observations?.next_token !== undefined) {
      setNextToken(observations.next_token ?? null);
    }
  }, [observations?.next_token]);

  const onPageChange = (direction: string) => {
    if (direction === "forward" && nextToken) {
      setCursorStack((prev) => [...prev.slice(0, pageIndex + 1), nextToken]);
      setPageIndex((i) => i + 1);
    }
    if (direction === "backward" && pageIndex >= 1) {
      setPageIndex((i) => i - 1);
    }
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting = typeof updater === "function" ? updater(sorting) : updater;
    setSorting(newSorting);
    setCursorStack([]);
    setPageIndex(0);
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
        pageIndex={pageIndex}
        onPageChange={(direction) => onPageChange(direction)}
        rowCount={typeof totalCount === "number" ? totalCount : 0}
      />
    </div>
  );
}
