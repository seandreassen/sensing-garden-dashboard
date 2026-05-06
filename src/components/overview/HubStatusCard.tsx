import { formatDistanceToNow, subHours } from "date-fns";

import { HubStatusCardHeader } from "@/components/overview/HubStatusCardHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Spinner } from "@/components/ui/Spinner";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservationCount } from "@/lib/hooks/useObservationCount";
import { useObservations } from "@/lib/hooks/useObservations";
import type { DeploymentDevice } from "@/lib/types/api";

interface HubStatusCardProps {
  deploymentId: string;
  hub: DeploymentDevice;
}

function HubStatusCard({ deploymentId, hub }: HubStatusCardProps) {
  const { startDate, endDate, minConfidence, taxonomyLevel, selectedTaxa } = useFilters();
  const { data, isLoading } = useObservations({
    device_id: [hub.device_id],
    deployment_id: deploymentId,
    limit: 1,
    sort_by: "timestamp",
    sort_desc: true,
  });
  const { data: countData, isLoading: isCountLoading } = useObservationCount({
    start_time: startDate,
    end_time: endDate,
    device_id: [hub.device_id],
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    selected_taxa: selectedTaxa,
  });

  return (
    <Card className="">
      <HubStatusCardHeader
        hub={hub}
        active={
          data?.items[0]?.timestamp ? data.items[0].timestamp > subHours(new Date(), 1) : false
        }
      />
      <Separator />
      <CardContent className="flex h-full flex-col">
        {isLoading || isCountLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last data:</span>
              <span>
                {data?.items[0]?.timestamp
                  ? `${formatDistanceToNow(data.items[0].timestamp)} ago`
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Detections in filtered period:</span>
              <span>{countData?.count ?? 0}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { HubStatusCard };
