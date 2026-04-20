import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

type ConfidenceProgressBarProps = {
  confidence: number;
};

function ConfidenceProgressBar({ confidence }: ConfidenceProgressBarProps) {
  return (
    <div className="mx-auto mt-3 flex flex-col items-center justify-center gap-2 sm:flex-row">
      <Progress
        className={cn(
          "border sm:basis-3/5",
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
      <p className="basis-1/5 py-0 sm:py-2">{`${(confidence * 100).toFixed(0)}%`}</p>
    </div>
  );
}

export { ConfidenceProgressBar };
