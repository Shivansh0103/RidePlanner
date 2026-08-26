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
            bgcolor: "rgba(255, 255, 255, 0.1)",
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
        py: 0.8,
        my: 0.2,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}
    >
      <Stack direction="row" spacing={1.2} sx={{ pl: { xs: 1, sm: 2.5 }, alignItems: "center" }}>
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
              height: 10,
              bgcolor: "#6366f1",
              opacity: 0.5,
            }}
          />
          <DirectionsCarIcon
            sx={{
              fontSize: 14,
              color: "#818cf8",
              my: 0.2,
            }}
          />
          <Box
            sx={{
              width: "2px",
              height: 10,
              bgcolor: "#6366f1",
              opacity: 0.5,
            }}
          />
        </Box>

        <Chip
          icon={<NavigationIcon sx={{ fontSize: "0.75rem !important", color: "#818cf8 !important", transform: "rotate(45deg)" }} />}
          label={`${distanceText} • ${durationText}`}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#e4e4e7",
            bgcolor: "#141313",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            fontFamily: '"JetBrains Mono", monospace',
          }}
        />
      </Stack>
    </Box>
  );
}
