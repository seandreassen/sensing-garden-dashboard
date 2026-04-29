import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { getConfidenceClass } from "@/lib/utils/confidenceColor";
/**

 *
 * @todo (When available) Add human verification status. 
 * 
*
**/

interface TaxonomyClassificationRowDialogProps {
  taxonomyLevel: string;
  classificationResult?: string;
  observationConfidence?: number;
}
function TaxonomyClassificationRowDialog({
  taxonomyLevel,
  classificationResult,
  observationConfidence,
}: TaxonomyClassificationRowDialogProps) {
  return (
    <Card className={cn("mb-4", getConfidenceClass(observationConfidence))}>
      <CardContent>
        <CardHeader>
          <h3 className="mb-2 text-muted-foreground">{`${taxonomyLevel} result`}</h3>
        </CardHeader>
        <p className="mb-2 pl-4 text-lg font-semibold capitalize">
          {classificationResult ?? "No identification result"}
        </p>
        <i className="pl-4 text-muted-foreground">
          {observationConfidence && taxonomyLevel
            ? `${taxonomyLevel} confidence: ${(observationConfidence * 100).toFixed(1)}%`
            : "Confidence not found"}
        </i>
      </CardContent>
    </Card>
  );
}
export { TaxonomyClassificationRowDialog };
