import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NavigationIcon from "@mui/icons-material/Navigation";
import PlaceIcon from "@mui/icons-material/Place";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import type { DistanceUnit } from "@/features/profile";
import type { Trip } from "@/features/trips/types/trip";
import { calculateTripDays } from "@/features/trips/utils/tripOverviewSelectors";
import { formatDate } from "@/shared/utils/date";
import { formatDistance, formatDuration } from "@/shared/utils/formatters";

interface OverviewHeaderProps {
  trip: Trip;
  stopCount: number;
  routeDistanceMeters?: number;
  routeDurationMillis?: number;
  distanceUnit?: DistanceUnit;
}

export default function OverviewHeader({
  trip,
  stopCount,
  routeDistanceMeters = 0,
  routeDurationMillis = 0,
  distanceUnit = "Kilometers",
}: OverviewHeaderProps) {
  const totalDays = calculateTripDays(trip.startDate, trip.endDate);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2.5,
        bgcolor: "background.paper",
        borderColor: "rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: "rgba(37, 99, 235, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
            }}
          >
            <TwoWheelerIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
              Expedition Metrics & Route Summary
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarMonthIcon sx={{ fontSize: 14 }} />
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </Typography>
          </Box>
        </Stack>

        {/* Route Metric Chips */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Chip
            icon={<AccessTimeIcon fontSize="small" />}
            label={`${totalDays} ${totalDays === 1 ? "Day" : "Days"}`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />

          <Chip
            icon={<PlaceIcon fontSize="small" />}
            label={`${stopCount} ${stopCount === 1 ? "Stop" : "Stops"}`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />

          {routeDistanceMeters > 0 && (
            <Chip
              icon={<NavigationIcon fontSize="small" />}
              label={formatDistance(routeDistanceMeters, distanceUnit)}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600, color: "primary.main", borderColor: "rgba(37, 99, 235, 0.3)" }}
            />
          )}

          {routeDurationMillis > 0 && (
            <Chip
              icon={<DirectionsCarIcon fontSize="small" />}
              label={`${formatDuration(routeDurationMillis)} ride time`}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
