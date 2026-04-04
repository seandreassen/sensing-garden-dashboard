import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import { getHeaders } from "@/lib/headers";
import { addQueryParameters } from "@/lib/queryParameters";
import type { DeploymentsResponse, GetDeploymentsParameters } from "@/lib/types/api";

function useDeployments(queryParameters?: GetDeploymentsParameters) {
  return useQuery({
    queryKey: ["deployments", queryParameters],
    queryFn: async () => {
      const params = new URLSearchParams();

      addQueryParameters(params, queryParameters);

      const res = await fetch(`${env.VITE_API_BASE_URL}/deployments?${params.toString()}`, {
        headers: getHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch deployments: ${res.status} ${res.statusText}`);
      }

      const data = (await res.json()) as DeploymentsResponse;
      return {
        ...data,
        deployments: data.deployments.map((deployment) => ({
          ...deployment,
          start_time: new Date(deployment.start_time),
          end_time: deployment.end_time ? new Date(deployment.end_time) : undefined,
        })),
      } as DeploymentsResponse;
    },
  });
}

export { useDeployments };
