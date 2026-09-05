import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";

export const AuthBootSplash: React.FC = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0b0f19",
        backgroundImage:
          "radial-gradient(circle at 50% 45%, rgba(99, 102, 241, 0.18), transparent 70%), linear-gradient(180deg, #0b0f19 0%, #121416 100%)",
        zIndex: 9999,
      }}
    >
      <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
        {/* Glow Brand Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: 3,
            bgcolor: "rgba(99, 102, 241, 0.12)",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            boxShadow:
              "0 0 35px rgba(99, 102, 241, 0.35), inset 0 0 15px rgba(99, 102, 241, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#818cf8",
          }}
        >
          <TwoWheelerIcon sx={{ fontSize: 38 }} />
        </Box>

        {/* Brand Titles */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 800,
              fontStyle: "italic",
              color: "#bef264",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              mb: 0.5,
            }}
          >
            RidePlanner
          </Typography>
          <Typography
            sx={{
              fontFamily: 'monospace, "Fira Code", Courier',
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Obsidian Velocity Console
          </Typography>
        </Box>

        {/* Spinner & Telemetry Text */}
        <Stack direction="row" spacing={1.5} sx={{ pt: 2, alignItems: "center" }}>
          <CircularProgress
            size={18}
            thickness={4.5}
            sx={{
              color: "#6366f1",
            }}
          />
          <Typography
            sx={{
              fontFamily: 'monospace, "Fira Code", Courier',
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "#64748b",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Verifying Rider Credentials...
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};
