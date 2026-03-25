import { APIProvider } from "@vis.gl/react-google-maps";
import { useState } from "react";

import { env } from "@/env";
import type { Location } from "@/lib/types/api";

import { MapWithDrop } from "./MapWithDrop";
import { PinIcon } from "./PinIcon";

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

interface GoogleMapsProps {
  initialLocations?: Location[];
  center?: Location;
  allowDragAndDrop?: boolean;
}

function GoogleMaps({ initialLocations = [], center, allowDragAndDrop = false }: GoogleMapsProps) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);

  return (
    <>
      {allowDragAndDrop && (
        <div className="mb-2 flex items-center gap-2">
          <span
            draggable
            onDragStart={handleDragStart}
            className="inline-block cursor-grab select-none"
            title="Drag onto the map to place a pin"
          >
            <PinIcon />
          </span>
          <span className="text-sm text-gray-500">Drag the pin onto the map to place it</span>
        </div>
      )}
      <div className="flex h-125 items-center justify-center">
        {env.VITE_GOOGLE_MAPS_API_KEY ? (
          <APIProvider apiKey={env.VITE_GOOGLE_MAPS_API_KEY}>
            <MapWithDrop
              locations={locations}
              setLocations={setLocations}
              center={center}
              allowDragAndDrop={allowDragAndDrop}
            />
          </APIProvider>
        ) : (
          <p className="text-destructive">Missing VITE_GOOGLE_MAPS_API_KEY</p>
        )}
      </div>
    </>
  );
}

export { GoogleMaps };
