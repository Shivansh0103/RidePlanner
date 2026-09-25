import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { Box, Container, Link, Paper, Tooltip, Typography } from "@mui/material";
import React, { type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

import { useThemeMode } from "@/app/theme/ThemeContext";
import { ThemeToggle } from "@/shared/components";

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
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: isDark ? "#141313" : "#F1F3F9",
        backgroundImage: isDark
          ? "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.18), transparent 70%), linear-gradient(180deg, #141313 0%, #1a1a1e 100%)"
          : "radial-gradient(ellipse at top, rgba(79, 70, 229, 0.08), transparent 70%), linear-gradient(180deg, #F1F3F9 0%, #FFFFFF 100%)",
        py: { xs: 3, sm: 4 },
        px: 2,
        boxSizing: "border-box",
        transition: "background-color 0.2s ease",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "460px !important",
          px: { xs: 1, sm: 2 },
          width: "100%",
        }}
      >
        {/* Top Header Row: Symbol-only buttons aligned with card edges */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Tooltip title="Back to Home" arrow enterDelay={200}>
            <Link
              component={RouterLink}
              to="/"
              aria-label="Back to Home"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                color: isDark ? "#94a3b8" : "#475569",
                borderRadius: "50%",
                bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.04)",
                border: isDark
                  ? "1px solid rgba(255, 255, 255, 0.08)"
                  : "1px solid rgba(203, 213, 225, 0.8)",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: isDark ? "#f8fafc" : "#0F172A",
                  bgcolor: isDark ? "rgba(99, 102, 241, 0.15)" : "rgba(79, 70, 229, 0.08)",
                  borderColor: isDark ? "rgba(99, 102, 241, 0.4)" : "rgba(79, 70, 229, 0.3)",
                  transform: "translateX(-2px)",
                },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            </Link>
          </Tooltip>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ThemeToggle size="small" showLabels={false} />

            <Tooltip title="RidePlanner Home" arrow enterDelay={200}>
              <Link
                component={RouterLink}
                to="/"
                aria-label="RidePlanner Home"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover .brand-icon": {
                    borderColor: isDark ? "#6366f1" : "#4f46e5",
                    boxShadow: isDark
                      ? "0 0 20px rgba(99, 102, 241, 0.45)"
                      : "0 0 16px rgba(79, 70, 229, 0.3)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Box
                  className="brand-icon"
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: isDark ? "rgba(99, 102, 241, 0.15)" : "rgba(79, 70, 229, 0.1)",
                    border: isDark
                      ? "1px solid rgba(99, 102, 241, 0.35)"
                      : "1px solid rgba(79, 70, 229, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDark ? "#818cf8" : "#4f46e5",
                    transition: "all 0.25s ease",
                  }}
                >
                  <TwoWheelerIcon sx={{ fontSize: 18 }} />
                </Box>
              </Link>
            </Tooltip>
          </Box>
        </Box>

        {/* Card Form Wrapper */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            p: { xs: 3, sm: 3.5 },
            borderRadius: 3.5,
            bgcolor: isDark ? "#1a1a1e" : "#FFFFFF",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #E2E8F0",
            boxShadow: isDark
              ? "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)"
              : "0 20px 45px -8px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.06)",
            transition: "all 0.2s ease",
          }}
        >
          <Box sx={{ mb: 2.5, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: isDark ? "#f8fafc" : "#0F172A",
                fontSize: "1.3rem",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: isDark ? "#94a3b8" : "#64748B",
                mt: 0.5,
                fontSize: "0.85rem",
                lineHeight: 1.4,
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
