import { TopTaxa } from "@/components/overview/TopTaxa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { useFilters } from "@/lib/hooks/useFilters";

interface TopTaxaProps {
  deploymentId: string;
}

function TopTaxaCard({ deploymentId }: TopTaxaProps) {
  const { taxonomyLevel } = useFilters();

  const taxa =
    taxonomyLevel === "family" ? "families" : taxonomyLevel === "genus" ? "genera" : "species";

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg capitalize">Top {taxa}</CardTitle>
        <CardDescription>Most detected {taxa} for the selected period</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="h-full">
        <TopTaxa deploymentId={deploymentId} />
      </CardContent>
    </Card>
  );
}

export { TopTaxaCard };
