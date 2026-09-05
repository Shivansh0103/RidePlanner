import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import queryClient from "@/app/providers/queryClient";
import theme from "@/app/theme/theme";
import { AuthProvider } from "@/features/auth";
import { ErrorBoundary } from "@/shared/components";
import { MapProvider } from "@/shared/maps";

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <MapProvider>{children}</MapProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
