import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  message?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            my: 2,
            borderRadius: 2,
            textAlign: "center",
            borderColor: "error.light",
            bgcolor: "background.paper",
          }}
        >
          <Stack spacing={2} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "error.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.8,
              }}
            >
              <WarningAmberIcon sx={{ color: "error.contrastText", fontSize: 28 }} />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {this.props.title || "Something went wrong"}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>
              {this.props.message ||
                this.state.error?.message ||
                "An unexpected rendering error occurred. You can try recovering or reloading the page."}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
              <Button variant="outlined" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
            </Stack>
          </Stack>
        </Paper>
      );
    }

    return this.props.children;
  }
}
