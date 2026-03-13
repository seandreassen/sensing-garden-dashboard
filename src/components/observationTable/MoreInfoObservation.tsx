import { ImageGalleryObservation } from "@/components/observationTable/ImageGalleryObservation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import type { Observation } from "@/lib/types/api";
import { cn } from "@/lib/utils";
type MoreInfoObservationProps = {
  onClose: () => void;
  observationData?: Observation | null;
  openStatus: boolean;
};

function MoreInfoObservation({ onClose, observationData, openStatus }: MoreInfoObservationProps) {
  /*const {timestamp, device_id, model_id,
             family, genus, species, 
             family_confidence, genus_confidence, 
             species_confidence, classification_data, 
             image_url, image_key, image_bucket, location, environment }:Observation */
  return (
    <Dialog open={openStatus} onOpenChange={onClose}>
      <DialogContent className={cn("flex flex-col !max-h-5/6 sm:!max-w-1/2")}>
        <DialogHeader className={cn("py-2 sticky border-b-2 border-b-stone-700 ")}>
          <DialogTitle>Observation details</DialogTitle>
          <DialogDescription className="text-xs">
            {observationData?.device_id} {/* Swap to observation ID when possible.*/}
          </DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar col-1 -mx-4 flex-col overflow-y-auto px-4">
          <ImageGalleryObservation image_url={observationData?.image_url} />
          <h1>Observation metadata</h1>
          <div className="grid-cols-2" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
export { MoreInfoObservation };
