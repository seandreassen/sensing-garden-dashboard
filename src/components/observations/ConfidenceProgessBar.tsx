import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

type ConfidenceProgressBarProps = {
  confidence: number;
};

function ConfidenceProgressBar({ confidence }: ConfidenceProgressBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
      <Progress
        className={cn(
          "md:basis-3/5",
          confidence >= 1
            ? "border border-green-800/50 *:data-[slot=progress-indicator]:bg-green-800"
            : confidence >= 0.8
              ? "border border-green-500/40 *:data-[slot=progress-indicator]:bg-green-500"
              : confidence >= 0.6
                ? "border border-yellow-500/40 *:data-[slot=progress-indicator]:bg-yellow-500"
                : confidence >= 0.4
                  ? "border border-orange-400/40 *:data-[slot=progress-indicator]:bg-orange-400"
                  : "border border-red-700/50 *:data-[slot=progress-indicator]:bg-red-700",
        )}
        value={confidence * 100}
      />
      <span className="py-2 md:basis-1/5">{`${(confidence * 100).toFixed(0)}%`}</span>
    </div>
  );
}

export { ConfidenceProgressBar };
