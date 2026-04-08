import { ObservationsChart } from "@/components/charts/ObservationsChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/utils";

interface ObservationsCardProps {
  deploymentId: string;
  className?: string;
}

function ObservationsCard({ deploymentId, className }: ObservationsCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <CardHeader>
        <CardTitle className="text-lg capitalize">Insect detections over time</CardTitle>
        <CardDescription>Daily detection count over the selected period</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <ObservationsChart deploymentId={deploymentId} />
      </CardContent>
    </Card>
  );
}

export { ObservationsCard };
