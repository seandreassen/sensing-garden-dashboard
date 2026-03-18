import { useQuery } from "@tanstack/react-query";

import type { Deployment } from "@/lib/types/api";

// Bytt ut med ekte API-kall når backend er klar, dette er bare for å mocke dataen, jeg antar at deployments kommer til å ha en active field i databasen
const mockDeployments: Deployment[] = [
  { id: "deploy-alpha-001", active: true, location: { lat: 59.9139, lng: 10.7522 } },
  { id: "deploy-beta-002", active: true, location: { lat: 60.3913, lng: 5.3221 } },
  { id: "deploy-gamma-003", active: true, location: { lat: 63.4305, lng: 10.3951 } },
  { id: "deploy-delta-004", active: true, location: { lat: 58.9701, lng: 5.7331 } },
  { id: "deploy-epsilon-005", active: true, location: { lat: 69.6496, lng: 18.9553 } },
  { id: "deploy-zeta-006", active: true, location: { lat: 62.4722, lng: 6.1495 } },
  { id: "deploy-eta-007", active: false, location: { lat: 59.2671, lng: 10.4075 } },
  { id: "deploy-theta-008", active: false, location: { lat: 60.7945, lng: 11.0678 } },
  { id: "deploy-iota-009", active: false, location: { lat: 59.7439, lng: 10.2045 } },
  { id: "deploy-kappa-010", active: false, location: { lat: 70.6634, lng: 23.6821 } },
];

type Coordinate = { lat: number; lng: number };

const mockCoordinates: Record<string, Coordinate[]> = {
  "deploy-alpha-001": [
    { lat: 59.9139, lng: 10.7522 },
    { lat: 59.9175, lng: 10.7276 },
    { lat: 59.9049, lng: 10.7449 },
    { lat: 59.9227, lng: 10.7683 },
  ],
  "deploy-beta-002": [
    { lat: 60.3913, lng: 5.3221 },
    { lat: 60.3853, lng: 5.3317 },
    { lat: 60.3976, lng: 5.3089 },
    { lat: 60.4001, lng: 5.3456 },
    { lat: 60.3801, lng: 5.2987 },
  ],
  "deploy-gamma-003": [
    { lat: 63.4305, lng: 10.3951 },
    { lat: 63.4248, lng: 10.4102 },
    { lat: 63.4361, lng: 10.3812 },
    { lat: 63.4189, lng: 10.4233 },
  ],
  "deploy-delta-004": [
    { lat: 58.9701, lng: 5.7331 },
    { lat: 58.9756, lng: 5.7512 },
    { lat: 58.9634, lng: 5.7189 },
    { lat: 58.9812, lng: 5.7634 },
    { lat: 58.9589, lng: 5.7423 },
  ],
  "deploy-epsilon-005": [
    { lat: 69.6496, lng: 18.9553 },
    { lat: 69.6543, lng: 18.9712 },
    { lat: 69.6412, lng: 18.9389 },
    { lat: 69.6578, lng: 18.9234 },
  ],
  "deploy-zeta-006": [
    { lat: 62.4722, lng: 6.1495 },
    { lat: 62.4789, lng: 6.1634 },
    { lat: 62.4658, lng: 6.1312 },
    { lat: 62.4823, lng: 6.1178 },
    { lat: 62.4601, lng: 6.1567 },
  ],
  "deploy-eta-007": [
    { lat: 59.2671, lng: 10.4075 },
    { lat: 59.2734, lng: 10.4212 },
    { lat: 59.2598, lng: 10.3934 },
    { lat: 59.2812, lng: 10.4356 },
  ],
  "deploy-theta-008": [
    { lat: 60.7945, lng: 11.0678 },
    { lat: 60.8012, lng: 11.0823 },
    { lat: 60.7878, lng: 11.0534 },
    { lat: 60.8067, lng: 11.0412 },
    { lat: 60.7823, lng: 11.0912 },
  ],
  "deploy-iota-009": [
    { lat: 59.7439, lng: 10.2045 },
    { lat: 59.7501, lng: 10.2189 },
    { lat: 59.7378, lng: 10.1912 },
    { lat: 59.7556, lng: 10.2312 },
  ],
  "deploy-kappa-010": [
    { lat: 70.6634, lng: 23.6821 },
    { lat: 70.6698, lng: 23.6978 },
    { lat: 70.6567, lng: 23.6645 },
    { lat: 70.6734, lng: 23.7112 },
    { lat: 70.6512, lng: 23.7234 },
  ],
};

function useDeployments() {
  return useQuery({
    queryKey: ["deployments"],
    queryFn: async () => mockDeployments,
  });
}

function useDeploymentCoordinates(deploymentId: string): Coordinate[] {
  return mockCoordinates[deploymentId] ?? [];
}

function useDeploymentCenter(deploymentId: string): Coordinate | undefined {
  return mockDeployments.find((d) => d.id === deploymentId)?.location;
}

export { useDeployments, useDeploymentCoordinates, useDeploymentCenter };
export type { Coordinate };
