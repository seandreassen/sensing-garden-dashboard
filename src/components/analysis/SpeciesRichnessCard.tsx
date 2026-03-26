import { GitBranchIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useFilters } from "@/lib/hooks/useFilters";
import { useTaxaCount } from "@/lib/hooks/useTaxaCount";

interface SpeciesRichnessCardProps {
  deploymentId: string;
}

function SpeciesRichnessCard({ deploymentId }: SpeciesRichnessCardProps) {
  const { startDate, endDate, hub, taxonomyLevel, selectedTaxa, minConfidence } = useFilters();
  const { data, isLoading } = useTaxaCount({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    selected_taxa: selectedTaxa,
    sort_desc: true,
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
          <span className="mt-2 text-4xl font-semibold">{data?.counts.length ?? 0}</span>
        )}
      </CardContent>
    </Card>
  );
}

export { SpeciesRichnessCard };
