import { Map as GoogleMap } from "@vis.gl/react-google-maps";

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "./constants";
import MapCameraController from "./MapCameraController";
import RouteLayer from "./RouteLayer";
import StopMarkerLayer from "./StopMarkerLayer";
import type { MapStop } from "./types/map";

export type { MapStop };

export interface MapProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  style?: React.CSSProperties;
  stops?: MapStop[];

  selectedStopId?: string | null;

  onStopSelect?: (stopId: string) => void;
}

const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

export function Map({
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  style,
  stops = [],
  selectedStopId,
  onStopSelect,
}: MapProps) {
  const validStops = stops.filter(
    (stop) =>
      stop.latitude !== null &&
      stop.longitude !== null &&
      (stop.latitude !== 0 || stop.longitude !== 0)
  );

  return (
    <GoogleMap
      mapId={mapId}
      defaultCenter={center}
      defaultZoom={zoom}
      gestureHandling="greedy"
      disableDefaultUI={false}
      style={{
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <MapCameraController stops={validStops} />

      <RouteLayer stops={validStops} />

      <StopMarkerLayer
        stops={validStops}
        selectedStopId={selectedStopId}
        onStopSelect={onStopSelect}
      />
    </GoogleMap>
  );
}
