import { renderWithRootProviders } from "@tests/render";
import type { ReactNode } from "react";
import { beforeEach, expect, test, vi } from "vitest";

import { GoogleMapsCard } from "@/components/map/GoogleMapsCard";

const { mockMap, mocks } = vi.hoisted(() => ({
  mockMap: { getProjection: () => null, getBounds: () => null, getZoom: () => 11 },
  mocks: {
    useDeployment: vi.fn(),
    useParams: vi.fn(),
    apiKey: "test-key" as string | undefined,
  },
}));

vi.mock("@vis.gl/react-google-maps", () => ({
  APIProvider: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Map: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AdvancedMarker: ({
    children,
    position,
  }: {
    children?: ReactNode;
    position: { lat: number; lng: number };
  }) => (
    <div data-testid="marker" data-lat={position.lat} data-lng={position.lng}>
      {children}
    </div>
  ),
  useMap: () => mockMap,
  Pin: () => null,
}));

vi.mock("@/env", () => ({
  env: {
    get VITE_GOOGLE_MAPS_API_KEY() {
      return mocks.apiKey;
    },
  },
}));

vi.mock("@/lib/hooks/useDeployment", () => ({
  useDeployment: mocks.useDeployment,
}));

vi.mock("@/routes/deployment/$deploymentId/_filterLayout", () => ({
  Route: { useParams: mocks.useParams },
}));

vi.mock("@/components/ui/Separator", () => ({
  Separator: () => <div role="separator" />,
}));

// Two far-apart locations ensure minZoom=8, below DEFAULT_ZOOM=11, so individual markers render.
const OSLO = { lat: 59.91, long: 10.75 };
const BERGEN = { lat: 60.39, long: 5.32 };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.apiKey = "test-key";
  mocks.useParams.mockReturnValue({ deploymentId: "dep-123" });
  mocks.useDeployment.mockReturnValue({
    data: {
      deployment: { deployment_id: "dep-123", name: "Test deployment", start_time: new Date() },
      devices: [
        { device_id: "hub-1", name: "North hub", location: OSLO },
        { device_id: "hub-2", name: "South hub", location: BERGEN },
      ],
    },
    isLoading: false,
  });
});

test("shows loading state while deployment data is fetching", async () => {
  mocks.useDeployment.mockReturnValue({ data: undefined, isLoading: true });
  const { getByText } = await renderWithRootProviders(<GoogleMapsCard />);
  await expect.element(getByText("Loading map...")).toBeInTheDocument();
});

test("shows error when API key is not configured", async () => {
  mocks.apiKey = undefined;
  const { getByText } = await renderWithRootProviders(<GoogleMapsCard />);
  await expect.element(getByText("Missing VITE_GOOGLE_MAPS_API_KEY")).toBeInTheDocument();
});

test("renders a marker label for each device with a location", async () => {
  const { getByText } = await renderWithRootProviders(<GoogleMapsCard />);
  await expect.element(getByText("North hub")).toBeInTheDocument();
  await expect.element(getByText("South hub")).toBeInTheDocument();
});

test("uses device_id as label when device has no name", async () => {
  mocks.useDeployment.mockReturnValue({
    data: {
      deployment: { deployment_id: "dep-123", name: "Test", start_time: new Date() },
      devices: [
        { device_id: "hub-1", location: OSLO },
        { device_id: "hub-2", location: BERGEN },
      ],
    },
    isLoading: false,
  });
  const { getByText } = await renderWithRootProviders(<GoogleMapsCard />);
  await expect.element(getByText("hub-1")).toBeInTheDocument();
  await expect.element(getByText("hub-2")).toBeInTheDocument();
});

test("does not render a marker label for devices without a location", async () => {
  mocks.useDeployment.mockReturnValue({
    data: {
      deployment: { deployment_id: "dep-123", name: "Test", start_time: new Date() },
      devices: [
        { device_id: "hub-1", name: "Oslo hub", location: OSLO },
        { device_id: "hub-2", name: "Bergen hub", location: BERGEN },
        { device_id: "hub-3", name: "Unlocated hub" },
      ],
    },
    isLoading: false,
  });
  const { getByText } = await renderWithRootProviders(<GoogleMapsCard />);
  await expect.element(getByText("Oslo hub")).toBeInTheDocument();
  await expect.element(getByText("Unlocated hub")).not.toBeInTheDocument();
});
