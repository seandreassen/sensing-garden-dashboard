import { CameraIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
          <span className="mt-2 text-4xl font-semibold">{count ?? 0}</span>
        )}
      </CardContent>
    </Card>
  );
}

export { TotalInsectCountCard };
