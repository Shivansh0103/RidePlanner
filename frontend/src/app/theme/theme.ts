import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // Electric Sapphire / Precision Blue
      light: "#60a5fa",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0891b2", // Precision Cyan / Trail Blue
      light: "#22d3ee",
      dark: "#0e7490",
      contrastText: "#ffffff",
    },
    success: {
      main: "#10b981", // Emerald Green
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b", // Amber
      light: "#fbbf24",
      dark: "#d97706",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444", // Crimson
      light: "#f87171",
      dark: "#dc2626",
      contrastText: "#ffffff",
    },
    info: {
      main: "#4f46e5", // Electric Indigo
      light: "#818cf8",
      dark: "#3730a3",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc", // Clean Slate 50
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // Deep Slate 900
      secondary: "#64748b", // Slate 500
    },
    divider: "rgba(15, 23, 42, 0.08)",
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
      letterSpacing: "-0.025em",
      color: "#0f172a",
    },
    h2: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "#0f172a",
    },
    h3: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#0f172a",
    },
    h4: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.015em",
      color: "#0f172a",
    },
    h5: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.01em",
      color: "#0f172a",
    },
    h6: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      color: "#0f172a",
    },
    subtitle1: {
      fontWeight: 600,
      color: "#334155",
    },
    subtitle2: {
      fontWeight: 600,
      color: "#64748b",
    },
    button: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 18px",
          transition: "all 0.18s ease-in-out",
          "&.MuiButton-containedPrimary": {
            boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2), 0 1px 2px rgba(37, 99, 235, 0.1)",
            "&:hover": {
              boxShadow: "0 6px 14px rgba(37, 99, 235, 0.3), 0 2px 4px rgba(37, 99, 235, 0.15)",
              transform: "translateY(-1px)",
            },
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid rgba(15, 23, 42, 0.08)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.02)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
          "&:hover": {
            borderColor: "rgba(37, 99, 235, 0.25)",
            boxShadow: "0 8px 16px -4px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
        outlined: {
          borderColor: "rgba(15, 23, 42, 0.08)",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
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
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          border: "1px solid rgba(15, 23, 42, 0.08)",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
          },
        },
      },
    },
  },
});

export default theme;