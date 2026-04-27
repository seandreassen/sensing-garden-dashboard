import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import type { Observation } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getConfidenceClass } from "@/lib/utils/confidenceColor";
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

function TaxonomyClassificationRowDialog({ observationData }: { observationData?: Observation }) {
  return (
    <>
      <h1 className="mb-4 border-b py-4 text-lg">Taxonomy classification</h1>
      <Card className={cn("mb-4", getConfidenceClass(observationData?.family_confidence))}>
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
      <Card className={cn("mb-4", getConfidenceClass(observationData?.genus_confidence))}>
        <CardContent>
          <CardHeader>
            <h3 className="mb-2 text-muted-foreground">Genus result</h3>
          </CardHeader>
          <p className="mb-2 pl-4 text-lg font-semibold capitalize">
            {observationData ? `${observationData.genus}` : "No identification result"}
          </p>
          <i className="pl-4 text-muted-foreground">
            {observationData
              ? `Family confidence: ${(observationData.genus_confidence * 100).toFixed(1)}%`
              : "Not found"}
          </i>
        </CardContent>
      </Card>
      <Card className={cn("mb-4", getConfidenceClass(observationData?.species_confidence))}>
        <CardContent>
          <CardHeader>
            <h3 className="mb-2 text-muted-foreground">Species result</h3>
          </CardHeader>
          <p className="mb-2 pl-4 text-lg font-semibold capitalize">
            {observationData ? `${observationData.species}` : "No identification result"}
          </p>
          <i className="pl-4 text-muted-foreground">
            {observationData
              ? `Family confidence: ${(observationData.species_confidence * 100).toFixed(1)}%`
              : "Not found"}
          </i>
        </CardContent>
      </Card>
    </>
  );
}
export { TaxonomyClassificationRowDialog };
