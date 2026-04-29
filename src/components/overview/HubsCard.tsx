import { ChevronRightIcon, RadioIcon } from "lucide-react";

import { HubsCount } from "@/components/overview/HubsCount";
import { HubsDialogContent } from "@/components/overview/HubsDialogContent";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog, DialogTrigger } from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";

interface HubsCardProps {
  deploymentId: string;
}

function HubsCard({ deploymentId }: HubsCardProps) {
  return (
    <Dialog>
      <Card className="relative flex h-36 w-1/5 flex-col gap-3 overflow-visible">
        <DialogTrigger
          className={cn(
            buttonVariants({ variant: "none", size: "none" }),
            "peer absolute inset-0 rounded-[inherit]",
          )}
        />
        <CardHeader className="flex flex-col gap-3 peer-hover:[&_#highlight-on-select]:text-primary peer-focus-visible:[&_#highlight-on-select]:text-primary">
          <div className="flex w-full items-center justify-between">
            <RadioIcon className="size-5 text-primary" />
            <ChevronRightIcon id="highlight-on-select" className="size-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-sm text-muted-foreground uppercase">Active hubs</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <HubsCount deploymentId={deploymentId} />
        </CardContent>
      </Card>
      <HubsDialogContent deploymentId={deploymentId} />
    </Dialog>
  );
}

export { HubsCard };
