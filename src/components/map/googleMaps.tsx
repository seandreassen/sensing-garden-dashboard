import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useState, useRef } from "react";

type Pin = { lat: number; lng: number };

const DEFAULT_CENTER = { lat: 59.9139, lng: 10.7522 };
const DEFAULT_ZOOM = 11;
const CENTER_PIN_MIN_ZOOM = 12;

const dragImage = new Image();
dragImage.src =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 40 14 40C14 40 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#EA4335"/>
      <circle cx="14" cy="14" r="6" fill="white"/>
    </svg>`,
  );

function handleDragStart(e: React.DragEvent<HTMLSpanElement>) {
  e.dataTransfer.setDragImage(dragImage, 14, 40);
}

function MapWithDrop({
  pins,
  setPins,
  center,
}: {
  pins: Pin[];
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
  center?: Pin;
}) {
  const map = useMap();
  const mapDivRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
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

    setPins((prev) => [...prev, { lat: latLng.lat(), lng: latLng.lng() }]);
  }

  function handleDragEnd(
    index: number,
    e: { latLng: { lat: () => number; lng: () => number } | null },
  ) {
    if (!e.latLng) {
      return;
    }
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPins((prev) => prev.map((pin, i) => (i === index ? { lat, lng } : pin)));
  }

  return (
    <div
      ref={mapDivRef}
      style={{ width: "100%", height: "500px" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Map
        defaultZoom={DEFAULT_ZOOM}
        defaultCenter={center ?? DEFAULT_CENTER}
        mapId="DEMO_MAP_ID"
        onCameraChanged={(ev) => setZoom(ev.detail.zoom)}
      >
        {center && zoom < CENTER_PIN_MIN_ZOOM && <AdvancedMarker position={center} />}
        {zoom >= CENTER_PIN_MIN_ZOOM &&
          pins.map((pin, i) => (
            <AdvancedMarker
              key={i}
              position={pin}
              draggable
              onDragEnd={(e) => handleDragEnd(i, e)}
            />
          ))}
      </Map>
    </div>
  );
}

export function GoogleMaps({ initialPins = [], center }: { initialPins?: Pin[]; center?: Pin }) {
  const [pins, setPins] = useState<Pin[]>(initialPins);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ marginBottom: "8px" }}>
        <span
          draggable
          onDragStart={handleDragStart}
          style={{
            cursor: "grab",
            userSelect: "none",
            display: "inline-block",
          }}
          title="Dra meg til kartet"
        >
          <svg
            width="28"
            height="40"
            viewBox="0 0 28 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 40 14 40C14 40 28 24.5 28 14C28 6.268 21.732 0 14 0Z"
              fill="#EA4335"
            />
            <circle cx="14" cy="14" r="6" fill="white" />
          </svg>
        </span>
        <span style={{ marginLeft: "8px", fontSize: "14px", color: "#555" }}>
          Dra pinnen til kartet for å plassere den
        </span>
      </div>
      <MapWithDrop pins={pins} setPins={setPins} center={center} />
    </APIProvider>
  );
}
