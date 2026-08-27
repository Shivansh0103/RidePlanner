import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import { Button, Tooltip } from "@mui/material";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

import type { MapStop } from "./types/map";

interface MapCameraControllerProps {
  stops: MapStop[];
  selectedStopId?: string | null;
}

export default function MapCameraController({ stops, selectedStopId }: MapCameraControllerProps) {
  const map = useMap();

  const validStops = stops.filter(
    (s) =>
      typeof s.latitude === "number" &&
      typeof s.longitude === "number" &&
      !isNaN(s.latitude) &&
      !isNaN(s.longitude) &&
      (s.latitude !== 0 || s.longitude !== 0)
  );

  const stopsKey = validStops.map((s) => `${s.id}:${s.latitude},${s.longitude}`).join("|");

  const fitRouteBounds = () => {
    if (!map || validStops.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    validStops.forEach((stop) => {
      bounds.extend({
        lat: stop.latitude!,
        lng: stop.longitude!,
      });
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, 80);
    }
  };

  // Initial bounds fit
  useEffect(() => {
    fitRouteBounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, stopsKey]);

  // Pan gently to selected stop without forcing sudden zoom changes on single click
  useEffect(() => {
    if (!map || !selectedStopId) return;
    const target = validStops.find((s) => s.id === selectedStopId);
    if (target && target.latitude && target.longitude) {
      map.panTo({ lat: target.latitude, lng: target.longitude });
    }
  }, [map, selectedStopId, validStops]);

  if (validStops.length === 0) return null;

  return (
    <Tooltip title="Re-center Full Route Bounds">
      <Button
        size="small"
        onClick={fitRouteBounds}
        startIcon={<CenterFocusStrongIcon sx={{ fontSize: 15 }} />}
        className="glass-panel"
        sx={{
          position: "absolute",
          top: 14,
          right: 14,
          zIndex: 10,
          bgcolor: "rgba(24, 24, 27, 0.85)",
          color: "#818cf8",
          borderColor: "rgba(255, 255, 255, 0.12)",
          border: "1px solid",
          backdropFilter: "blur(8px)",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.68rem",
          fontWeight: 800,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          px: 1.5,
          py: 0.6,
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.6)",
          "&:hover": {
            bgcolor: "#6366f1",
            color: "#ffffff",
            borderColor: "#6366f1",
            boxShadow: "0 0 16px rgba(99, 102, 241, 0.4)",
          },
        }}
      >
        Re-Center Route
      </Button>
    </Tooltip>
  );
}
