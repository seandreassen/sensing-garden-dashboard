import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import type { Observation } from "@/lib/types/api";

/**
 * Information card used in parent file "MoreInfoObservation.tsx"
 * @status Incomplete
 * As of now
 * Shows what taxonomy the observation is classified as.
 * 
 * Data is available in the fetched {@link Observation} object.
 *
 * @todo Add visual confidence representation e.g. a progress bar.
 *
 * @todo (Optional) Add human verification status.
 * 
 *@param observationData - An {@link Observation}. 
  Passed down from parent: "observation.tsx", which fetches from api with the hook "useObservations.tsx".
*/

const TaxonomyClassification = ({ observationData }: { observationData?: Observation }) => {
  return (
    <>
      <h1 className="mb-4 border-b py-4 text-lg">Taxonomy classification</h1>
      <Card className="bg-confirmGreen/10 text-confirmGreen">
        <CardContent>
          <CardHeader>
            <h3 className="mb-2 text-muted-foreground">Family result</h3>
          </CardHeader>
          <p className="mb-2 pl-4 text-lg font-semibold capitalize">
            {observationData ? `${observationData.family}` : "No identification result"}
          </p>
          <i className="pl-4 text-muted-foreground">
            {observationData
              ? `Family confidence: ${(observationData.family_confidence * 100).toFixed(1)}%`
              : "Not found"}
          </i>
        </CardContent>
      </Card>
    </>
  );
};
export { TaxonomyClassification };
