import { TrendingDown, TrendingUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type InsectRow = {
  rank: number;
  name: string;
  count: number;
  trendPct?: number;
};

export type TopInsectCardProps = {
  rows: InsectRow[];
  subtitle?: string;
};

function formatSignedPct(v: number) {
  const sign = v > 0 ? "+" : v < 0 ? "-" : "";
  return `${sign}${Math.abs(v).toFixed(1)}%`;
}

function CardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-800/70 bg-zinc-950/70 text-zinc-50",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm",
      )}
    >
      <div className="space-y-1 p-6 pb-2">
        <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h3>
        {subtitle ? <p className="text-sm text-zinc-400">{subtitle}</p> : null}
      </div>

      <div className="p-6 pt-2">{children}</div>
    </div>
  );
}

function TrendCell({ trendPct }: { trendPct?: number }) {
  if (trendPct === undefined) {
    return <span className="text-zinc-500">—</span>;
  }

  const dir = trendPct > 0 ? "up" : trendPct < 0 ? "down" : "flat";

  return (
    <div className="flex items-center justify-end gap-1 tabular-nums">
      <span
        className={cn(
          "text-sm font-medium",
          dir === "up" && "text-lime-300",
          dir === "down" && "text-rose-300",
          dir === "flat" && "text-zinc-300",
        )}
      >
        {formatSignedPct(trendPct)}
      </span>

      {dir === "up" ? (
        <TrendingUp className="h-4 w-4 text-lime-300/80" />
      ) : dir === "down" ? (
        <TrendingDown className="h-4 w-4 text-rose-300/80" />
      ) : null}
    </div>
  );
}

function RankedRow({ row }: { row: InsectRow }) {
  return (
    <div className="grid grid-cols-[64px_1fr_80px_90px] items-center gap-3 bg-zinc-950/40 px-4 py-4">
      <div className="font-medium text-zinc-400">#{row.rank}</div>
      <div className="text-lg font-semibold text-zinc-50">{row.name}</div>
      <div className="text-right text-lg font-semibold text-zinc-100 tabular-nums">
        {row.count.toLocaleString()}
      </div>
      <TrendCell trendPct={row.trendPct} />
    </div>
  );
}

export function TopInsectCard({
  rows,
  subtitle = "Detections with trend vs previous period",
}: TopInsectCardProps) {
  return (
    <CardShell title="Top 5 insect families detected" subtitle={subtitle}>
      <div className="overflow-hidden rounded-xl border border-zinc-800/70">
        <div className="divide-y divide-zinc-800/70">
          {rows.slice(0, 5).map((row) => (
            <RankedRow key={`${row.rank}-${row.name}`} row={row} />
          ))}
        </div>
      </div>
    </CardShell>
  );
}
