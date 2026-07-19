import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import TripsPage from "@/features/trips/pages/TripsPage";
import CreateTripPage from "@/features/trips/pages/CreateTripPage";
import EditTripPage from "@/features/trips/pages/EditTripPage";
import TripDetailsPage from "@/features/trips/pages/TripDetailsPage";

import HomePage from "@/shared/pages/HomePage";
import NotFoundPage from "@/shared/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "trips",
        element: <TripsPage />,
      },

      {
        path: "trips/new",
        element: <CreateTripPage />,
      },

      {
        path: "trips/:tripId",
        element: <TripDetailsPage />,
      },

      {
        path: "trips/:tripId/edit",
        element: <EditTripPage />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}