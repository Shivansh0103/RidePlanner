import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1", // Electric Indigo
      light: "#818cf8",
      dark: "#4f46e5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#06b6d4", // Precision Cyan
      light: "#22d3ee",
      dark: "#0891b2",
      contrastText: "#ffffff",
    },
    success: {
      main: "#bef264", // Acid Green
      light: "#d9f99d",
      dark: "#a3e635",
      contrastText: "#121416",
    },
    warning: {
      main: "#fbbf24", // Amber
      light: "#fde047",
      dark: "#d97706",
      contrastText: "#121416",
    },
    error: {
      main: "#f87171", // Crimson
      light: "#fca5a5",
      dark: "#ef4444",
      contrastText: "#ffffff",
    },
    info: {
      main: "#818cf8", // Tech Indigo
      light: "#a5b4fc",
      dark: "#4338ca",
      contrastText: "#ffffff",
    },
    background: {
      default: "#121416", // Deep Obsidian Canvas
      paper: "#1a1a1e", // Obsidian Elevated Surface
    },
    text: {
      primary: "#f8fafc", // High contrast crisp white
      secondary: "#94a3b8", // Refined telemetry slate
      disabled: "#64748b",
    },
    divider: "rgba(255, 255, 255, 0.08)",
    action: {
      hover: "rgba(255, 255, 255, 0.04)",
      selected: "rgba(99, 102, 241, 0.12)",
      disabledBackground: "rgba(255, 255, 255, 0.05)",
      disabled: "rgba(255, 255, 255, 0.3)",
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
      color: "#f8fafc",
    },
    h2: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
      letterSpacing: "-0.025em",
      color: "#f8fafc",
    },
    h3: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#f8fafc",
    },
    h4: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.015em",
      color: "#f8fafc",
    },
    h5: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.01em",
      color: "#f8fafc",
    },
    h6: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      letterSpacing: "-0.005em",
      color: "#f8fafc",
    },
    subtitle1: {
      fontWeight: 600,
      color: "#e2e8f0",
    },
    subtitle2: {
      fontWeight: 600,
      color: "#94a3b8",
    },
    body1: {
      fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
      color: "#cbd5e1",
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
      color: "#94a3b8",
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
      color: "#94a3b8",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#121416",
          color: "#f8fafc",
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
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
              boxShadow: "0 4px 16px rgba(99, 102, 241, 0.5)",
              transform: "translateY(-1px)",
            },
          },
          "&.MuiButton-outlined": {
            borderColor: "rgba(255, 255, 255, 0.12)",
            color: "#e2e8f0",
            "&:hover": {
              borderColor: "rgba(99, 102, 241, 0.5)",
              backgroundColor: "rgba(99, 102, 241, 0.08)",
              color: "#ffffff",
            },
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: "#1a1a1e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
          backgroundImage: "none",
          transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
          "&:hover": {
            borderColor: "rgba(99, 102, 241, 0.3)",
            boxShadow: "0 8px 30px -4px rgba(0, 0, 0, 0.7), 0 0 15px rgba(99, 102, 241, 0.1)",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: "#1a1a1e",
          backgroundImage: "none",
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.08)",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
          fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
          border: "1px solid rgba(255, 255, 255, 0.08)",
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
          backgroundColor: "#6366f1",
          boxShadow: "0 0 10px rgba(99, 102, 241, 0.8)",
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
          color: "#94a3b8",
          "&.Mui-selected": {
            color: "#818cf8",
            fontWeight: 700,
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          backgroundColor: "#1e1e24",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.8)",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.12)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.25)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6366f1",
            borderWidth: 2,
            boxShadow: "0 0 10px rgba(99, 102, 241, 0.2)",
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#25252b",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 8,
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "#f8fafc",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255, 255, 255, 0.06)",
          color: "#cbd5e1",
        },
        head: {
          color: "#94a3b8",
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

export default theme;