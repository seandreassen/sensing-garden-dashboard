import { useQuery } from "@tanstack/react-query";

import type { Deployment, Location } from "@/lib/types/api";

// Bytt ut med ekte API-kall når backend er klar, dette er bare for å mocke dataen, jeg antar at deployments kommer til å ha en active field i databasen
const mockDeployments: Deployment[] = [
  {
    id: "deploy-alpha-001",
    active: true,
    location: { lat: 59.9131, lng: 10.7521 },
    name: "Amsterdam North Canal",
    place: "Amsterdam, Netherlands",
    hub_count: 4,
    last_updated: "2 minutes ago",
  },
  {
    id: "deploy-beta-002",
    active: true,
    location: { lat: 60.3913, lng: 5.3221 },
    name: "Amsterdam Vondelpark",
    place: "Amsterdam, Netherlands",
    hub_count: 3,
    last_updated: "10 minutes ago",
  },
  {
    id: "deploy-gamma-003",
    active: true,
    location: { lat: 63.4305, lng: 10.3951 },
    name: "Boston Harbor Commons",
    place: "Boston, MA, USA",
    hub_count: 5,
    last_updated: "1 hour ago",
  },
  {
    id: "deploy-delta-004",
    active: true,
    location: { lat: 58.9701, lng: 5.7331 },
    name: "London Kensington Gardens",
    place: "London, UK",
    hub_count: 6,
    last_updated: "5 minutes ago",
  },
  {
    id: "deploy-epsilon-005",
    active: true,
    location: { lat: 69.6496, lng: 18.9553 },
    name: "New York Central Park",
    place: "New York, NY, USA",
    hub_count: 8,
    last_updated: "3 hours ago",
  },
  {
    id: "deploy-zeta-006",
    active: true,
    location: { lat: 62.4722, lng: 6.1495 },
    name: "Berlin Tiergarten",
    place: "Berlin, Germany",
    hub_count: 2,
    last_updated: "1 day ago",
  },
  {
    id: "deploy-theta-008",
    active: false,
    location: { lat: 60.7945, lng: 11.0678 },
  },
  {
    id: "deploy-iota-009",
    active: false,
    location: { lat: 59.7439, lng: 10.2045 },
  },
  {
    id: "deploy-kappa-010",
    active: false,
    location: { lat: 70.6634, lng: 23.6821 },
  },
];

const mockCoordinates: Record<string, Location[]> = {
  "deploy-alpha-001": [
    { lat: 59.9131, long: 10.7521 },
    { lat: 59.9132, long: 10.7522 },
    { lat: 59.9132, long: 10.7523 },
    { lat: 59.9133, long: 10.7524 },
  ],
  "deploy-beta-002": [
    { lat: 60.3913, long: 5.3221 },
    { lat: 60.3853, long: 5.3317 },
    { lat: 60.3976, long: 5.3089 },
    { lat: 60.4001, long: 5.3456 },
    { lat: 60.3801, long: 5.2987 },
  ],
  "deploy-gamma-003": [
    { lat: 63.4305, long: 10.3951 },
    { lat: 63.4248, long: 10.4102 },
    { lat: 63.4361, long: 10.3812 },
    { lat: 63.4189, long: 10.4233 },
  ],
  "deploy-delta-004": [
    { lat: 58.9701, long: 5.7331 },
    { lat: 58.9756, long: 5.7512 },
    { lat: 58.9634, long: 5.7189 },
    { lat: 58.9812, long: 5.7634 },
    { lat: 58.9589, long: 5.7423 },
  ],
  "deploy-epsilon-005": [
    { lat: 69.6496, long: 18.9553 },
    { lat: 69.6543, long: 18.9712 },
    { lat: 69.6412, long: 18.9389 },
    { lat: 69.6578, long: 18.9234 },
  ],
  "deploy-zeta-006": [
    { lat: 62.4722, long: 6.1495 },
    { lat: 62.4789, long: 6.1634 },
    { lat: 62.4658, long: 6.1312 },
    { lat: 62.4823, long: 6.1178 },
    { lat: 62.4601, long: 6.1567 },
  ],
  "deploy-eta-007": [
    { lat: 59.2671, long: 10.4075 },
    { lat: 59.2734, long: 10.4212 },
    { lat: 59.2598, long: 10.3934 },
    { lat: 59.2812, long: 10.4356 },
  ],
  "deploy-theta-008": [
    { lat: 60.7945, long: 11.0678 },
    { lat: 60.8012, long: 11.0823 },
    { lat: 60.7878, long: 11.0534 },
    { lat: 60.8067, long: 11.0412 },
    { lat: 60.7823, long: 11.0912 },
  ],
  "deploy-iota-009": [
    { lat: 59.7439, long: 10.2045 },
    { lat: 59.7501, long: 10.2189 },
    { lat: 59.7378, long: 10.1912 },
    { lat: 59.7556, long: 10.2312 },
  ],
  "deploy-kappa-010": [
    { lat: 70.6634, long: 23.6821 },
    { lat: 70.6698, long: 23.6978 },
    { lat: 70.6567, long: 23.6645 },
    { lat: 70.6734, long: 23.7112 },
    { lat: 70.6512, long: 23.7234 },
  ],
};

function useDeployments() {
  return useQuery({
    queryKey: ["deployments"],
    queryFn: async () => mockDeployments,
  });
}

function useDeploymentCoordinates(deploymentId: string): Location[] {
  return mockCoordinates[deploymentId] ?? [];
}

function useDeploymentCenter(deploymentId: string): Location | undefined {
  const loc = mockDeployments.find((d) => d.id === deploymentId)?.location;
  if (!loc) {
    return undefined;
  }
  return { lat: loc.lat, long: loc.lng };
}

export { useDeployments, useDeploymentCoordinates, useDeploymentCenter };
