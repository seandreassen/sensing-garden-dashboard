import { useQuery } from "@tanstack/react-query";

import type { Deployment } from "@/lib/types/api";

// Bytt ut med ekte API-kall når backend er klar, dette er bare for å mocke dataen, jeg antar at deployments kommer til å ha en active field i databasen
const mockDeployments: Deployment[] = [
  {
    deploymentId: "deploy-alpha-001",
    name: "Alpha",
    active: true,
    date: new Date("2026-02-20T10:15:00Z"),
    location: "Oslo",
  },
  {
    deploymentId: "deploy-beta-002",
    name: "Beta",
    active: true,
    date: new Date("2026-02-21T14:30:00Z"),
    location: "Bergen",
  },
  {
    deploymentId: "deploy-gamma-003",
    name: "Gamma",
    active: true,
    date: new Date("2026-02-22T08:45:00Z"),
    location: "Trondheim",
  },
  {
    deploymentId: "deploy-delta-004",
    name: "Delta",
    active: true,
    date: new Date("2026-02-23T12:00:00Z"),
    location: "Stavanger",
  },
  {
    deploymentId: "deploy-epsilon-005",
    name: "Epsilon",
    active: true,
    date: new Date("2026-02-24T09:20:00Z"),
    location: "Tromsø",
  },
  {
    deploymentId: "deploy-zeta-006",
    name: "Zeta",
    active: true,
    date: new Date("2026-02-25T16:10:00Z"),
    location: "Kristiansand",
  },
  {
    deploymentId: "deploy-eta-007",
    name: "Eta",
    active: false,
    date: new Date("2026-02-26T11:05:00Z"),
    location: "Drammen",
  },
  {
    deploymentId: "deploy-theta-008",
    name: "Theta",
    active: false,
    date: new Date("2026-02-27T07:50:00Z"),
    location: "Ålesund",
  },
  {
    deploymentId: "deploy-iota-009",
    name: "Iota",
    active: false,
    date: new Date("2026-02-28T13:40:00Z"),
    location: "Bodø",
  },
  {
    deploymentId: "deploy-kappa-010",
    name: "Kappa",
    active: false,
    date: new Date("2026-03-01T18:25:00Z"),
    location: "Haugesund",
  },
];

function useDeployments() {
  return useQuery({
    queryKey: ["deployments"],
    queryFn: async () => mockDeployments,
  });
}

export { useDeployments };
