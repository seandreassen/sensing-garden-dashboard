import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";
import type { DeploymentDetail, DeploymentsResponse } from "@/lib/types/api";

function useDeployments() {
  return useQuery({
    queryKey: ["deployments"],
    queryFn: async () => {
      const res = await fetch(`${env.VITE_API_BASE_URL}/deployments?limit=100`, {
        headers: getHeaders(),
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch deployments: ${res.status}`);
      }
      const data = (await res.json()) as DeploymentsResponse;
      return data.deployments.map((deployment) => ({
        ...deployment,
        start_time: new Date(deployment.start_time as unknown as string),
        end_time: deployment.end_time
          ? new Date(deployment.end_time as unknown as string)
          : undefined,
      }));
    },
  });
}

function useDeployment(deploymentId: string) {
  return useQuery({
    queryKey: ["deployments", deploymentId],
    queryFn: async () => {
      const res = await fetch(`${env.VITE_API_BASE_URL}/deployments/${deploymentId}`, {
        headers: getHeaders(),
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch deployment: ${res.status}`);
      }
      const data = (await res.json()) as {
        deployment: Omit<DeploymentDetail, "devices">;
        devices: DeploymentDetail["devices"];
      };
      return { ...data.deployment, devices: data.devices };
    },
  });
}

export { useDeployments, useDeployment };
