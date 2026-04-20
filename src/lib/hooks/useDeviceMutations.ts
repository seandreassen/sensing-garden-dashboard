import { useMutation, useQueryClient } from "@tanstack/react-query";

import { env } from "@/env";
import type { DeploymentDevice, UpdateDeploymentDevice } from "@/lib/types/api";
import { getHeaders } from "@/lib/utils/headers";

const JSON_HEADERS = { ...getHeaders(), "Content-Type": "application/json" };

// --- Deployment-device link mutations ---

function useLinkDevice(deploymentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: DeploymentDevice) => {
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

function useUpdateDeviceLink(deploymentId: string, deviceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateDeploymentDevice) => {
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

export { useLinkDevice, useUpdateDeviceLink, useDeleteDeviceLink };
