import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import type { Observation } from "@/lib/types/api";

/**
 * Information card used in parent file "MoreInfoObservation.tsx"
 * @status Incomplete
 * As of now
 * Shows what taxonomy the observation is classified as.
 * 
 * @todo Add AI model confidence data for family, genus, and species classifications.
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
      <Card className="mx-auto">
        <CardContent>
          <CardHeader>
            <h3 className="mb-2 text-muted-foreground">Identification result</h3>
          </CardHeader>
          <p className="ml-4 text-lg font-semibold">
            {observationData
              ? `${observationData.family + " " + observationData.genus + " " + observationData.species}`
              : "No identification result"}
          </p>
        </CardContent>
      </Card>
    </>
  );
};
export { TaxonomyClassification };
