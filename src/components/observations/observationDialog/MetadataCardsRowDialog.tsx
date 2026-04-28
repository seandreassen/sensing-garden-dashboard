import { CalendarIcon, RadioIcon, PercentIcon, CpuIcon } from "lucide-react";

import { ConfidenceProgressBar } from "@/components/observations/ConfidenceProgressBar";
import { Card, CardContent } from "@/components/ui/Card";
import type { Observation } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getConfidenceClass } from "@/lib/utils/confidenceColor";
/**
 * A grid with 4 cards showcasing:
 *      - `device_id` as "hub ID"
 *      - `timestamp` formatted to date, hour, minute format.
 *      - `family_confidence` as AI Confidence score.
 *      - `model_id` as AI model tied to selected observation.
 *
 **/
function MetadataCardsRowDialog({ observationData }: { observationData?: Observation }) {
  const timestampReadable = observationData?.timestamp
    ? new Date(observationData?.timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No timestamp";

  return (
    <div>
      <h1 className="mb-4 border-b py-4 text-lg">Observation metadata</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="flex flex-row flex-wrap gap-0">
          <CalendarIcon strokeWidth={1.5} className="my-auto mr-0 ml-2 shrink-0 text-primary" />
          <CardContent className="py-auto flex-1">
            <h2 className="top-2 pb-1 text-muted-foreground">Timestamp</h2>
            <p>{timestampReadable}</p>
          </CardContent>
        </Card>
        <Card className="flex flex-row flex-wrap gap-0">
          <RadioIcon
            strokeWidth={1.5}
            className="my-auto mr-0 ml-2 shrink-0 basis-1/8 text-primary"
          />
          <CardContent className="flex-1 justify-center">
            <h2 className="pb-1 text-muted-foreground">Hub ID</h2>
            <p className="text-wrap">{observationData?.device_id ?? "Not found"}</p>
          </CardContent>
        </Card>
        <Card className="flex flex-row flex-wrap gap-0">
          <PercentIcon
            strokeWidth={1.5}
            className={cn(
              getConfidenceClass(observationData?.family_confidence),
              "bg-0 my-auto mr-0 ml-2 shrink-0 rounded-sm border-0",
            )}
          />
          <CardContent className="flex-1">
            <h2 className="pb-1 text-muted-foreground">Family Confidence </h2>
            {observationData ? (
              <ConfidenceProgressBar confidence={observationData?.family_confidence} />
            ) : (
              "Not found"
            )}
          </CardContent>
        </Card>
        <Card className="flex flex-row flex-wrap gap-0">
          <CpuIcon
            strokeWidth={1.5}
            className="my-auto mr-0 ml-2 shrink-0 basis-1/8 border-ring text-primary"
          />
          <CardContent className="flex-1 justify-center">
            <h2 className="pb-1 text-muted-foreground">Ai Model</h2>
            <p className="text-wrap">{observationData?.model_id ?? "Not found"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export { MetadataCardsRowDialog };
