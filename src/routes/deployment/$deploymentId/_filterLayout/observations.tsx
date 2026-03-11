import { createFileRoute } from "@tanstack/react-router";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useState } from "react";

import { columns } from "@/components/observationTable/columns";
import { DataTable } from "@/components/observationTable/data-table";
import { Spinner } from "@/components/ui/Spinner";
import { useObservations } from "@/lib/hooks/useObservations";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/observations")({
  component: RouteComponent,
});

function RouteComponent() {
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: false }]);
  const [deviceFilter] = useState<string>();
  const [nextToken, setNextToken] = useState<string>();

  const { data: observations, isLoading } = useObservations({
    sortBy: sorting[0]?.id,
    sortDesc: sorting[0]?.desc,
    deviceFilter,
    nextToken,
    limit: 10,
  });

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting = typeof updater === "function" ? updater(sorting) : updater;
    setSorting(newSorting);
    setNextToken(undefined); // reset cursor
  };

  return isLoading ? (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner className="size-8" />
    </div>
  ) : (
    <DataTable
      columns={columns}
      data={observations?.items ?? []}
      nextToken={observations?.nextToken}
      isLoading={isLoading}
      sorting={sorting}
      onLoadMore={(token) => setNextToken(token)}
      onSortingChange={handleSortingChange}
    />
  );
}
