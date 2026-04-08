import { useMutation, useQueryClient } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";
import type { Deployment, DeploymentDevice } from "@/lib/types/api";

const JSON_HEADERS = { ...getHeaders(), "Content-Type": "application/json" };

// --- Deployment mutations ---

interface CreateDeploymentBody {
  name?: string;
  description?: string;
  deployment_id?: string;
  start_time?: string;
  end_time?: string;
  model_id?: string;
  location_name?: string;
  location?: { lat: number; long: number };
  image?: string;
}

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
      return (await res.json()) as Deployment;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["deployments"] }),
  });
}

type UpdateDeploymentBody = Omit<CreateDeploymentBody, "deployment_id">;

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

// --- Deployment-device link mutations ---

interface LinkDeviceBody {
  device_id: string;
  name?: string;
  location?: { lat: number; long: number };
}

function useLinkDevice(deploymentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: LinkDeviceBody) => {
      const res = await fetch(`${env.VITE_API_BASE_URL}/deployments/${deploymentId}/devices`, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`Failed to link device: ${res.status}`);
      }
      return (await res.json()) as DeploymentDevice;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["deployments", deploymentId] }),
  });
}

interface UpdateDeviceLinkBody {
  name?: string;
  location?: { lat: number; long: number };
}

function useUpdateDeviceLink(deploymentId: string, deviceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateDeviceLinkBody) => {
      const res = await fetch(
        `${env.VITE_API_BASE_URL}/deployments/${deploymentId}/devices/${deviceId}`,
        { method: "PATCH", headers: JSON_HEADERS, body: JSON.stringify(body) },
      );
      if (!res.ok) {
        throw new Error(`Failed to update device link: ${res.status}`);
      }
      return (await res.json()) as DeploymentDevice;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["deployments", deploymentId] }),
  });
}

function useDeleteDeviceLink(deploymentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deviceId: string) => {
      const res = await fetch(
        `${env.VITE_API_BASE_URL}/deployments/${deploymentId}/devices/${deviceId}`,
        { method: "DELETE", headers: getHeaders() },
      );
      if (!res.ok) {
        throw new Error(`Failed to delete device link: ${res.status}`);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["deployments", deploymentId] }),
  });
}

// --- Combined save hook for the edit page ---

interface SaveDeploymentArgs {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string | null;
  image?: string;
  devices: Array<{ device_id: string; name: string; location?: { lat: number; long: number } }>;
  initialDevices: Array<{
    device_id: string;
    name: string;
    location?: { lat: number; long: number };
  }>;
}

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
        deploymentPatch.end_time = endDate ?? undefined;
      }
      if (image !== undefined) {
        deploymentPatch.image = image;
      }

      const ops: Promise<unknown>[] = [];

      if (Object.keys(deploymentPatch).length > 0) {
        ops.push(
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
          ops.push(
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
            ops.push(
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
          ops.push(
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

      await Promise.all(ops);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments"] });
      queryClient.invalidateQueries({ queryKey: ["deployments", deploymentId] });
    },
  });

  return {
    saveDeployment: mutation.mutate,
    isSaving: mutation.isPending,
  };
}

export {
  useCreateDeployment,
  useUpdateDeployment,
  useDeleteDeployment,
  useLinkDevice,
  useUpdateDeviceLink,
  useDeleteDeviceLink,
  useDeploymentMutations,
};
