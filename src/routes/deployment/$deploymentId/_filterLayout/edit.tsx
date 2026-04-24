import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { EditDateRangeCard } from "@/components/deploymentEditor/EditDateRangeCard";
import { EditDescriptionCard } from "@/components/deploymentEditor/EditDescriptionCard";
import { EditDevicesMapCard } from "@/components/deploymentEditor/EditDevicesMapCard";
import { EditImageCard } from "@/components/deploymentEditor/EditImageCard";
import { EditNameCard } from "@/components/deploymentEditor/EditNameCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useDeployment } from "@/lib/hooks/useDeployment";
import { useDeploymentMutations, useDeleteDeployment } from "@/lib/hooks/useDeploymentMutations";
import { useDevices } from "@/lib/hooks/useDevices";
import type {
  Deployment,
  DeploymentDevice,
  GetSelectedDeploymentParameters,
  Device,
} from "@/lib/types/api";

export const Route = createFileRoute("/deployment/$deploymentId/_filterLayout/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { deploymentId } = Route.useParams();
  const { data, isLoading } = useDeployment({
    deployment_id: deploymentId,
  } as GetSelectedDeploymentParameters);

  const { data: devicesData } = useDevices();

  if (isLoading || !data?.deployment) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <EditPage
      deploymentId={deploymentId}
      deployment={data.deployment}
      devices={data.devices}
      availableDevices={devicesData ?? []}
    />
  );
}

function EditPage({
  deploymentId,
  deployment,
  devices: initialDevices,
  availableDevices,
}: {
  deploymentId: string;
  deployment: Deployment;
  devices: DeploymentDevice[];
  availableDevices: Device[];
}) {
  const schema = z
    .object({
      name: z.string().optional(),
      description: z.string().optional(),
      startDate: z.iso.date().optional(),
      endDate: z.iso.date().nullable().optional(),
      image: z.url().optional(),
      devices: z.array(z.custom<DeploymentDevice>()).optional(),
    })
    .refine(
      ({ startDate, endDate }) => {
        if (!startDate || !endDate) {
          return true;
        }
        return new Date(endDate) > new Date(startDate);
      },
      { message: "End date must come after start date", path: ["endDate"] },
    );

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
      onSuccess: () => {
        void navigate({ to: "/" });
        toast.success("Deployment deleted successfully", { position: "top-center" });
      },
      onError: (error: Error) => {
        toast.error("Failed to delete deployment", {
          position: "top-center",
          description: error.message,
        });
      },
    });
  }

  const values = [name, description, startDate, endDate, image, devices];
  const isDirty = values.some((value) => value !== undefined);

  function handleSave() {
    const hasChanges =
      name !== undefined ||
      description !== undefined ||
      startDate !== undefined ||
      endDate !== undefined ||
      image !== undefined ||
      devices !== undefined;
    if (!hasChanges) {
      toast.warning(<p className="font-bold">Changes not made:</p>, {
        position: "top-center",
        description: "No changes found",
      });
      return;
    }
    const result = schema.safeParse({
      name,
      description,
      startDate,
      endDate,
      image,
      devices,
    });
    for (const setValue of [
      setName,
      setDescription,
      setStartDate,
      setEndDate,
      setImage,
      setDevices,
    ]) {
      setValue(undefined);
    }

    if (result.success === false) {
      const errors = z.flattenError(result.error).fieldErrors;
      const formattedErrors = Object.entries(errors).map(([key, value]) => (
        <p key={key}>
          {key} : {value}
        </p>
      ));
      toast.warning(<p className="font-bold">Changes not made, check inputs:</p>, {
        position: "top-center",
        description: formattedErrors,
      });
      return;
    }
    /*Undefined fields will be ignored in useDeploymentMutations hook.*/
    saveDeployment(
      {
        name,
        description,
        startDate,
        endDate,
        image,
        devices: devices ?? initialDevices,
        initialDevices,
      },
      {
        onSuccess: () => {
          toast.success("Deployment updated successfully", { position: "top-center" });
        },
        onError: (error: Error) => {
          toast.error("Failed to upload changes", {
            position: "top-center",
            description: error.message,
          });
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end gap-2">
        <Button variant="destructive" onClick={handleDelete} disabled={deleteDeployment.isPending}>
          {deleteDeployment.isPending ? "Deleting…" : "Delete"}
        </Button>
        <Button onClick={handleSave} disabled={isSaving || !isDirty}>
          {isSaving ? "Saving…" : "Save"}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="flex h-full flex-col gap-5">
          <EditNameCard initialValue={deployment.name ?? ""} onChange={setName} />
          <EditDateRangeCard
            initialStartDate={
              !isNaN(deployment.start_time.getTime())
                ? deployment.start_time.toISOString().split("T")[0]
                : ""
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
          <EditDevicesMapCard
            initialDevices={initialDevices}
            availableDevices={availableDevices}
            onChange={setDevices}
          />
        </div>
      </div>
    </div>
  );
}
