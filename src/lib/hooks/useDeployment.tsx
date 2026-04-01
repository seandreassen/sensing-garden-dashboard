import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";
import type { DeploymentResponse, GetDeploymentParameters } from "@/lib/types/api";

function useDeployment({ deployment_id }: GetDeploymentParameters) {
  return useQuery({
    queryKey: ["deployment", deployment_id],
    queryFn: async () => {
      const res = await fetch(`${env.VITE_API_BASE_URL}/deployments/${deployment_id}`, {
        headers: getHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch deployment: ${res.status} ${res.statusText}`);
      }

      const data = (await res.json()) as DeploymentResponse;
      return {
        ...data,
        deployment: {
          ...data.deployment,
          start_time: new Date(data.deployment.start_time),
          end_time: data.deployment.end_time ? new Date(data.deployment.end_time) : undefined,
        },
      } as DeploymentResponse;
    },
  });
}

export { useDeployment };
