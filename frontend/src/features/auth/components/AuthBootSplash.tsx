import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";

import { useThemeMode } from "@/app/theme/ThemeContext";

export const AuthBootSplash: React.FC = () => {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === "dark";

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
        bgcolor: isDark ? "#0b0f19" : "#F1F3F9",
        backgroundImage: isDark
          ? "radial-gradient(circle at 50% 45%, rgba(99, 102, 241, 0.18), transparent 70%), linear-gradient(180deg, #0b0f19 0%, #121416 100%)"
          : "radial-gradient(circle at 50% 45%, rgba(79, 70, 229, 0.08), transparent 70%), linear-gradient(180deg, #F1F3F9 0%, #FFFFFF 100%)",
        zIndex: 9999,
        transition: "background-color 0.2s ease",
      }}
    >
      <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
        {/* Glow Brand Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: 3,
            bgcolor: isDark ? "rgba(99, 102, 241, 0.12)" : "rgba(79, 70, 229, 0.1)",
            border: isDark ? "1px solid rgba(99, 102, 241, 0.35)" : "1px solid rgba(79, 70, 229, 0.3)",
            boxShadow: isDark
              ? "0 0 35px rgba(99, 102, 241, 0.35), inset 0 0 15px rgba(99, 102, 241, 0.2)"
              : "0 0 24px rgba(79, 70, 229, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isDark ? "#818cf8" : "#4f46e5",
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
              color: isDark ? "#bef264" : "#4f46e5",
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
