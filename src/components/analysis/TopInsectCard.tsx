import { TrendingDown, TrendingUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type TotalInsectCountCardProps = {
  total: number;
  trendPct?: number;
  periodLabel?: string;
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

export function TotalInsectCountCard({
  total,
  trendPct,
  periodLabel = "vs previous period",
  subtitle = "Total detections across selected period",
}: TotalInsectCountCardProps) {
  const dir =
    trendPct === undefined ? "flat" : trendPct > 0 ? "up" : trendPct < 0 ? "down" : "flat";

  return (
    <CardShell title="Total insect count" subtitle={subtitle}>
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[56px] leading-none font-semibold tracking-tight text-lime-400 tabular-nums">
            {total.toLocaleString()}
          </div>
          <div className="mt-2 text-sm text-zinc-400">Total detections</div>
        </div>

        <div className="md:text-right">
          <div className="text-sm text-zinc-400">Trend</div>
          <div className="mt-1 flex items-center gap-2 md:justify-end">
            <span
              className={cn(
                "text-2xl font-semibold tracking-tight tabular-nums",
                dir === "up" && "text-lime-300",
                dir === "down" && "text-rose-300",
                dir === "flat" && "text-zinc-200",
              )}
            >
              {trendPct === undefined ? "—" : formatSignedPct(trendPct)}
            </span>

            {trendPct !== undefined ? (
              dir === "up" ? (
                <TrendingUp className="h-4 w-4 text-lime-300/80" />
              ) : dir === "down" ? (
                <TrendingDown className="h-4 w-4 text-rose-300/80" />
              ) : null
            ) : null}
          </div>
          <div className="mt-1 text-xs text-zinc-500">{periodLabel}</div>
        </div>
      </div>
    </CardShell>
  );
}
