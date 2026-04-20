import { useMutation, useQueryClient } from "@tanstack/react-query";

import { env } from "@/env";
import type {
  Deployment,
  CreateDeploymentBody,
  UpdateDeploymentBody,
  SaveDeploymentArgs,
} from "@/lib/types/api";
import { getHeaders } from "@/lib/utils/headers";

const JSON_HEADERS = { ...getHeaders(), "Content-Type": "application/json" };

// --- Deployment mutations ---

function useCreateDeployment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateDeploymentBody) => {
      const res = await fetch(`${env.VITE_API_BASE_URL}/deployments`, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`Failed to create deployment: ${res.status}`);
      }
      const data = (await res.json()) as { deployment: Deployment };
      return data.deployment;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["deployments"] }),
  });
}

function useUpdateDeployment(deploymentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateDeploymentBody) => {
      const res = await fetch(`${env.VITE_API_BASE_URL}/deployments/${deploymentId}`, {
        method: "PATCH",
        headers: JSON_HEADERS,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`Failed to update deployment: ${res.status}`);
      }
      return (await res.json()) as Deployment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments"] });
      queryClient.invalidateQueries({ queryKey: ["deployments", deploymentId] });
    },
  });
}

function useDeleteDeployment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deploymentId: string) => {
      const res = await fetch(`${env.VITE_API_BASE_URL}/deployments/${deploymentId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) {
        throw new Error(`Failed to delete deployment: ${res.status}`);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["deployments"] }),
  });
}

// --- Combined save hook for the edit page ---

function useDeploymentMutations(deploymentId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      name,
      description,
      startDate,
      endDate,
      image,
      devices,
      initialDevices,
    }: SaveDeploymentArgs) => {
      const deploymentPatch: UpdateDeploymentBody = {};
      if (name !== undefined) {
        deploymentPatch.name = name;
      }
      if (description !== undefined) {
        deploymentPatch.description = description;
      }
      if (startDate !== undefined) {
        deploymentPatch.start_time = startDate;
      }
      if (endDate !== undefined) {
        deploymentPatch.end_time = endDate;
      }
      if (image !== undefined) {
        deploymentPatch.image = image.includes(",") ? image.split(",")[1] : image;
      }

      const mutationRequests: Promise<Response>[] = [];

      if (Object.keys(deploymentPatch).length > 0) {
        mutationRequests.push(
          fetch(`${env.VITE_API_BASE_URL}/deployments/${deploymentId}`, {
            method: "PATCH",
            headers: JSON_HEADERS,
            body: JSON.stringify(deploymentPatch),
          }),
        );
      }

      const initialIds = new Set(initialDevices.map((d) => d.device_id));
      const currentIds = new Set(devices.map((d) => d.device_id));

      for (const device of devices) {
        if (!initialIds.has(device.device_id)) {
          mutationRequests.push(
            fetch(`${env.VITE_API_BASE_URL}/deployments/${deploymentId}/devices`, {
              method: "POST",
              headers: JSON_HEADERS,
              body: JSON.stringify({
                device_id: device.device_id,
                name: device.name,
                location: device.location,
              }),
            }),
          );
        } else {
          const initial = initialDevices.find((d) => d.device_id === device.device_id);
          if (
            initial &&
            (device.name !== initial.name ||
              JSON.stringify(device.location) !== JSON.stringify(initial.location))
          ) {
            mutationRequests.push(
              fetch(
                `${env.VITE_API_BASE_URL}/deployments/${deploymentId}/devices/${device.device_id}`,
                {
                  method: "PATCH",
                  headers: JSON_HEADERS,
                  body: JSON.stringify({ name: device.name, location: device.location }),
                },
              ),
            );
          }
        }
      }

      for (const initial of initialDevices) {
        if (!currentIds.has(initial.device_id)) {
          mutationRequests.push(
            fetch(
              `${env.VITE_API_BASE_URL}/deployments/${deploymentId}/devices/${initial.device_id}`,
              {
                method: "DELETE",
                headers: getHeaders(),
              },
            ),
          );
        }
      }

      await Promise.all(mutationRequests);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments"] });
      queryClient.invalidateQueries({ queryKey: ["deployment", deploymentId] });
    },
  });

  return {
    saveDeployment: mutation.mutate,
    isSaving: mutation.isPending,
  };
}

export { useCreateDeployment, useUpdateDeployment, useDeleteDeployment, useDeploymentMutations };
