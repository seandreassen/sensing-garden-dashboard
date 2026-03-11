import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Spinner } from "@/components/ui/Spinner";
import { useFamilyCount } from "@/lib/hooks/useFamilyCount";

export function SpeciesRichnessCard() {
  const { data: count, isLoading } = useFamilyCount();

  return (
    <Card className="w-1/6">
      <CardHeader>
        <CardTitle>Species richness</CardTitle>
      </CardHeader>

      <CardContent className="h-full">
        <Label htmlFor="unique-taxon-count" className="text-sm text-muted-foreground">
          Unique families detected
        </Label>

        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div id="unique-taxon-count" className="mt-2 text-6xl font-semibold text-primary">
            {count ?? 0}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
