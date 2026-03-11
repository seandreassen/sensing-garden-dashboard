import { ShieldCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { useFilters } from "@/lib/hooks/useFilters";
import { cn } from "@/lib/utils";

import { filterFieldClass, filterLabelClass } from "./filterStyles";

const presets = [
  { value: 0, label: "All" },
  { value: 70, label: "≥ 70" },
  { value: 80, label: "≥ 80" },
  { value: 90, label: "≥ 90" },
];

function ConfidenceFilter() {
  const { updateFilters, minConfidence } = useFilters();
  const [sliderValue, setSliderValue] = useState(minConfidence);

  useEffect(() => {
    setSliderValue(minConfidence);
  }, [minConfidence]);

  return (
    <div className={filterFieldClass}>
      <label htmlFor="filter-confidence" className={filterLabelClass}>
        <ShieldCheckIcon className="h-3 w-3" />
        Minimum Confidence (0–100)
      </label>
      <div className="flex items-center gap-2">
        {presets.map((preset) => {
          const active = minConfidence === preset.value;
          return (
            <Button
              key={preset.value}
              variant={active ? "default" : "outline"}
              size="lg"
              className={cn("rounded", !active && "bg-card")}
              onClick={() => updateFilters({ minConfidence: preset.value })}
            >
              {preset.label}
            </Button>
          );
        })}
        <Slider
          value={[sliderValue]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setSliderValue(typeof value === "number" ? value : value[0])}
          onValueCommitted={(value) =>
            updateFilters({ minConfidence: typeof value === "number" ? value : value[0] })
          }
          className="mx-2 h-px flex-1 bg-border"
        />
        <span className="min-w-10 text-sm font-semibold">{sliderValue}</span>
      </div>
    </div>
  );
}

export { ConfidenceFilter };
