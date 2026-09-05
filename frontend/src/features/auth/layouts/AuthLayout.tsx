import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import React, { type ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0b0f19",
        backgroundImage:
          "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent 70%), linear-gradient(180deg, #0b0f19 0%, #121416 100%)",
        py: { xs: 4, sm: 8 },
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Stack spacing={3} sx={{ alignItems: "center", mb: 3 }}>
          {/* Brand Icon */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2.5,
              bgcolor: "rgba(99, 102, 241, 0.12)",
              border: "1px solid rgba(99, 102, 241, 0.35)",
              boxShadow: "0 0 25px rgba(99, 102, 241, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#818cf8",
            }}
          >
            <TwoWheelerIcon sx={{ fontSize: 30 }} />
          </Box>

          {/* Header Texts */}
          <Box sx={{ textAlign: "center" }}>
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
                color: "#818cf8",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Mission Cockpit Access
            </Typography>
          </Box>
        </Stack>

        {/* Card Form Wrapper */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            bgcolor: "#141824",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow:
              "0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05)",
          }}
        >
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#f8fafc",
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#94a3b8",
                mt: 0.5,
                fontSize: "0.85rem",
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          {children}
        </Paper>
      </Container>
    </Box>
  );
};
