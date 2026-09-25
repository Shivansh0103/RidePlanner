import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showBackToTrips?: boolean;
  backToUrl?: string;
  backToText?: string;
  compact?: boolean;
}

export default function ErrorState({
  title = "Telemetry / Sync Error",
  message,
  onRetry,
  showBackToTrips = true,
  backToUrl = "/trips",
  backToText = "Return to Expeditions",
  compact = false,
}: ErrorStateProps) {
  if (compact) {
    return (
      <Paper
        role="alert"
        className="neo-inset"
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(239, 68, 68, 0.08)" : "rgba(239, 68, 68, 0.05)",
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(239, 68, 68, 0.25)" : "rgba(239, 68, 68, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <WarningAmberRoundedIcon sx={{ color: "#ef4444", fontSize: 22 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
              {title}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {message}
            </Typography>
          </Box>
        </Stack>
        {onRetry && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
            onClick={onRetry}
            sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.75rem" }}
          >
            Retry
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Paper
      role="alert"
      className="neo-convex"
      sx={{
        p: { xs: 3, sm: 4.5 },
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        textAlign: "center",
        maxWidth: 520,
        mx: "auto",
        my: { xs: 3, sm: 5 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 12px 36px rgba(0, 0, 0, 0.5)"
            : "0 12px 32px rgba(15, 23, 42, 0.06)",
      }}
    >
      <Box
        sx={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ef4444",
          mb: 2,
        }}
      >
        <WarningAmberRoundedIcon sx={{ fontSize: 30 }} />
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 800,
          color: "text.primary",
          mb: 0.8,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          maxWidth: 420,
          lineHeight: 1.55,
          fontSize: "0.88rem",
          mb: 3,
        }}
      >
        {message}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: "100%", justifyContent: "center" }}>
        {onRetry && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon sx={{ fontSize: 18 }} />}
            onClick={onRetry}
            sx={{
              fontWeight: 700,
              textTransform: "none",
              px: 2.5,
              py: 0.9,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.8rem",
            }}
          >
            Try Again
          </Button>
        )}

        {showBackToTrips && (
          <Button
            component={RouterLink}
            to={backToUrl}
            variant="outlined"
            startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
            sx={{
              color: "text.primary",
              borderColor: "divider",
              fontWeight: 700,
              textTransform: "none",
              px: 2.5,
              py: 0.9,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.8rem",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            {backToText}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}