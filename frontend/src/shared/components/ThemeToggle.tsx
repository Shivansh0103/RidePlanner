import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Box, Tooltip } from "@mui/material";
import React from "react";

import { useThemeMode, type ThemeMode } from "@/app/theme/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  size?: "small" | "medium";
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = "small",
  showLabels = true,
}) => {
  const { mode, resolvedTheme, setMode } = useThemeMode();
  const isDark = resolvedTheme === "dark";

  const options: Array<{
    id: ThemeMode;
    label: string;
    tooltip: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "light",
      label: "Light",
      tooltip: "Daylight Mode",
      icon: (
        <LightModeIcon
          sx={{
            fontSize: size === "small" ? 14 : 16,
            color: mode === "light" ? (isDark ? "#fde047" : "#d97706") : "inherit",
          }}
        />
      ),
    },
    {
      id: "dark",
      label: "Dark",
      tooltip: "Obsidian Dark",
      icon: (
        <DarkModeIcon
          sx={{
            fontSize: size === "small" ? 14 : 16,
            color: mode === "dark" ? "#818cf8" : "inherit",
          }}
        />
      ),
    },
    {
      id: "system",
      label: "Auto",
      tooltip: "Follow System Preference",
      icon: (
        <BrightnessAutoIcon
          sx={{
            fontSize: size === "small" ? 14 : 16,
            color: mode === "system" ? (isDark ? "#bef264" : "#4f46e5") : "inherit",
          }}
        />
      ),
    },
  ];

  return (
    <Box
      className={className}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        p: "2px",
        borderRadius: "9999px",
        bgcolor: isDark ? "rgba(20, 19, 19, 0.85)" : "rgba(241, 245, 249, 0.95)",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.12)"
          : "1px solid rgba(203, 213, 225, 0.8)",
        boxShadow: isDark
          ? "0 2px 8px rgba(0, 0, 0, 0.4)"
          : "0 1px 4px rgba(15, 23, 42, 0.06)",
        backdropFilter: "blur(8px)",
        transition: "all 0.2s ease",
      }}
      role="group"
      aria-label="Theme mode switcher"
    >
      {options.map((opt) => {
        const active = mode === opt.id;
        return (
          <Tooltip key={opt.id} title={opt.tooltip} enterDelay={400} arrow>
            <Box
              component="button"
              type="button"
              onClick={() => setMode(opt.id)}
              aria-pressed={active}
              aria-label={opt.tooltip}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: showLabels ? 0.5 : 0,
                px: showLabels ? (size === "small" ? 1 : 1.4) : (size === "small" ? "7px" : "9px"),
                py: size === "small" ? "4px" : "6px",
                borderRadius: "9999px",
                border: active
                  ? isDark
                    ? "1px solid rgba(99, 102, 241, 0.4)"
                    : "1px solid rgba(99, 102, 241, 0.25)"
                  : "1px solid transparent",
                bgcolor: active
                  ? isDark
                    ? "rgba(99, 102, 241, 0.2)"
                    : "#FFFFFF"
                  : "transparent",
                color: active
                  ? isDark
                    ? "#f8fafc"
                    : "#090d16"
                  : isDark
                  ? "#94a3b8"
                  : "#64748b",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: size === "small" ? "0.68rem" : "0.75rem",
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                boxShadow: active
                  ? isDark
                    ? "0 0 10px rgba(99, 102, 241, 0.35)"
                    : "0 2px 6px rgba(99, 102, 241, 0.12)"
                  : "none",
                transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  color: isDark ? "#ffffff" : "#090d16",
                  bgcolor: active
                    ? isDark
                      ? "rgba(99, 102, 241, 0.25)"
                      : "#FFFFFF"
                    : isDark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(99, 102, 241, 0.08)",
                },
                "&:focus-visible": {
                  outline: "2px solid #6366f1",
                  outlineOffset: "1px",
                },
              }}
            >
              {opt.icon}
              {showLabels && (
                <Box
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {opt.label}
                </Box>
              )}
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default ThemeToggle;
