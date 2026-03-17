import { useQuery } from "@tanstack/react-query";

import type { Deployment } from "@/lib/types/api";

// Bytt ut med ekte API-kall når backend er klar, dette er bare for å mocke dataen, jeg antar at deployments kommer til å ha en active field i databasen
const mockDeployments: Deployment[] = [
  {
    id: "DEP-2025-AMS-01",
    active: true,
    name: "Amsterdam North Canal",
    location: "Amsterdam, Netherlands",
    hub_count: 4,
    last_updated: "2 minutes ago",
  },
  {
    id: "DEP-2025-AMS-02",
    active: true,
    name: "Amsterdam Vondelpark",
    location: "Amsterdam, Netherlands",
    hub_count: 3,
    last_updated: "10 minutes ago",
  },
  {
    id: "DEP-2025-BOS-01",
    active: true,
    name: "Boston Harbor Commons",
    location: "Boston, MA, USA",
    hub_count: 5,
    last_updated: "1 hour ago",
  },
  {
    id: "DEP-2025-LDN-01",
    active: true,
    name: "London Kensington Gardens",
    location: "London, UK",
    hub_count: 6,
    last_updated: "5 minutes ago",
  },
  {
    id: "DEP-2025-NYC-01",
    active: false,
    name: "New York Central Park",
    location: "New York, NY, USA",
    hub_count: 8,
    last_updated: "3 hours ago",
  },
  {
    id: "DEP-2025-BER-01",
    active: false,
    name: "Berlin Tiergarten",
    location: "Berlin, Germany",
    hub_count: 2,
    last_updated: "1 day ago",
  },
];

function useDeployments() {
  return useQuery({
    queryKey: ["deployments"],
    queryFn: async () => mockDeployments,
  });
}

export { useDeployments };
