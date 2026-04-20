import { ThermometerIcon, DropletsIcon, MapPinIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";
import type { SelectedDeploymentResponse, Observation } from "@/lib/types/api";
/**
 * @status Incomplete -  Location is placeholder value.
 *
 * @todo consider fetching environment data based on observation's timestamp if observation object does not have environmental readings.

 * @todo Minor style tweaks to match figma model
 *
 */
interface EnvironmentDataPerObservationProps {
  observationData: Observation | undefined;
  deploymentData?: SelectedDeploymentResponse;
}
function EnvironmentDataPerObservation({
  observationData,
  deploymentData,
}: EnvironmentDataPerObservationProps) {
  return (
    <>
      <h1 className="mb-4 border-b py-4 text-lg">Environmental conditions at capture</h1>
      <div className="flex flex-row gap-8">
        <Card className="mx-auto flex basis-1/3 flex-col">
          <CardContent className="flex flex-col items-center gap-1">
            <ThermometerIcon className="basis-1/3" />
            <h2 className="basis 1/3 text-muted-foreground">Temperature</h2>
            <p className="basis-1/3 font-bold">{`${observationData?.environment?.ambient_temperature ?? "No data"}`}</p>
          </CardContent>
        </Card>
        <Card className="mx-auto flex basis-1/3 flex-col">
          <CardContent className="flex flex-col items-center gap-1">
            <DropletsIcon className="basis-1/3" />
            <h2 className="basis 1/3 text-muted-foreground">Humidity</h2>
            <p className="basis-1/3 font-bold">{`${observationData?.environment?.ambient_humidity ?? "No data"}`}</p>
          </CardContent>
        </Card>
        <Card className="mx-auto flex basis-1/3 flex-col">
          <CardContent className="flex flex-col items-center gap-1">
            <MapPinIcon className="basis-1/3" />
            <h2 className="basis 1/3 text-muted-foreground">Location</h2>
            <p className="basis-1/3 font-bold">{`${
              deploymentData?.deployment.location_name ??
              JSON.stringify(observationData?.environment?.location) ??
              JSON.stringify(deploymentData?.deployment.location) ??
              "No data"
            }`}</p>
            {/*Placeholder value*/}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
export { EnvironmentDataPerObservation };
