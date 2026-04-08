import { GitBranchIcon } from "lucide-react";

import { SpeciesRichness } from "@/components/analysis/SpeciesRichness";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useFilters } from "@/lib/hooks/useFilters";

interface SpeciesRichnessCardProps {
  deploymentId: string;
}

function SpeciesRichnessCard({ deploymentId }: SpeciesRichnessCardProps) {
  const { taxonomyLevel } = useFilters();

  const taxa =
    taxonomyLevel === "family" ? "families" : taxonomyLevel === "genus" ? "genera" : "species";

  return (
    <Card className="flex h-36 w-1/5 flex-col gap-3">
      <CardHeader className="flex flex-col gap-3">
        <GitBranchIcon className="size-5 text-primary" />
        <CardTitle className="text-sm text-muted-foreground uppercase">Unique {taxa}</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <SpeciesRichness deploymentId={deploymentId} />
      </CardContent>
    </Card>
  );
}

export { SpeciesRichnessCard };
