import { RadioIcon } from "lucide-react";

import { HubStatusCard } from "@/components/overview/HubStatusCard";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Separator } from "@/components/ui/Separator";
import { Spinner } from "@/components/ui/Spinner";
import { useDeployment } from "@/lib/hooks/useDeployment";

interface HubsDialogContentProps {
  deploymentId: string;
  className?: string;
}

function HubsDialogContent({ deploymentId }: HubsDialogContentProps) {
  const { data, isLoading } = useDeployment({
    deployment_id: deploymentId,
  });

  return (
    <DialogContent>
      <DialogHeader className="flex flex-row items-center gap-3">
        <RadioIcon className="size-6 text-primary" />
        <div className="flex flex-col gap-1">
          <DialogTitle className="font-bold">Hubs</DialogTitle>
          <DialogDescription>Network status for devices</DialogDescription>
        </div>
      </DialogHeader>
      <Separator />
      <div className="flex h-108 flex-col overflow-auto">
        {isLoading ? (
          <div className="flex size-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-2">
            {data?.devices.map((hub) => (
              <HubStatusCard key={hub.device_id} deploymentId={deploymentId} hub={hub} />
            ))}
          </div>
        )}
      </div>
    </DialogContent>
  );
}

export { HubsDialogContent };
