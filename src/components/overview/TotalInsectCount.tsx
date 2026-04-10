import { Spinner } from "@/components/ui/Spinner";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservationCount } from "@/lib/hooks/useObservationCount";

interface TotalInsectCountProps {
  deploymentId: string;
}

function TotalInsectCount({ deploymentId }: TotalInsectCountProps) {
  const { startDate, endDate, hub, minConfidence, taxonomyLevel, selectedTaxa } = useFilters();
  const { data, isError, isLoading, error } = useObservationCount({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    selected_taxa: selectedTaxa,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Error: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-sm text-muted-foreground">No data for selected filters</span>
      </div>
    );
  }

  return <span className="mt-2 text-4xl font-semibold">{data.count}</span>;
}

export { TotalInsectCount };
