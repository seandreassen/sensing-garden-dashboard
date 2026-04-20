import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { EditDateRangeCard } from "@/components/deploymentEditor/EditDateRangeCard";
import { EditDescriptionCard } from "@/components/deploymentEditor/EditDescriptionCard";
import { EditDevicesMapCard } from "@/components/deploymentEditor/EditDevicesMapCard";
import { EditImageCard } from "@/components/deploymentEditor/EditImageCard";
import { EditNameCard } from "@/components/deploymentEditor/EditNameCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useDeployment } from "@/lib/hooks/useDeployment";
import { useDeploymentMutations, useDeleteDeployment } from "@/lib/hooks/useDeploymentMutations";
import type {
  Deployment,
  DeploymentDevice,
  GetSelectedDeploymentParameters,
} from "@/lib/types/api";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { deploymentId } = Route.useParams();
  const { data, isLoading } = useDeployment({
    deployment_id: deploymentId,
  } as GetSelectedDeploymentParameters);

  if (isLoading || !data?.deployment) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <EditPage deploymentId={deploymentId} deployment={data.deployment} devices={data.devices} />
  );
}

function EditPage({
  deploymentId,
  deployment,
  devices: initialDevices,
}: {
  deploymentId: string;
  deployment: Deployment;
  devices: DeploymentDevice[];
}) {
  const { saveDeployment, isSaving } = useDeploymentMutations(deploymentId);
  const deleteDeployment = useDeleteDeployment();
  const navigate = useNavigate();

  const [name, setName] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | null | undefined>();
  const [image, setImage] = useState<string | undefined>();
  const [devices, setDevices] = useState<DeploymentDevice[] | undefined>();

  function handleDelete() {
    deleteDeployment.mutate(deploymentId, {
      onSuccess: () => void navigate({ to: "/" }),
    });
  }

  function handleSave() {
    saveDeployment({
      name,
      description,
      startDate,
      endDate,
      image,
      devices: devices ?? initialDevices,
      initialDevices,
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end gap-2">
        <Button variant="destructive" onClick={handleDelete} disabled={deleteDeployment.isPending}>
          {deleteDeployment.isPending ? "Deleting…" : "Delete"}
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save"}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="flex h-full flex-col gap-5">
          <EditNameCard initialValue={deployment.name ?? ""} onChange={setName} />
          <EditDateRangeCard
            initialStartDate={
              deployment.start_time ? deployment.start_time.toISOString().split("T")[0] : ""
            }
            initialEndDate={
              deployment.end_time ? deployment.end_time.toISOString().split("T")[0] : ""
            }
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
          <EditDescriptionCard
            initialValue={deployment.description ?? ""}
            onChange={setDescription}
          />
        </div>
        <div className="flex h-full flex-col gap-5">
          <EditImageCard initialUrl={deployment.image_url ?? ""} onChange={setImage} />
        </div>
        <div className="flex h-full flex-col gap-5">
          <EditDevicesMapCard initialDevices={initialDevices} onChange={setDevices} />
        </div>
      </div>
    </div>
  );
}
