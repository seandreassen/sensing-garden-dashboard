import { createFileRoute } from "@tanstack/react-router";
import type { SortingState, OnChangeFn } from "@tanstack/react-table";
import { useState } from "react";

import { columns } from "@/components/observationTable/columns";
import { DataTable } from "@/components/observationTable/data-table";
import { useObservations } from "@/lib/hooks/useObservations";
export const Route = createFileRoute("/observationTable")({
  component: ObservationTable,
});

/*
  Component with observationTable. Calls to hook useObservations
   with the optional search parameters:
    sortBy,
    sortDesc,
    deviceFilter,
    nextToken,
    limit

  Customized shadcn components in @/components/observationsTable
  
  */

function ObservationTable() {
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: false }]);
  const [deviceFilter] = useState<string>();
  const [nextToken, setNextToken] = useState<string>();

  const { data, error, isLoading, isFetching, isError } = useObservations({
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
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading data{(error as Error).message}</div>;
  }
  if (!data) {
    return null;
  }
  return (
    <div className="container mx-auto py-10">
      {}
      <DataTable
        columns={columns}
        data={data?.items}
        nextToken={data?.nextToken}
        isLoading={isLoading || isFetching}
        sorting={sorting}
        onLoadMore={(token) => setNextToken(token)}
        onSortingChange={handleSortingChange}
      />
    </div>
  );
}
