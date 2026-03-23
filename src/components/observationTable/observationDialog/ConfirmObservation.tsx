import { CircleCheckIcon, CircleAlertIcon, CircleXIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";

/**
 * Three buttons allowing user to verify classification of observations.
 * Confirm, Uncertain, and Reject are options.
 * Placed in MoreInfoObservation's footer.

 * New button variants created for Button component: "confirm" and "uncertain"
 * They use the respective color themes "confirmGreen", and "uncertainOrange".
 * These color themes are globally editable in index.css.

 * @status incomplete 
   As of now, ui done. Not linked to database.

 * @todo connect verification buttons to database. (If database support for verification status is available.)
   
 */
function ConfirmObservation() {
  return (
    <div className="flex flex-row gap-4">
      <Button
        size="custom"
        variant="confirm"
        className="flex flex-1 flex-col rounded-sm border py-4"
      >
        <div className="flex flex-col items-center gap-1">
          <CircleCheckIcon className="basis-1/2" />
          <p className="basis-1/2 font-semibold"> CONFIRM ID</p>
          {/*Placeholder value*/}
        </div>
      </Button>
      <Button
        size="custom"
        variant="uncertain"
        className="flex flex-1 flex-col rounded-sm border py-4"
      >
        <div className="flex flex-col items-center gap-1">
          <CircleAlertIcon className="basis-1/2" />
          <p className="basis-1/2 font-semibold"> UNCERTAIN</p>
          {/*Placeholder value*/}
        </div>
      </Button>
      <Button
        size="custom"
        variant="destructive"
        className="flex flex-1 flex-col rounded-sm border py-4"
      >
        <div className="flex flex-col items-center gap-1">
          <CircleXIcon className="basis-1/2" />
          <p className="basis-1/2 font-semibold"> REJECT ID</p>
          {/*Placeholder value*/}
        </div>
      </Button>
    </div>
  );
}

export { ConfirmObservation };
