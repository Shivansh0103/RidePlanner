import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AuthBootSplash, useAuth } from "@/features/auth";

export const ProtectedRoute: React.FC = () => {
  const { isBootstrapping, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return <AuthBootSplash />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
