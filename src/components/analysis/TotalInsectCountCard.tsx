import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useCount } from "@/lib/hooks/useCount";

export function TotalInsectCountCard() {
  const { count, loading, error } = useCount();

  return (
    <Card className="border border-zinc-800/70 bg-zinc-950/70">
      <CardHeader>
        <CardTitle>Total insects</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-zinc-400">Total detections in database</div>

        <div className="mt-2 text-6xl font-semibold text-lime-400 tabular-nums">
          {loading ? "—" : error ? "ERR" : (count ?? 0).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
