import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useRef, useState } from "react";

import { computeMinZoomForLocations } from "@/lib/locationUtils";
import type { Location } from "@/lib/types/api";

import { PinIcon } from "./PinIcon";

const DEFAULT_ZOOM = 11;
const SINGLE_PIN_ZOOM = 15;

function computeDefaultView(locations: Location[]) {
  if (locations.length === 0) {
    return {
      defaultCenter: undefined,
      defaultZoom: DEFAULT_ZOOM,
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
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  center?: Location;
  allowDragAndDrop?: boolean;
}

function MapWithDrop({ locations, setLocations, center, allowDragAndDrop }: MapWithDropProps) {
  const map = useMap();
  const mapDivRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const minZoom = computeMinZoomForLocations(locations);
  const { defaultCenter, defaultZoom, defaultBounds } = computeDefaultView(
    center ? [center, ...locations] : locations,
  );

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    if (!allowDragAndDrop) {
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

    setLocations((prev) => [...prev, { lat: latLng.lat(), long: latLng.lng() }]);
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
    setLocations((prev) => prev.map((loc, i) => (i === index ? { lat, long } : loc)));
  }

  return (
    <div
      ref={mapDivRef}
      className="h-125 w-full"
      onDragOver={allowDragAndDrop ? (e) => e.preventDefault() : undefined}
      onDrop={allowDragAndDrop ? handleDrop : undefined}
    >
      <Map
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        defaultBounds={defaultBounds}
        mapId="DEMO_MAP_ID"
        onCameraChanged={(ev) => setZoom(ev.detail.zoom)}
      >
        {center && zoom < minZoom && (
          <AdvancedMarker position={{ lat: center.lat, lng: center.long }}>
            <PinIcon />
          </AdvancedMarker>
        )}
        {zoom >= minZoom &&
          locations.map((loc, i) => (
            <AdvancedMarker
              key={i}
              position={{ lat: loc.lat, lng: loc.long }}
              draggable={allowDragAndDrop}
              onDragEnd={(e) => handleDragEnd(i, e)}
            />
          ))}
      </Map>
    </div>
  );
}

export { MapWithDrop };
