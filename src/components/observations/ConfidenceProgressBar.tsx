import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";
import { getConfidenceClass } from "@/lib/utils/confidenceColor";
type ConfidenceProgressBarProps = {
  confidence: number;
};

function ConfidenceProgressBar({ confidence }: ConfidenceProgressBarProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
      <Progress
        tabIndex={-1}
        className={cn("border sm:basis-3/5", getConfidenceClass(confidence))}
        value={confidence * 100}
      />
      <p className="basis-1/5 py-0 sm:py-2">{`${(confidence * 100).toFixed(0)}%`}</p>
    </div>
  );
}

export { ConfidenceProgressBar };
