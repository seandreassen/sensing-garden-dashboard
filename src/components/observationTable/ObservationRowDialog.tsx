import { ConfirmObservation } from "@/components/observationTable/observationDialog/ConfirmObservation";
import { EnvironmentDataPerObservation } from "@/components/observationTable/observationDialog/EnvironmentDataPerObservation";
import { ImageGalleryObservation } from "@/components/observationTable/observationDialog/ImageGalleryObservation";
import { MetadataCardsRowDialog } from "@/components/observationTable/observationDialog/MetadataCardsRowDialog";
import { TaxonomyClassificationRowDialog } from "@/components/observationTable/observationDialog/TaxonomyClassificationRowDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import type { Observation } from "@/lib/types/api";
import { cn } from "@/lib/utils";

/**
 * Contains the following sections:
 * - `ImageGalleryObservation` — image(s) tied to the observation
 * - `ObservationMetadata` — Contains grid with 4 cards showcasing:
 *      - `device_id` as "hub ID"¨
 *      - `timestamp` formatted to date, hour, minute format.
 *      - `family_confidence` as AI Confidence score.
 *      - `model_id` as AI model tied to selected observation.
 * - `TaxonomyClassification` — AI classification results with confidence scores
 * - `EnvironmentDataPerObservation` — environmental conditions at time of observation
 * - `ConfirmObservation` — footer buttons for user verification (Confirm, Uncertain, Reject)
 *
 *
 * @param openStatus - Controls whether the dialog is visible.
 * @param onClose - Callback fired when the dialog is closed.
 * @param observationData - An {@link Observation} fetched via the `useObservations` hook
 * in the data-table's parent `observations`
 *
 * @status Incomplete — `device_id` is used as observation title in DialogTitle`, swap to "observation_id" if observation_id is available through api.
 * `EnvironmentDataPerObservation` All data is placeholder data.
 * `ImageGalleryObservation` In time of writing each observation has 1 image url, not a list of image urls. Image gallery uses 2 stock photos.
 *
 * @todo Add feature to swap between observations from table. See Figma
 * @todo Replace `device_id` with `observation_id` in `DialogDescription`.
 * @todo Pass `observationData` to `EnvironmentDataPerObservation` when supported.
 * @todo Pass `observationData` to `ConfirmObservation` when database verification is connected.
 * @todo If api returns list of image url. Modify ImageGalleryObservation's props and pass in an array.
 *
 */

type ObservationRowDialogProps = {
  onClose: () => void;
  observationData?: Observation;
  openStatus: boolean;
};

function ObservationRowDialog({ onClose, observationData, openStatus }: ObservationRowDialogProps) {
  return (
    <Dialog open={openStatus} onOpenChange={onClose}>
      <DialogContent className={cn("lg: col-1 mx-auto flex !max-h-6/7 flex-col sm:!max-w-1/2")}>
        <DialogHeader className={cn("sticky border-b pt-2 pb-4")}>
          <DialogTitle>Observation details</DialogTitle>
          <DialogDescription className="text-xs">
            {observationData?.device_id} {/* Swap to observation ID when possible.*/}
          </DialogDescription>
        </DialogHeader>

        <div aria-label="Data cards on selected observation." className="overflow-y-auto px-4">
          <ImageGalleryObservation aria-label="image-gallery" observationData={observationData} />

          <MetadataCardsRowDialog
            aria-label="observation metadata"
            observationData={observationData}
          />

          <TaxonomyClassificationRowDialog
            aria-label="Taxonomy classification"
            observationData={observationData}
          />

          <EnvironmentDataPerObservation aria-label="Environmental conditions" />
        </div>
        <DialogFooter className={cn("sm:flex-col")}>
          <ConfirmObservation />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export { ObservationRowDialog };
