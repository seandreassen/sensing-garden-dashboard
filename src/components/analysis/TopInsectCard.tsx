import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useTopFamilies } from "@/lib/hooks/useTopFamilies";

function formatPct(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? `${rounded.toFixed(0)}%` : `${rounded.toFixed(1)}%`;
}

export function TopInsectCard() {
  const { rows, isLoading, error } = useTopFamilies(5);

  return (
    <Card className="border border-zinc-800/70 bg-zinc-950/70">
      <CardHeader>
        <CardTitle>Top 5 families</CardTitle>
        <CardDescription>Most detected insect families</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-sm text-white/40">Loading...</div>
        ) : error ? (
          <div className="text-sm text-rose-300">Error: {error}</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-800/70">
            <div className="grid grid-cols-[72px_1fr_120px_100px] gap-3 border-b border-zinc-800/70 bg-zinc-900/60 px-4 py-3 text-sm font-medium text-zinc-400">
              <div>Rank</div>
              <div>Family</div>
              <div className="text-right">Count</div>
              <div className="text-right">Percent</div>
            </div>

            <div className="divide-y divide-zinc-800/70">
              {rows.map((row) => (
                <div
                  key={row.family}
                  className="grid grid-cols-[72px_1fr_120px_100px] gap-3 bg-zinc-950/40 px-4 py-4"
                >
                  <div className="text-zinc-400">#{row.rank}</div>

                  <div className="font-semibold text-white">{row.family}</div>

                  <div className="text-right font-semibold text-lime-400 tabular-nums">
                    {row.count.toLocaleString()}
                  </div>

                  <div className="text-right text-zinc-300 tabular-nums">{formatPct(row.pct)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
