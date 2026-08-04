import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

import type { MapStop } from "./types/map";

interface MapCameraControllerProps {
  stops: MapStop[];
}

export default function MapCameraController({ stops }: MapCameraControllerProps) {
  const map = useMap();

  const stopsKey = stops.map((s) => `${s.id}:${s.latitude},${s.longitude}`).join("|");

  useEffect(() => {
    if (!map || stops.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    stops.forEach((stop) => {
      bounds.extend({
        lat: stop.latitude!,
        lng: stop.longitude!,
      });
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, 80);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, stopsKey]);

  return null;
}
