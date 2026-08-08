import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NavigationIcon from "@mui/icons-material/Navigation";
import { Box, Chip, Stack } from "@mui/material";

interface RouteLegConnectorProps {
  distanceMeters?: number;
  durationMillis?: number;
  compact?: boolean;
}

export function formatLegDistance(distanceMeters: number): string {
  const km = distanceMeters / 1000;
  if (km < 1) {
    return `${Math.round(distanceMeters)} m`;
  }
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

export function formatLegDuration(durationMillis: number): string {
  const totalMinutes = Math.round(durationMillis / (1000 * 60));
  if (totalMinutes < 60) {
    return `${totalMinutes} mins`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

export default function RouteLegConnector({
  distanceMeters,
  durationMillis,
  compact = false,
}: RouteLegConnectorProps) {
  if (distanceMeters === undefined || durationMillis === undefined) {
    return (
      <Box sx={{ py: 1, pl: compact ? 2 : 4, display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: "2px",
            height: 20,
            bgcolor: "divider",
            borderRadius: 1,
          }}
        />
      </Box>
    );
  }

  const distanceText = formatLegDistance(distanceMeters);
  const durationText = formatLegDuration(durationMillis);

  return (
    <Box
      sx={{
        py: 1,
        my: 0.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}
    >
      <Stack direction="row" spacing={1} sx={{ pl: { xs: 1, sm: 2 }, alignItems: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 20,
          }}
        >
          <Box
            sx={{
              width: "2px",
              height: 12,
              bgcolor: "primary.main",
              opacity: 0.4,
            }}
          />
          <DirectionsCarIcon
            sx={{
              fontSize: 14,
              color: "primary.main",
              my: 0.25,
            }}
          />
          <Box
            sx={{
              width: "2px",
              height: 12,
              bgcolor: "primary.main",
              opacity: 0.4,
            }}
          />
        </Box>

        <Chip
          icon={<NavigationIcon sx={{ fontSize: "0.85rem !important", transform: "rotate(45deg)" }} />}
          label={`${distanceText} • ${durationText}`}
          size="small"
          variant="outlined"
          sx={{
            height: 24,
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "text.secondary",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.03)",
            borderColor: "divider",
            "& .MuiChip-icon": {
              color: "primary.main",
            },
          }}
        />
      </Stack>
    </Box>
  );
}
