import { createTheme, type Theme } from "@mui/material/styles";

export function getAppTheme(mode: "light" | "dark" = "dark"): Theme {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: isDark
        ? {
            main: "#6366f1", // Electric Indigo
            light: "#818cf8",
            dark: "#4f46e5",
            contrastText: "#ffffff",
          }
        : {
            main: "#4f46e5", // Electric Indigo (Harmonized with dark mode)
            light: "#6366f1",
            dark: "#4338ca",
            contrastText: "#ffffff",
          },
      secondary: isDark
        ? {
            main: "#06b6d4", // Precision Cyan
            light: "#22d3ee",
            dark: "#0891b2",
            contrastText: "#ffffff",
          }
        : {
            main: "#7c3aed", // Vibrant Violet
            light: "#9333ea",
            dark: "#6d28d9",
            contrastText: "#ffffff",
          },
      success: isDark
        ? {
            main: "#bef264", // Acid Green
            light: "#d9f99d",
            dark: "#a3e635",
            contrastText: "#121416",
          }
        : {
            main: "#059669", // Daylight Emerald
            light: "#10b981",
            dark: "#047857",
            contrastText: "#ffffff",
          },
      warning: {
        main: "#fbbf24", // Amber
        light: "#fde047",
        dark: "#d97706",
        contrastText: "#121416",
      },
      error: {
        main: isDark ? "#f87171" : "#ef4444", // Crimson
        light: "#fca5a5",
        dark: "#dc2626",
        contrastText: "#ffffff",
      },
      info: {
        main: isDark ? "#818cf8" : "#4f46e5", // Tech Indigo
        light: isDark ? "#a5b4fc" : "#818cf8",
        dark: isDark ? "#4338ca" : "#3730a3",
        contrastText: "#ffffff",
      },
      background: {
        default: isDark ? "#121416" : "#F1F3F9", // Deep Obsidian vs Softer Slate Canvas
        paper: isDark ? "#1a1a1e" : "#FFFFFF", // Obsidian Elevated vs Pure White Surface
      },
      text: {
        primary: isDark ? "#f8fafc" : "#0F172A", // Crisp White vs Deep Slate 900
        secondary: isDark ? "#94a3b8" : "#475569", // Telemetry Slate vs Slate 600
        disabled: isDark ? "#64748b" : "#94a3b8",
      },
      divider: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
      action: {
        hover: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(99, 102, 241, 0.04)",
        selected: isDark ? "rgba(99, 102, 241, 0.12)" : "rgba(37, 99, 235, 0.08)",
        disabledBackground: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
        disabled: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)",
      },
    },

    shape: {
      borderRadius: 12,
    },

    typography: {
      fontFamily: [
        '"Plus Jakarta Sans"',
        '"Inter"',
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        "sans-serif",
      ].join(","),

      h1: {
        fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
        fontWeight: 800,
        letterSpacing: "-0.03em",
        color: isDark ? "#f8fafc" : "#090d16",
      },
      h2: {
        fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
        fontWeight: 800,
        letterSpacing: "-0.025em",
        color: isDark ? "#f8fafc" : "#090d16",
      },
      h3: {
        fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color: isDark ? "#f8fafc" : "#090d16",
      },
      h4: {
        fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
        fontWeight: 700,
        letterSpacing: "-0.015em",
        color: isDark ? "#f8fafc" : "#090d16",
      },
      h5: {
        fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
        fontWeight: 700,
        letterSpacing: "-0.01em",
        color: isDark ? "#f8fafc" : "#090d16",
      },
      h6: {
        fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
        fontWeight: 600,
        letterSpacing: "-0.005em",
        color: isDark ? "#f8fafc" : "#090d16",
      },
      subtitle1: {
        fontWeight: 600,
        color: isDark ? "#e2e8f0" : "#1e293b",
      },
      subtitle2: {
        fontWeight: 600,
        color: isDark ? "#94a3b8" : "#475569",
      },
      body1: {
        fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
        color: isDark ? "#cbd5e1" : "#334155",
        lineHeight: 1.6,
      },
      body2: {
        fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
        color: isDark ? "#94a3b8" : "#475569",
        lineHeight: 1.55,
      },
      button: {
        fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
        textTransform: "none",
        fontWeight: 700,
        letterSpacing: "0.01em",
      },
      caption: {
        fontFamily: '"Inter", sans-serif',
        color: isDark ? "#94a3b8" : "#64748b",
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? "#121416" : "#F4F6FF",
            color: isDark ? "#f8fafc" : "#090d16",
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: "none",
            fontWeight: 700,
            padding: "8px 18px",
            transition: "all 0.18s ease-in-out",
            "&.MuiButton-containedPrimary": {
              background: isDark
                ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              boxShadow: isDark
                ? "0 2px 8px rgba(99, 102, 241, 0.35)"
                : "0 4px 14px rgba(37, 99, 235, 0.35)",
              "&:hover": {
                background: isDark
                  ? "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)"
                  : "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                boxShadow: isDark
                  ? "0 4px 16px rgba(99, 102, 241, 0.5)"
                  : "0 6px 20px rgba(37, 99, 235, 0.45)",
                transform: "translateY(-1px)",
              },
            },
            "&.MuiButton-outlined": {
              borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(99, 102, 241, 0.25)",
              color: isDark ? "#e2e8f0" : "#2563eb",
              "&:hover": {
                borderColor: isDark ? "rgba(99, 102, 241, 0.5)" : "rgba(37, 99, 235, 0.6)",
                backgroundColor: isDark ? "rgba(99, 102, 241, 0.08)" : "rgba(37, 99, 235, 0.06)",
                color: isDark ? "#ffffff" : "#1d4ed8",
              },
            },
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: isDark ? "#1a1a1e" : "#FFFFFF",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(99, 102, 241, 0.16)",
            boxShadow: isDark
              ? "0 4px 20px -2px rgba(0, 0, 0, 0.5)"
              : "0 6px 24px -2px rgba(99, 102, 241, 0.08)",
            backgroundImage: "none",
            transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
            "&:hover": {
              borderColor: isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(37, 99, 235, 0.4)",
              boxShadow: isDark
                ? "0 8px 30px -4px rgba(0, 0, 0, 0.7), 0 0 15px rgba(99, 102, 241, 0.1)"
                : "0 12px 32px -4px rgba(37, 99, 235, 0.14)",
            },
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            backgroundColor: isDark ? "#1a1a1e" : "#FFFFFF",
            backgroundImage: "none",
          },
          outlined: {
            borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(99, 102, 241, 0.16)",
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 700,
            fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(99, 102, 241, 0.18)",
          },
        },
      },

      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 44,
          },
          indicator: {
            height: 3,
            borderRadius: "3px 3px 0 0",
            backgroundColor: isDark ? "#6366f1" : "#2563eb",
            boxShadow: isDark
              ? "0 0 10px rgba(99, 102, 241, 0.8)"
              : "0 0 10px rgba(37, 99, 235, 0.5)",
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
            minHeight: 44,
            padding: "10px 16px",
            color: isDark ? "#94a3b8" : "#64748b",
            "&.Mui-selected": {
              color: isDark ? "#818cf8" : "#2563eb",
              fontWeight: 700,
            },
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 18,
            backgroundColor: isDark ? "#1e1e24" : "#FFFFFF",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(99, 102, 241, 0.2)",
            boxShadow: isDark
              ? "0 24px 48px -12px rgba(0, 0, 0, 0.8)"
              : "0 24px 48px -12px rgba(37, 99, 235, 0.15)",
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#FFFFFF",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(99, 102, 241, 0.2)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(37, 99, 235, 0.45)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "#6366f1" : "#2563eb",
              borderWidth: 2,
              boxShadow: isDark
                ? "0 0 10px rgba(99, 102, 241, 0.2)"
                : "0 0 10px rgba(37, 99, 235, 0.2)",
            },
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? "#25252b" : "#090d16",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 8,
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#f8fafc",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(99, 102, 241, 0.1)",
            color: isDark ? "#cbd5e1" : "#334155",
          },
          head: {
            color: isDark ? "#94a3b8" : "#475569",
            fontWeight: 700,
            fontFamily: '"Outfit", sans-serif',
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          },
        },
      },
    },
  });
}

// Default export is the Obsidian Dark theme for backward compatibility
const defaultTheme = getAppTheme("dark");
export default defaultTheme;