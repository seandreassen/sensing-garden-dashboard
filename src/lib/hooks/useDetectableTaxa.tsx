import { useQuery } from "@tanstack/react-query";

import { env } from "@/env";
import type { GetDetectableTaxaParameters, DetectableTaxaResponse } from "@/lib/types/api";
import { getHeaders } from "@/lib/utils/headers";

function useDetectableTaxa({ model_id }: GetDetectableTaxaParameters) {
  return useQuery({
    queryKey: ["detectable-taxa", model_id],
    enabled: !!model_id,
    queryFn: async () => {
      const res = await fetch(`${env.VITE_API_BASE_URL}/models/${model_id}/taxonomy`, {
        headers: getHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch detectable taxa: ${res.status} ${res.statusText}`);
      }

      return (await res.json()) as DetectableTaxaResponse;
    },
  });
}

export { useDetectableTaxa };
