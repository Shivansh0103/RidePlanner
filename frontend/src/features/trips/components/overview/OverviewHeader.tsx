import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NavigationIcon from "@mui/icons-material/Navigation";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import type { Trip } from "@/features/trips/types/trip";
import {
  calculateTripDays,
  calculateTripStatus,
} from "@/features/trips/utils/tripOverviewSelectors";
import { formatDate } from "@/shared/utils/date";
import { formatDistance, formatDuration } from "@/shared/utils/formatters";

interface OverviewHeaderProps {
  trip: Trip;
  stopCount: number;
  routeDistanceMeters?: number;
  routeDurationMillis?: number;
}

export default function OverviewHeader({
  trip,
  stopCount,
  routeDistanceMeters = 0,
  routeDurationMillis = 0,
}: OverviewHeaderProps) {
  const status = calculateTripStatus(trip.startDate, trip.endDate);
  const totalDays = calculateTripDays(trip.startDate, trip.endDate);

  const getStatusColor = () => {
    switch (status.type) {
      case "Upcoming":
        return "primary";
      case "Ongoing":
        return "success";
      case "Completed":
        return "default";
      default:
        return "info";
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: 3,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(25, 118, 210, 0.12) 0%, rgba(18, 18, 18, 0.95) 100%)"
            : "linear-gradient(135deg, rgba(227, 242, 253, 0.6) 0%, rgba(255, 255, 255, 0.95) 100%)",
        borderColor: "divider",
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <CalendarMonthIcon color="primary" sx={{ fontSize: 24 }} />
            <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary" }}>
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </Typography>
            <Chip
              label={status.label}
              color={getStatusColor()}
              size="small"
              sx={{ fontWeight: 700, borderRadius: 1.5 }}
            />
          </Box>
        </Box>

        {/* Quick Route & Trip Metrics Chips */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Chip
            icon={<AccessTimeIcon fontSize="small" />}
            label={`${totalDays} ${totalDays === 1 ? "Day" : "Days"}`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 500 }}
          />

          <Chip
            icon={<PlaceIcon fontSize="small" />}
            label={`${stopCount} ${stopCount === 1 ? "Stop" : "Stops"}`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 500 }}
          />

          {routeDistanceMeters > 0 && (
            <Chip
              icon={<NavigationIcon fontSize="small" />}
              label={formatDistance(routeDistanceMeters)}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 500 }}
            />
          )}

          {routeDurationMillis > 0 && (
            <Chip
              icon={<DirectionsCarIcon fontSize="small" />}
              label={`${formatDuration(routeDurationMillis)} driving`}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 500 }}
            />
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
