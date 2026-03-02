import { Info, TrendingDown, TrendingUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type SpeciesRichnessCardProps = {
  value: number;
  trendPct?: number;
  periodLabel?: string;
  interpretationTitle?: string;
  interpretationBody?: string;
};

function formatSignedPct(v: number) {
  const sign = v > 0 ? "+" : v < 0 ? "-" : "";
  return `${sign}${Math.abs(v).toFixed(1)}%`;
}

function CardShell({
  title,
  subtitle,
  rightSlot,
  children,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-800/70 bg-zinc-950/70 text-zinc-50",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm",
      )}
    >
      <div className="flex items-start justify-between gap-3 p-6 pb-2">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h3>
          {subtitle ? <p className="text-sm text-zinc-400">{subtitle}</p> : null}
        </div>
        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>

      <div className="p-6 pt-2">{children}</div>
    </div>
  );
}

export function SpeciesRichnessCard({
  value,
  trendPct,
  periodLabel = "vs previous period",
  interpretationTitle = "Moderate-to-high diversity detected.",
  interpretationBody = "The ecosystem shows healthy species distribution with balanced community structure.",
}: SpeciesRichnessCardProps) {
  const dir =
    trendPct === undefined ? "flat" : trendPct > 0 ? "up" : trendPct < 0 ? "down" : "flat";

  return (
    <CardShell
      title="Species richness"
      subtitle="Species diversity metric for the selected period"
      rightSlot={<Info className="h-5 w-5 text-zinc-500" />}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-5">
          <div className="text-[56px] leading-none font-semibold tracking-tight text-lime-400 tabular-nums">
            {value.toLocaleString()}
          </div>
          <div className="mt-2 text-sm text-zinc-400">Current value</div>
        </div>

        <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-5">
          <div className="text-sm text-zinc-400">Trend</div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                "text-3xl font-semibold tracking-tight tabular-nums",
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

        <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-5">
          <div className="text-sm text-zinc-400">Interpretation</div>
          <p className="mt-2 text-base leading-relaxed">
            <span className="font-medium text-lime-300">{interpretationTitle} </span>
            <span className="text-zinc-200">{interpretationBody}</span>
          </p>
        </div>
      </div>
    </CardShell>
  );
}
