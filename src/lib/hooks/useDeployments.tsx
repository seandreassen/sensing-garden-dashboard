import { useQuery } from "@tanstack/react-query";

import type { Deployment } from "@/lib/types/api";

// Bytt ut med ekte API-kall når backend er klar, dette er bare for å mocke dataen, jeg antar at deployments kommer til å ha en active field i databasen
const mockDeployments: Deployment[] = [
  { deploymentId: "deploy-alpha-001", active: true },
  { deploymentId: "deploy-beta-002", active: true },
  { deploymentId: "deploy-gamma-003", active: true },
  { deploymentId: "deploy-delta-004", active: true },
  { deploymentId: "deploy-epsilon-005", active: true },
  { deploymentId: "deploy-zeta-006", active: true },
  { deploymentId: "deploy-eta-007", active: false },
  { deploymentId: "deploy-theta-008", active: false },
  { deploymentId: "deploy-iota-009", active: false },
  { deploymentId: "deploy-kappa-010", active: false },
];

function useDeployments() {
  return useQuery({
    queryKey: ["deployments"],
    queryFn: async () => mockDeployments,
  });
}

export { useDeployments };
