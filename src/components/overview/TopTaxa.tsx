import { Progress } from "@/components/ui/Progress";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservationCount } from "@/lib/hooks/useObservationCount";
import { useTaxaCount } from "@/lib/hooks/useTaxaCount";

interface TopTaxaProps {
  deploymentId: string;
}

function TopTaxa({ deploymentId }: TopTaxaProps) {
  const { startDate, endDate, hub, taxonomyLevel, selectedTaxa, minConfidence } = useFilters();
  const { data, isError, isLoading, error } = useTaxaCount({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    selected_taxa: selectedTaxa,
    sort_desc: true,
  });
  const {
    data: countData,
    isError: isCountError,
    isLoading: isCountLoading,
    error: countError,
  } = useObservationCount({
    start_time: startDate,
    end_time: endDate,
    device_id: hub ? [hub] : undefined,
    deployment_id: deploymentId,
    min_confidence: minConfidence,
    taxonomy_level: taxonomyLevel,
    selected_taxa: selectedTaxa,
  });

  if (isLoading || isCountLoading) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading top taxa...</span>
      </div>
    );
  }

  if (isError || isCountError) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">
          Error: {error?.message ?? countError?.message}
        </span>
      </div>
    );
  }

  if (!data || data.counts.length === 0 || !countData) {
    return (
      <div className="flex h-75 items-center justify-center">
        <span className="text-sm text-muted-foreground">No data for selected filters</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {data.counts.slice(0, 5).map((taxaCount, index) => {
        const percentage = (taxaCount.count / countData.count) * 100;
        return (
          <div key={taxaCount.taxa} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{index + 1}</span>
                <p>{taxaCount.taxa}</p>
              </div>
              <div className="flex items-center gap-3">
                <span>{taxaCount.count}</span>
                <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
              </div>
            </div>
            <Progress className="h-1.5 bg-border" value={percentage} />
          </div>
        );
      })}
    </div>
  );
}

export { TopTaxa };
