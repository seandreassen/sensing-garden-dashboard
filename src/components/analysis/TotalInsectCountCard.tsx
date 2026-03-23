import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Spinner } from "@/components/ui/Spinner";
import { useFilters } from "@/lib/hooks/useFilters";
import { useObservationCount } from "@/lib/hooks/useObservationCount";

function TotalInsectCountCard() {
  const { startDate, endDate, hub } = useFilters();
  const { data: count, isLoading } = useObservationCount({
    startTime: startDate,
    endTime: endDate,
    hubId: hub,
  });

  return (
    <Card className="w-1/6">
      <CardHeader>
        <CardTitle>Total insects</CardTitle>
      </CardHeader>

      <CardContent className="h-full">
        <Label htmlFor="total-insect-count" className="text-sm text-muted-foreground">
          Total detections in database
        </Label>

        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div id="total-insect-count" className="mt-2 text-6xl font-semibold text-primary">
            {count ?? 0}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { TotalInsectCountCard };
