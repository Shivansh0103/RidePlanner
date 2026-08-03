import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

import type { MapStop } from "./Map";

interface MapCameraControllerProps {
  stops: MapStop[];
}

export default function MapCameraController({ stops }: MapCameraControllerProps) {
  const map = useMap();

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
  }, [map, stops]);

  return null;
}
