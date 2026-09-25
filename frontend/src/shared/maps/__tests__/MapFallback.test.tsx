import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MapFallback } from "../components/MapFallback";
import type { MapStop } from "../types/map";

describe("MapFallback", () => {
  it("renders default message when no custom message provided", () => {
    render(<MapFallback />);

    expect(screen.getByText("Route Waypoint Summary")).toBeInTheDocument();
    expect(
      screen.getByText(/Interactive map is currently unavailable or offline\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No map waypoints logged for this trip yet\./i)
    ).toBeInTheDocument();
  });

  it("renders custom message when API key is missing or invalid", () => {
    render(
      <MapFallback message="Google Maps API key is not configured." />
    );

    expect(
      screen.getByText(/Google Maps API key is not configured\./i)
    ).toBeInTheDocument();
  });

  it("renders list of waypoint chips when valid stops are provided", () => {
    const mockStops: MapStop[] = [
      {
        id: "stop-1",
        name: "Manali Base Camp",
        formattedAddress: "Manali, Himachal Pradesh",
        latitude: 32.2396,
        longitude: 77.1887,
      },
      {
        id: "stop-2",
        name: "Rohtang Pass",
        formattedAddress: "Rohtang, HP",
        latitude: 32.3716,
        longitude: 77.2466,
      },
      {
        id: "stop-invalid",
        name: "Unset Coordinates",
        formattedAddress: "Unknown",
        latitude: null,
        longitude: null,
      },
    ];

    render(<MapFallback stops={mockStops} />);

    expect(screen.getByText("1. Manali Base Camp")).toBeInTheDocument();
    expect(screen.getByText("2. Rohtang Pass")).toBeInTheDocument();
    expect(screen.queryByText(/Unset Coordinates/)).not.toBeInTheDocument();
  });
});
