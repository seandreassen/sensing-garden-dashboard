import { CameraIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservationCount } from "@/lib/hooks/useObservationCount";

interface TotalInsectCountCardProps {
  deploymentId: string;
}

function TotalInsectCountCard({ deploymentId }: TotalInsectCountCardProps) {
  const { startDate, endDate, hub, minConfidence, taxonomyLevel, selectedTaxa } = useFilters();
  const { data, isLoading } = useObservationCount({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    selected_taxa: selectedTaxa,
  });

  return (
    <Card className="flex h-36 w-1/5 flex-col gap-3">
      <CardHeader className="flex flex-col gap-3">
        <CameraIcon className="size-5 text-primary" />
        <CardTitle className="text-sm text-muted-foreground uppercase">
          Total observations
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <span className="mt-2 text-4xl font-semibold">{data?.count ?? 0}</span>
        )}
      </CardContent>
    </Card>
  );
}

export { TotalInsectCountCard };
