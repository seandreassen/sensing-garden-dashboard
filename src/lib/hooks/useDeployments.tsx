import { useQuery } from "@tanstack/react-query";

import type { Deployment } from "@/lib/types/api";

// Bytt ut med ekte API-kall når backend er klar, dette er bare for å mocke dataen, jeg antar at deployments kommer til å ha en active field i databasen
const mockDeployments: Deployment[] = [
  {
    deploymentId: "deploy-alpha-001",
    name: "Alpha",
    active: true,
    startDate: new Date("2026-02-20T10:15:00Z"),
    endDate: null,
    location: "Oslo",
    modelId: "test-model-security-auth",
  },
  {
    deploymentId: "deploy-beta-002",
    name: "Beta",
    active: true,
    startDate: new Date("2026-02-21T14:30:00Z"),
    endDate: null,
    location: "Bergen",
    modelId: "test-model-security-auth",
  },
  {
    deploymentId: "deploy-gamma-003",
    name: "Gamma",
    active: true,
    startDate: new Date("2026-02-22T08:45:00Z"),
    endDate: null,
    location: "Trondheim",
    modelId: "test-model-security-auth",
  },
  {
    deploymentId: "deploy-delta-004",
    name: "Delta",
    active: true,
    startDate: new Date("2026-02-23T12:00:00Z"),
    endDate: null,
    location: "Stavanger",
    modelId: "test-model-security-auth",
  },
  {
    deploymentId: "deploy-epsilon-005",
    name: "Epsilon",
    active: true,
    startDate: new Date("2026-02-24T09:20:00Z"),
    endDate: null,
    location: "Tromsø",
    modelId: "test-model-security-auth",
  },
  {
    deploymentId: "deploy-zeta-006",
    name: "Zeta",
    active: true,
    startDate: new Date("2026-02-25T16:10:00Z"),
    endDate: null,
    location: "Kristiansand",
    modelId: "test-model-security-auth",
  },
  {
    deploymentId: "deploy-eta-007",
    name: "Eta",
    active: false,
    startDate: new Date("2026-02-26T11:05:00Z"),
    endDate: new Date("2026-02-26T11:05:00Z"),
    location: "Drammen",
    modelId: "test-model-security-auth",
  },
  {
    deploymentId: "deploy-theta-008",
    name: "Theta",
    active: false,
    startDate: new Date("2026-02-27T07:50:00Z"),
    endDate: new Date("2026-02-26T11:05:00Z"),
    location: "Ålesund",
    modelId: "test-model-security-auth",
  },
  {
    deploymentId: "deploy-iota-009",
    name: "Iota",
    active: false,
    startDate: new Date("2026-02-28T13:40:00Z"),
    endDate: new Date("2026-02-26T11:05:00Z"),
    location: "Bodø",
    modelId: "test-model-security-auth",
  },
  {
    deploymentId: "deploy-kappa-010",
    name: "Kappa",
    active: false,
    startDate: new Date("2026-03-01T18:25:00Z"),
    endDate: new Date("2026-03-01T18:25:00Z"),
    location: "Haugesund",
    modelId: "test-model-security-auth",
  },
  {
    deploymentId: "deploy-alpha-001",
    name: "Alpha",
    active: true,
    startDate: new Date("2026-02-20T10:15:00Z"),
    endDate: null,
    location: "Oslo",
    modelId: "test-model-security-auth",
  },
];

function useDeployments() {
  return useQuery({
    queryKey: ["deployments"],
    queryFn: async () => mockDeployments,
  });
}

export { useDeployments };
