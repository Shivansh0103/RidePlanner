import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import queryClient from "@/app/providers/queryClient";
import theme from "@/app/theme/theme";

import { MapProvider } from "@/shared/maps";

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <QueryClientProvider client={queryClient}>
        <MapProvider>{children}</MapProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
