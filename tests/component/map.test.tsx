import type { ReactNode } from "react";
import { beforeAll, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { MapWithDrop } from "@/components/map/MapWithDrop";

const { DROPPED_LAT, DROPPED_LNG, mockMap } = vi.hoisted(() => {
  const lat = 59.9;
  const lng = 10.7;
  const map = {
    getProjection: () => ({
      fromLatLngToPoint: () => ({ x: 128, y: 128 }),
      fromPointToLatLng: () => ({ lat: () => lat, lng: () => lng }),
    }),
    getBounds: () => ({
      getNorthEast: () => ({ lat: () => 60, lng: () => 11 }),
      getSouthWest: () => ({ lat: () => 58, lng: () => 9 }),
    }),
    getZoom: () => 11,
  };
  return { DROPPED_LAT: lat, DROPPED_LNG: lng, mockMap: map };
});

vi.mock("@vis.gl/react-google-maps", () => ({
  Map: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AdvancedMarker: ({
    onDragEnd,
    position,
    draggable,
    children,
  }: {
    onDragEnd?: (e: { latLng: { lat: () => number; lng: () => number } | null }) => void;
    position: { lat: number; lng: number };
    draggable?: boolean;
    children?: ReactNode;
  }) => (
    <div data-testid="marker" data-lat={position.lat} data-lng={position.lng}>
      {children}
      {draggable && (
        <button
          data-testid="simulate-drag-end"
          onClick={() =>
            onDragEnd?.({ latLng: { lat: () => DROPPED_LAT, lng: () => DROPPED_LNG } })
          }
        />
      )}
    </div>
  ),
  useMap: () => mockMap,
  Pin: () => null,
}));

beforeAll(() => {
  Object.assign(globalThis, {
    google: {
      maps: {
        LatLng: class {
          lat: () => number;
          lng: () => number;
          constructor(lat: number, lng: number) {
            this.lat = () => lat;
            this.lng = () => lng;
          }
        },
        Point: class {
          x: number;
          y: number;
          constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
          }
        },
      },
    },
  });
});

// Two far-apart locations ensure minZoom=8, below DEFAULT_ZOOM=11, so individual markers render.
const OSLO = { lat: 59.91, long: 10.75 };
const BERGEN = { lat: 60.39, long: 5.32 };

test("handleDragEnd updates the location at the dragged marker index", async () => {
  const setLocations = vi.fn();
  const { getByTestId } = await render(
    <MapWithDrop locations={[OSLO, BERGEN]} setLocations={setLocations} allowDragAndDrop />,
  );

  await getByTestId("simulate-drag-end").first().click();

  expect(setLocations).toHaveBeenCalledTimes(1);
  const updater = setLocations.mock.calls[0][0];
  expect(updater([OSLO, BERGEN])).toEqual([{ lat: DROPPED_LAT, long: DROPPED_LNG }, BERGEN]);
});

function dropOn(testId: string, clientX: number, clientY: number) {
  const el = document.querySelector(`[data-testid="${testId}"]`) as HTMLElement;
  el.dispatchEvent(new DragEvent("drop", { clientX, clientY, bubbles: true }));
}

test("handleDrop calls onDropLocation with the computed coordinates", async () => {
  const onDropLocation = vi.fn();
  await render(<MapWithDrop locations={[]} onDropLocation={onDropLocation} />);

  dropOn("map-drop-zone", 500, 400);

  expect(onDropLocation).toHaveBeenCalledWith({ lat: DROPPED_LAT, long: DROPPED_LNG });
});

test("handleDrop does nothing when neither allowDragAndDrop nor onDropLocation is set", async () => {
  const setLocations = vi.fn();
  await render(<MapWithDrop locations={[]} setLocations={setLocations} />);

  dropOn("map-drop-zone", 500, 400);

  expect(setLocations).not.toHaveBeenCalled();
});
