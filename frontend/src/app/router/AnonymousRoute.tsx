import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AuthBootSplash, useAuth } from "@/features/auth";

interface LocationState {
  from?: {
    pathname: string;
    search?: string;
  };
}

export const AnonymousRoute: React.FC = () => {
  const { isBootstrapping, isAuthenticated } = useAuth();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  if (isBootstrapping) {
    return <AuthBootSplash />;
  }

  if (isAuthenticated) {
    const destination = state?.from?.pathname
      ? `${state.from.pathname}${state.from.search || ""}`
      : "/trips";
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
};
