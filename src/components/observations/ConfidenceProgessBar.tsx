import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

type ConfidenceProgressBarProps = {
  confidence: number;
};

function ConfidenceProgressBar({ confidence }: ConfidenceProgressBarProps) {
  return (
    <div className="flex items-center gap-4">
      <Progress
        className={cn(
          "basis-3/5 border",
          confidence >= 0.8
            ? "border-success/50 *:data-[slot=progress-indicator]:bg-success"
            : confidence >= 0.6
              ? "border-caution/50 *:data-[slot=progress-indicator]:bg-caution"
              : confidence >= 0.4
                ? "border-warn/50 *:data-[slot=progress-indicator]:bg-warn"
                : "border-destructive/50 *:data-[slot=progress-indicator]:bg-destructive",
        )}
        value={confidence * 100}
      />
      <span className="basis-1/5 py-2">{`${(confidence * 100).toFixed(0)}%`}</span>
    </div>
  );
}

export { ConfidenceProgressBar };
