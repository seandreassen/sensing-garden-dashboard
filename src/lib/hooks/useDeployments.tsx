import { useQuery } from "@tanstack/react-query";

import type { Deployment } from "@/lib/types/api";

// Bytt ut med ekte API-kall når backend er klar, dette er bare for å mocke dataen, jeg antar at deployments kommer til å ha en active field i databasen
const mockDeployments: Deployment[] = [
  { id: "deploy-alpha-001", active: true },
  { id: "deploy-beta-002", active: true },
  { id: "deploy-gamma-003", active: true },
  { id: "deploy-delta-004", active: true },
  { id: "deploy-epsilon-005", active: true },
  { id: "deploy-zeta-006", active: true },
  { id: "deploy-eta-007", active: false },
  { id: "deploy-theta-008", active: false },
  { id: "deploy-iota-009", active: false },
  { id: "deploy-kappa-010", active: false },
];

function useDeployments() {
  return useQuery({
    queryKey: ["deployments"],
    queryFn: async () => mockDeployments,
  });
}

export { useDeployments };
