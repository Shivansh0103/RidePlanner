import MapIcon from "@mui/icons-material/Map";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import type { MapStop } from "../types/map";

interface MapFallbackProps {
  stops?: MapStop[];
  message?: string;
}

export function MapFallback({
  stops = [],
  message = "Interactive map is currently unavailable or offline.",
}: MapFallbackProps) {
  const validStops = stops.filter(
    (stop) =>
      stop.latitude !== null &&
      stop.longitude !== null &&
      (stop.latitude !== 0 || stop.longitude !== 0)
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
        height: "100%",
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: "action.selected",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <MapIcon color="primary" sx={{ fontSize: 32 }} />
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        Route Waypoint Summary
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 400 }}>
        {message} All route stops remain fully accessible in your Itinerary.
      </Typography>

      {validStops.length > 0 ? (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "center",
            maxWidth: 500,
          }}
        >
          {validStops.map((stop, idx) => (
            <Chip
              key={stop.id || idx}
              icon={<PlaceIcon sx={{ fontSize: 16 }} />}
              label={`${idx + 1}. ${stop.name || stop.formattedAddress}`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          ))}
        </Stack>
      ) : (
        <Typography variant="caption" color="text.disabled">
          No map waypoints logged for this trip yet.
        </Typography>
      )}
    </Paper>
  );
}
