import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { Box, Container, Link, Paper, Typography } from "@mui/material";
import React, { type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#141313",
        backgroundImage:
          "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.18), transparent 70%), linear-gradient(180deg, #141313 0%, #1a1a1e 100%)",
        py: { xs: 3, sm: 4 },
        px: 2,
        boxSizing: "border-box",
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
        }}
      >
        {/* Top Header Row with Back to Home & Centered Brand */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Link
            component={RouterLink}
            to="/"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              color: "#94a3b8",
              fontSize: "0.8rem",
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.04em",
              px: 1.2,
              py: 0.6,
              borderRadius: 1.5,
              bgcolor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transition: "all 0.2s ease",
              "&:hover": {
                color: "#f8fafc",
                bgcolor: "rgba(99, 102, 241, 0.15)",
                borderColor: "rgba(99, 102, 241, 0.4)",
                transform: "translateX(-2px)",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <span>BACK TO HOME</span>
          </Link>

          <Link
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              cursor: "pointer",
              "&:hover .brand-icon": {
                borderColor: "#6366f1",
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.45)",
                transform: "scale(1.05)",
              },
            }}
          >
            <Box
              className="brand-icon"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#818cf8",
                transition: "all 0.25s ease",
              }}
            >
              <TwoWheelerIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                color: "#f8fafc",
                fontSize: "1.15rem",
                letterSpacing: "-0.02em",
              }}
            >
              RidePlanner
            </Typography>
          </Link>
        </Box>

        {/* Card Form Wrapper */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            p: { xs: 3, sm: 3.5 },
            borderRadius: 3.5,
            bgcolor: "#1a1a1e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow:
              "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)",
          }}
        >
          <Box sx={{ mb: 2.5, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#f8fafc",
                fontSize: "1.3rem",
                letterSpacing: "-0.02em",
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
