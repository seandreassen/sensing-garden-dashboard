import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useTopFamilies, type TopFamilyRow } from "@/lib/hooks/useTopFamilies";

export type TopInsectCardProps = {
  title?: string;
  subtitle?: string;
};

function formatPct(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? `${rounded.toFixed(0)}%` : `${rounded.toFixed(1)}%`;
}

function FamilyRow({ row }: { row: TopFamilyRow }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[24px_1fr_auto] items-baseline gap-4">
        <div className="text-zinc-400">{row.rank}</div>

        <div className="text-2xl font-semibold text-white">{row.family}</div>

        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-semibold text-white tabular-nums">{row.count}</span>
          <span className="text-lg text-zinc-400">({formatPct(row.pct)})</span>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-lime-400"
          style={{ width: `${row.barPct}%` }}
          aria-label={`${row.family} ${formatPct(row.pct)}`}
        />
      </div>
    </div>
  );
}

export function TopInsectCard({
  title = "Top Families",
  subtitle = "Most detected taxa",
}: TopInsectCardProps) {
  const { rows, isLoading, error } = useTopFamilies(5);

  return (
    <Card className="border border-zinc-800/70 bg-zinc-950/70">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-zinc-400">{subtitle}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-5 h-px w-full bg-white/10" />

        {isLoading ? (
          <div className="text-sm text-white/40">Loading families…</div>
        ) : error ? (
          <div className="text-sm text-rose-300">Error: {error}</div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-white/40">No family data found.</div>
        ) : (
          <div className="space-y-5">
            {rows.map((row) => (
              <FamilyRow key={row.family} row={row} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
