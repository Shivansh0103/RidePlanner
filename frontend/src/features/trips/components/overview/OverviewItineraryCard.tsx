import AltRouteIcon from "@mui/icons-material/AltRoute";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NavigationIcon from "@mui/icons-material/Navigation";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

import type { NextStopInfo } from "@/features/trips/utils/tripOverviewSelectors";
import { formatDistance, formatDuration } from "@/shared/utils/formatters";

interface OverviewItineraryCardProps {
  nextStopInfo: NextStopInfo | null;
  totalStops: number;
  routeDistanceMeters?: number;
  routeDurationMillis?: number;
}

export default function OverviewItineraryCard({
  nextStopInfo,
  totalStops,
  routeDistanceMeters = 0,
  routeDurationMillis = 0,
}: OverviewItineraryCardProps) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Itinerary Snapshot
            </Typography>
            <Chip
              label={`${totalStops} ${totalStops === 1 ? "Stop" : "Stops"}`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {nextStopInfo ? (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                    {nextStopInfo.label}
                  </Typography>
                  {nextStopInfo.stop.category && (
                    <Chip label={nextStopInfo.stop.category} size="small" variant="outlined" sx={{ fontSize: "0.7rem", height: 20 }} />
                  )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PlaceIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {nextStopInfo.stop.name}
                  </Typography>
                </Box>

                {nextStopInfo.stop.formattedAddress && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {nextStopInfo.stop.formattedAddress}
                  </Typography>
                )}
              </Stack>
            </Box>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <AltRouteIcon color="action" sx={{ fontSize: 36, mb: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                No stops added yet to this trip.
              </Typography>
            </Box>
          )}

          {/* Route Metrics Summary */}
          {(routeDistanceMeters > 0 || routeDurationMillis > 0) && (
            <Stack direction="row" spacing={2} sx={{ pt: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <NavigationIcon fontSize="small" color="action" />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {formatDistance(routeDistanceMeters)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <DirectionsCarIcon fontSize="small" color="action" />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {formatDuration(routeDurationMillis)} driving
                </Typography>
              </Box>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
