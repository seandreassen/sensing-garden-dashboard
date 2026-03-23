import { ThermometerIcon, DropletsIcon, MapPinIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";

/**
 * @status Incomplete - Environmental data is not linked to observation. All is placeholder data.
 *
 * @todo Swap placeholder data for real data.
 * Requires either database linking environmental data to observation, or using insect timestamp to fetch environmental data.
 * @todo Minor style tweaks to match figma model
 *
 */
function EnvironmentDataPerObservation() {
  return (
    <>
      <h1 className="mb-4 border-b py-4 text-lg">Environmental conditions at capture</h1>
      <div className="flex flex-row gap-8">
        <Card className="mx-auto flex basis-1/3 flex-col">
          <CardContent className="flex flex-col items-center gap-1">
            <ThermometerIcon className="basis-1/3" />
            <h2 className="basis 1/3 text-muted-foreground">Temperature</h2>
            <p className="basis-1/3 font-bold"> 22 C</p>
            {/*Placeholder value*/}
          </CardContent>
        </Card>
        <Card className="mx-auto flex basis-1/3 flex-col">
          <CardContent className="flex flex-col items-center gap-1">
            <DropletsIcon className="basis-1/3" />
            <h2 className="basis 1/3 text-muted-foreground">Humidity</h2>
            <p className="basis-1/3 font-bold"> 46%</p>
            {/*Placeholder value*/}
          </CardContent>
        </Card>
        <Card className="mx-auto flex basis-1/3 flex-col">
          <CardContent className="flex flex-col items-center gap-1">
            <MapPinIcon className="basis-1/3" />
            <h2 className="basis 1/3 text-muted-foreground">Location</h2>
            <p className="basis-1/3 font-bold"> Garden Sector A</p>
            {/*Placeholder value*/}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
export { EnvironmentDataPerObservation };
