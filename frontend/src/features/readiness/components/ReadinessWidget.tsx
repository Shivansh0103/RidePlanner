import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SpeedIcon from "@mui/icons-material/Speed";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import { useTripReadiness } from "../hooks/useTripReadiness";

interface ReadinessWidgetProps {
  tripId: string;
  onViewDetails?: () => void;
}

export default function ReadinessWidget({ tripId }: ReadinessWidgetProps) {
  const { data: readiness, isLoading } = useTripReadiness(tripId);

  if (isLoading || !readiness) {
    return (
      <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
        <LinearProgress />
      </Card>
    );
  }

  const color =
    readiness.scorePercentage === 100
      ? "success"
      : readiness.scorePercentage >= 60
      ? "warning"
      : "error";

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        bgcolor: "background.paper",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 2 },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <SpeedIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
                  Trip Readiness Check
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {readiness.isReady
                    ? "All required planning criteria are met."
                    : "Some required planning criteria need attention."}
                </Typography>
              </Box>
            </Stack>

            <Chip
              icon={readiness.isReady ? <CheckCircleIcon fontSize="small" /> : <WarningIcon fontSize="small" />}
              label={`${readiness.scorePercentage}% READY`}
              color={color}
              sx={{ fontWeight: 700, fontSize: "0.85rem", px: 1, py: 2 }}
            />
          </Stack>

          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={readiness.scorePercentage}
              color={color}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
