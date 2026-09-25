import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode,useMemo } from "react";

import queryClient from "@/app/providers/queryClient";
import { getAppTheme } from "@/app/theme/theme";
import { ThemeContextProvider, useThemeMode } from "@/app/theme/ThemeContext";
import { AuthProvider } from "@/features/auth";
import { ErrorBoundary } from "@/shared/components";
import { MapProvider } from "@/shared/maps";

interface AppProvidersProps {
  children: ReactNode;
}

function MuiThemeBridge({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useThemeMode();
  const muiTheme = useMemo(() => getAppTheme(resolvedTheme), [resolvedTheme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeContextProvider>
        <MuiThemeBridge>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <MapProvider>{children}</MapProvider>
            </AuthProvider>
          </QueryClientProvider>
        </MuiThemeBridge>
      </ThemeContextProvider>
    </ErrorBoundary>
  );
}
