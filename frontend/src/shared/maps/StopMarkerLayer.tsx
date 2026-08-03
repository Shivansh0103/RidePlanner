import { AdvancedMarker } from "@vis.gl/react-google-maps";

import StopMarker from "./components/StopMarker";
import type { MapStop } from "./Map";

interface StopMarkerLayerProps {
  stops: MapStop[];
  selectedStopId?: string | null;
  onStopSelect?: (stopId: string) => void;
}

export default function StopMarkerLayer({
  stops,
  selectedStopId,
  onStopSelect,
}: StopMarkerLayerProps) {
  return (
    <>
      {stops.map((stop, index) => (
        <AdvancedMarker
          key={stop.id}
          position={{
            lat: stop.latitude!,
            lng: stop.longitude!,
          }}
          onClick={() => onStopSelect?.(stop.id)}
        >
          <StopMarker number={index + 1} selected={selectedStopId === stop.id} />
        </AdvancedMarker>
      ))}
    </>
  );
}
