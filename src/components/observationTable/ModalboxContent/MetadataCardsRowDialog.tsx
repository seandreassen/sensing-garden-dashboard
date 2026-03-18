import { Calendar, Radio, Percent, Cpu } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";
import type { Observation } from "@/lib/types/api";
/**
* A grid with 4 cards showcasing:
*      - `device_id` as "hub ID"¨
*      - `timestamp` formatted to date, hour, minute format.
*      - `family_confidence` as AI Confidence score. 
*      - `model_id` as AI model tied to selected observation.
* 
* @param observationData - An {@link Observation}. 
  Passed down from parent: "observation.tsx", which fetches from api with the hook "useObservations.tsx".
* 
* @status Incomplete - Lacks visualization for confidence percentage.
* Uncertain whether ai confidence information should be a card in metadata or grouped in `TaxonomyClassification` component appearing below this in `MoreInfoObservation`.
* 
* @todo Implement visualization for confidence percentage.
*/

const ObservationMetadata = ({ observationData }: { observationData?: Observation }) => {
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
          <Calendar className="my-auto mr-0 ml-2 shrink-0 basis-1/8" />
          <CardContent className="py-auto flex-1">
            <h2 className="top-2 pb-1 text-muted-foreground">Timestamp</h2>
            <p>{timestampReadable}</p>
          </CardContent>
        </Card>
        <Card className="flex flex-row flex-wrap gap-0">
          <Radio className="my-auto mr-0 ml-2 shrink-0 basis-1/8" />
          <CardContent className="flex-1 justify-center">
            <h2 className="pb-1 text-muted-foreground">Hub ID</h2>
            <p className="text-wrap">{observationData?.device_id ?? "Not found"}</p>
          </CardContent>
        </Card>
        <Card className="flex flex-row flex-wrap gap-0">
          <Percent className="my-auto mr-0 ml-2 shrink-0 basis-1/8" />
          <CardContent className="flex-1 justify-center">
            <h2 className="pb-1 text-muted-foreground">AI Confidence </h2>
            <p className="text-wrap">
              {observationData
                ? `${(observationData.family_confidence * 100).toFixed(1)}%`
                : "Not found"}
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-row flex-wrap gap-0">
          <Cpu className="my-auto mr-0 ml-2 shrink-0 basis-1/8" />
          <CardContent className="flex-1 justify-center">
            <h2 className="pb-1 text-muted-foreground">Ai Model</h2>
            <p className="text-wrap">{observationData?.model_id ?? "Not found"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export { ObservationMetadata };
