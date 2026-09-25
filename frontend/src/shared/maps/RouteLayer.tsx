import { Polyline } from "@vis.gl/react-google-maps";

import { useThemeMode } from "@/app/theme/ThemeContext";

import { useRoute } from "./hooks/useRoute";
import type { MapStop } from "./types/map";

interface RouteLayerProps {
  stops: MapStop[];
}

export default function RouteLayer({ stops }: RouteLayerProps) {
  const { route } = useRoute(stops);
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === "dark";

  if (!route) {
    return null;
  }

  const path = route.geometry.path
    .filter((point) => point.latitude !== null && point.longitude !== null)
    .map((point) => ({
      lat: point.latitude!,
      lng: point.longitude!,
    }));

  if (path.length === 0) {
    return null;
  }

  return (
    <Polyline
      path={path}
      strokeColor={isDark ? "#818cf8" : "#4f46e5"}
      strokeOpacity={0.9}
      strokeWeight={6}
      zIndex={2}
    />
  );
}
