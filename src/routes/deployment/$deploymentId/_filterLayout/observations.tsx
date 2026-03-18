import { createFileRoute } from "@tanstack/react-router";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { z } from "zod";

import { columns } from "@/components/observationTable/columns";
import { DataTable } from "@/components/observationTable/DataTable";
import { Spinner } from "@/components/ui/Spinner";
import { useObservations } from "@/lib/hooks/useObservations";

/**
 * Calls data with useObservations hook with parameters from url
 * Sorting state set in `handleSortingChange` in child `DataTable`
 *
 * @status - Incomplete lacks pagination, date filtering, and showing confidence as bar only for select species.
 *
 * @todo - Implement pagination, date filtering, and show confidence for only selected taxonomy.
 *
 */
const observationSearchSchema = z.object({
  hub: z.string().catch(""),
  next_token: z.string().catch(""),
});
export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/observations")({
  validateSearch: (search) => observationSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: false }]);

  const { hub, next_token } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data: observations, isLoading } = useObservations({
    sortBy: sorting[0]?.id,
    sortDesc: sorting[0]?.desc,
    deviceFilter: hub || undefined,
    nextToken: next_token || undefined,
    limit: 10,
  });

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting = typeof updater === "function" ? updater(sorting) : updater;
    setSorting(newSorting);
    navigate({ search: (prev) => ({ ...prev, nextToken: "" }) });
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
      onLoadMore={(token) => navigate({ search: (prev) => ({ ...prev, nextToken: token }) })}
      onSortingChange={handleSortingChange}
    />
  );
}
