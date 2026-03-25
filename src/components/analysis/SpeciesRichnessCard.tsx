import { GitBranchIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useFamilyCount } from "@/lib/hooks/useFamilyCount";
import { useFilters } from "@/lib/hooks/useFilters";

function SpeciesRichnessCard() {
  const { startDate, endDate, hub, taxonomyLevel } = useFilters();
  const { data: count, isLoading } = useFamilyCount({
    startTime: startDate,
    endTime: endDate,
    hubId: hub,
    limit: 500,
  });

  const label = (() => {
    switch (taxonomyLevel) {
      case "family":
        return "Unique families";
      case "genus":
        return "Unique genera";
      case "species":
        return "Unique species";
    }
  })();

  return (
    <Card className="flex h-36 w-1/5 flex-col gap-3">
      <CardHeader className="flex flex-col gap-3">
        <GitBranchIcon className="size-5 text-primary" />
        <CardTitle className="text-sm text-muted-foreground uppercase">{label}</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <span className="mt-2 text-4xl font-semibold">{count ?? 0}</span>
        )}
      </CardContent>
    </Card>
  );
}

export { SpeciesRichnessCard };
