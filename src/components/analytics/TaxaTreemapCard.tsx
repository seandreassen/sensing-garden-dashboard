import { TaxaTreemap } from "@/components/analytics/TaxaTreemap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";

interface TaxaTreemapCardProps {
  deploymentId: string;
}

function TaxaTreemapCard({ deploymentId }: TaxaTreemapCardProps) {
  return (
    <Card className="w-full self-start p-4 lg:w-1/2">
      <CardHeader>
        <CardTitle className="text-lg capitalize">Taxa treemap</CardTitle>
        <CardDescription>Detection count by selected taxonomy level</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <TaxaTreemap deploymentId={deploymentId} />
      </CardContent>
    </Card>
  );
}

export { TaxaTreemapCard };
