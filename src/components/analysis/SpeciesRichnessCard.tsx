import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useFamilyCount } from "@/lib/hooks/useFamilyCount";

export function SpeciesRichnessCard() {
  const { count, isLoading, error } = useFamilyCount();

  return (
    <Card className="border border-zinc-800/70 bg-zinc-950/70">
      <CardHeader>
        <CardTitle>Species richness</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-zinc-400">Unique families detected</div>

        <div className="mt-2 text-6xl font-semibold text-lime-400 tabular-nums">
          {isLoading ? "—" : error ? "ERR" : (count ?? 0).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
