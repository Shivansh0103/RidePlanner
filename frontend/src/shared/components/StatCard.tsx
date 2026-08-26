import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  trend?: string;
  color?: "primary" | "success" | "warning" | "error" | "info";
};

export default function StatCard({
  label,
  value,
  icon,
  subtitle,
  color = "primary",
}: StatCardProps) {
  const getAccentGlow = () => {
    switch (color) {
      case "success":
        return "rgba(190, 242, 100, 0.15)";
      case "warning":
        return "rgba(251, 191, 36, 0.15)";
      case "error":
        return "rgba(248, 113, 113, 0.15)";
      default:
        return "rgba(99, 102, 241, 0.15)";
    }
  };

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: "#1a1a1e",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        "&:hover": {
          borderColor: `${color}.main`,
          boxShadow: `0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 0 16px ${getAccentGlow()}`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={1.5}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontFamily: '"Outfit", sans-serif',
              }}
            >
              {label}
            </Typography>
            {icon && (
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 1.5,
                  bgcolor: "rgba(255, 255, 255, 0.04)",
                  color: `${color}.main`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </Box>
            )}
          </Stack>

          <Typography
            variant="h4"
            className="font-mono"
            sx={{
              fontWeight: 800,
              color: "#f8fafc",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {value}
          </Typography>

          {subtitle && (
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500 }}>
              {subtitle}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}