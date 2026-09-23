import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthBootSplash, useAuth } from "@/features/auth";
import MainLayout from "@/layouts/MainLayout";
import { ErrorBoundary } from "@/shared/components";
import { LoadingSpinner } from "@/shared/ui";

import { AnonymousRoute } from "./AnonymousRoute";
import { ProtectedRoute } from "./ProtectedRoute";

// Lazy-loaded route components for optimized bundle splitting
const LandingPage = lazy(() => import("@/shared/pages/LandingPage"));
const HomePage = lazy(() => import("@/shared/pages/HomePage"));
const TripsPage = lazy(() => import("@/features/trips/pages/TripsPage"));
const CreateTripPage = lazy(() => import("@/features/trips/pages/CreateTripPage"));
const TripDetailsPage = lazy(() => import("@/features/trips/pages/TripDetailsPage"));
const EditTripPage = lazy(() => import("@/features/trips/pages/EditTripPage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/features/auth/pages/ResetPasswordPage"));
const AuthCallbackPage = lazy(() => import("@/features/auth/pages/AuthCallbackPage"));
const LinkAccountPage = lazy(() => import("@/features/auth/pages/LinkAccountPage"));
const SettingsPage = lazy(() => import("@/features/profile/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("@/shared/pages/NotFoundPage"));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export function RootRoute() {
  const { isBootstrapping, isAuthenticated } = useAuth();

  if (isBootstrapping) {
    return <AuthBootSplash />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <SuspenseWrapper>
      <LandingPage />
    </SuspenseWrapper>
  );
}

const router = createBrowserRouter([
  // Public OAuth / External Callback Route (Handles session bootstrap outside AnonymousRoute)
  {
    path: "auth/callback",
    element: (
      <SuspenseWrapper>
        <AuthCallbackPage />
      </SuspenseWrapper>
    ),
    errorElement: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },

  // Anonymous / Public Auth Routes
  {
    element: <AnonymousRoute />,
    errorElement: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
    children: [
      {
        path: "login",
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "register",
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <SuspenseWrapper>
            <ForgotPasswordPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "reset-password",
        element: (
          <SuspenseWrapper>
            <ResetPasswordPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "auth/link-account",
        element: (
          <SuspenseWrapper>
            <LinkAccountPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "link-account",
        element: (
          <SuspenseWrapper>
            <LinkAccountPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // Public Root / Landing Page Route (Unauthenticated visitors see LandingPage; Authenticated riders are redirected to /dashboard)
  {
    path: "/",
    element: <RootRoute />,
    errorElement: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/landing",
    element: (
      <SuspenseWrapper>
        <LandingPage />
      </SuspenseWrapper>
    ),
  },

  // Protected Main App Routes
  {
    element: <ProtectedRoute />,
    errorElement: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "dashboard",
            element: (
              <SuspenseWrapper>
                <HomePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "trips",
            element: (
              <SuspenseWrapper>
                <TripsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "trips/new",
            element: (
              <SuspenseWrapper>
                <CreateTripPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "trips/:tripId",
            element: (
              <SuspenseWrapper>
                <TripDetailsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "trips/:tripId/edit",
            element: (
              <SuspenseWrapper>
                <EditTripPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "settings",
            element: (
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },

  // Catch-all
  {
    path: "*",
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
]);

export default function AppRouter() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
