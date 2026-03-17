import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useState, useRef } from "react";

type Pin = { lat: number; lng: number };

function MapWithDrop({
  pins,
  setPins,
}: {
  pins: Pin[];
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
}) {
  const map = useMap();
  const mapDivRef = useRef<HTMLDivElement>(null);

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
    const zoom = map.getZoom();
    if (!topLeft || zoom === undefined) {
      return;
    }

    const scale = Math.pow(2, zoom);
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
      <Map defaultZoom={9} defaultCenter={{ lat: 53.54, lng: 10 }} mapId="DEMO_MAP_ID">
        {pins.map((pin, i) => (
          <AdvancedMarker key={i} position={pin} draggable onDragEnd={(e) => handleDragEnd(i, e)} />
        ))}
      </Map>
    </div>
  );
}

export function GoogleMaps() {
  const [pins, setPins] = useState<Pin[]>([]);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ marginBottom: "8px" }}>
        <span
          draggable
          style={{ cursor: "grab", fontSize: "28px", userSelect: "none" }}
          title="Dra meg til kartet"
        >
          📍
        </span>
        <span style={{ marginLeft: "8px", fontSize: "14px", color: "#555" }}>
          Dra pinnen til kartet for å plassere den
        </span>
      </div>
      <MapWithDrop pins={pins} setPins={setPins} />
    </APIProvider>
  );
}
