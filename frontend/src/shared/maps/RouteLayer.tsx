import { Polyline } from "@vis.gl/react-google-maps";
import { useMemo } from "react";

import type { MapStop } from "./Map";
import { useRoute } from "./hooks/useRoute";

interface RouteLayerProps {
  stops: MapStop[];
}

export default function RouteLayer({ stops }: RouteLayerProps) {
  const { route, loading, error } = useRoute(stops);

  const path = useMemo(
    () =>
      route?.geometry.path.map((point) => ({
        lat: point.latitude,
        lng: point.longitude,
      })) ?? [],
    [route],
  );

  if (loading) {
    return null;
  }

  if (error) {
    console.error("Failed to load route", error);
    return null;
  }

  if (path.length === 0) {
    return null;
  }

  return <Polyline path={path} strokeColor="#1A73E8" strokeOpacity={0.9} strokeWeight={5} />;
}
