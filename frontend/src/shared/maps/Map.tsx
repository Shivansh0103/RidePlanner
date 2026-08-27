import { Map as GoogleMap } from "@vis.gl/react-google-maps";

import { ErrorBoundary } from "@/shared/components";

import { MapFallback } from "./components/MapFallback";
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
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Tactical Obsidian dark mode map styles
const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#18181b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#18181b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#e5e7eb" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#818cf8" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1f2421" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#27272a" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1c1c1f" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3f3f46" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#27272a" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#232328" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#09090b" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b7280" }],
  },
];

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

  // If no API key configured, gracefully degrade to text-based waypoint overview
  if (!apiKey) {
    return (
      <MapFallback
        stops={validStops}
        message="Google Maps API key is not configured."
      />
    );
  }

  return (
    <ErrorBoundary fallback={<MapFallback stops={validStops} />}>
      <GoogleMap
        mapId={mapId}
        defaultCenter={center}
        defaultZoom={zoom}
        gestureHandling="greedy"
        disableDefaultUI={false}
        colorScheme="DARK"
        styles={mapId ? undefined : darkMapStyles}
        style={{
          width: "100%",
          height: "100%",
          ...style,
        }}
      >
        <MapCameraController stops={validStops} selectedStopId={selectedStopId} />

        <RouteLayer stops={validStops} />

        <StopMarkerLayer
          stops={validStops}
          selectedStopId={selectedStopId}
          onStopSelect={onStopSelect}
        />
      </GoogleMap>
    </ErrorBoundary>
  );
}
