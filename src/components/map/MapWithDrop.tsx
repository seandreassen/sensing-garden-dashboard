import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useRef, useState } from "react";

import { PinIcon } from "@/components/map/PinIcon";
import type { Location } from "@/lib/types/api";
import { computeMinZoomForLocations } from "@/lib/utils/location";

const DEFAULT_ZOOM = 11;
const SINGLE_PIN_ZOOM = 15;
const WORLD_VIEW_ZOOM = 2;
const WORLD_VIEW_CENTER = { lat: 20, lng: 0 };

function computeDefaultView(locations: Location[]) {
  if (locations.length === 0) {
    return {
      defaultCenter: WORLD_VIEW_CENTER,
      defaultZoom: WORLD_VIEW_ZOOM,
      defaultBounds: undefined,
    };
  }

  const lats = locations.map((l) => l.lat);
  const lngs = locations.map((l) => l.long);
  const center = {
    lat: (Math.max(...lats) + Math.min(...lats)) / 2,
    lng: (Math.max(...lngs) + Math.min(...lngs)) / 2,
  };

  if (locations.length === 1) {
    return {
      defaultCenter: center,
      defaultZoom: SINGLE_PIN_ZOOM,
      defaultBounds: undefined,
    };
  }

  return {
    defaultCenter: center,
    defaultZoom: undefined,
    defaultBounds: {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    },
  };
}

interface MapWithDropProps {
  locations: Location[];
  // Made optional because callers may use onDropLocation instead (see below).
  setLocations?: React.Dispatch<React.SetStateAction<Location[]>>;
  // Called when something is dropped onto the map. Receives the lat/lng of the
  // drop point. Use this when the caller owns which device/item is being dragged
  // and needs to associate the drop location with that item — rather than simply
  // appending a new anonymous location to the list.
  onDropLocation?: (location: Location) => void;
  // Optional label for each marker, aligned by index with `locations`.
  // When provided, renders a name badge above the pin.
  markerLabels?: string[];
  center?: Location;
  allowDragAndDrop?: boolean;
}

function MapWithDrop({
  locations,
  setLocations,
  onDropLocation,
  markerLabels,
  center,
  allowDragAndDrop,
}: MapWithDropProps) {
  const map = useMap();
  const mapDivRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const minZoom = computeMinZoomForLocations(locations);
  const { defaultCenter, defaultZoom, defaultBounds } = computeDefaultView(
    center ? [center, ...locations] : locations,
  );

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    // Allow the drop if either flag is set — allowDragAndDrop enables generic
    // pin placement, onDropLocation enables device-specific placement.
    if (!allowDragAndDrop && !onDropLocation) {
      return;
    }
    e.preventDefault();
    if (!map || !mapDivRef.current) {
      return;
    }

    const rect = mapDivRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const projection = map.getProjection();
    const bounds = map.getBounds();
    if (!projection || !bounds) {
      return;
    }

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const topLeft = projection.fromLatLngToPoint(new google.maps.LatLng(ne.lat(), sw.lng()));
    const currentZoom = map.getZoom();
    if (!topLeft || currentZoom === undefined) {
      return;
    }

    const scale = Math.pow(2, currentZoom);
    const worldPoint = new google.maps.Point(x / scale + topLeft.x, y / scale + topLeft.y);
    const latLng = projection.fromPointToLatLng(worldPoint);
    if (!latLng) {
      return;
    }

    const location = { lat: latLng.lat(), long: latLng.lng() };
    // If the caller provided onDropLocation, delegate to it so it can associate
    // the coordinates with whichever item was being dragged (tracked externally).
    // Otherwise fall back to appending a new location to the list.
    if (onDropLocation) {
      onDropLocation(location);
    } else {
      setLocations?.((prev) => [...prev, location]);
    }
  }

  function handleDragEnd(
    index: number,
    e: { latLng: { lat: () => number; lng: () => number } | null },
  ) {
    if (!e.latLng) {
      return;
    }
    const lat = e.latLng.lat();
    const long = e.latLng.lng();
    setLocations?.((prev) => prev.map((loc, i) => (i === index ? { lat, long } : loc)));
  }

  const overviewPosition = center
    ? { lat: center.lat, lng: center.long }
    : locations.length > 0
      ? {
          lat: locations.reduce((sum, l) => sum + l.lat, 0) / locations.length,
          lng: locations.reduce((sum, l) => sum + l.long, 0) / locations.length,
        }
      : null;

  return (
    <div
      ref={mapDivRef}
      data-testid="map-drop-zone"
      className="h-full min-h-125 w-full"
      onDragOver={allowDragAndDrop || onDropLocation ? (e) => e.preventDefault() : undefined}
      onDrop={allowDragAndDrop || onDropLocation ? handleDrop : undefined}
    >
      <Map
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        defaultBounds={defaultBounds}
        mapId="DEMO_MAP_ID"
        onCameraChanged={(ev) => setZoom(ev.detail.zoom)}
      >
        {zoom < minZoom
          ? overviewPosition && (
              <AdvancedMarker position={overviewPosition}>{center && <PinIcon />}</AdvancedMarker>
            )
          : locations.map((loc, i) => (
              <AdvancedMarker
                key={i}
                position={{ lat: loc.lat, lng: loc.long }}
                draggable={allowDragAndDrop}
                onDragEnd={(e) => handleDragEnd(i, e)}
              >
                {markerLabels?.[i] && (
                  <div className="flex flex-col items-center">
                    <div className="rounded bg-white px-1.5 py-0.5 text-xs font-medium text-black shadow">
                      {markerLabels[i]}
                    </div>
                    <PinIcon />
                  </div>
                )}
              </AdvancedMarker>
            ))}
      </Map>
    </div>
  );
}

export { MapWithDrop };
