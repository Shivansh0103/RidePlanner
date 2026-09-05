import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import MainLayout from "@/layouts/MainLayout";
import { ErrorBoundary } from "@/shared/components";
import { LoadingSpinner } from "@/shared/ui";

import { AnonymousRoute } from "./AnonymousRoute";
import { ProtectedRoute } from "./ProtectedRoute";

// Lazy-loaded route components for optimized bundle splitting
const HomePage = lazy(() => import("@/shared/pages/HomePage"));
const TripsPage = lazy(() => import("@/features/trips/pages/TripsPage"));
const CreateTripPage = lazy(() => import("@/features/trips/pages/CreateTripPage"));
const TripDetailsPage = lazy(() => import("@/features/trips/pages/TripDetailsPage"));
const EditTripPage = lazy(() => import("@/features/trips/pages/EditTripPage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const NotFoundPage = lazy(() => import("@/shared/pages/NotFoundPage"));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

const router = createBrowserRouter([
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
    ],
  },

  // Protected Main App Routes
  {
    path: "/",
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
            index: true,
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
