import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ErrorState from "../ErrorState";

describe("ErrorState (AUDIT-09)", () => {
  it("renders default title and provided error message", () => {
    render(
      <MemoryRouter>
        <ErrorState message="Connection dropped during sync" />
      </MemoryRouter>
    );

    expect(screen.getByText("Telemetry / Sync Error")).toBeInTheDocument();
    expect(screen.getByText("Connection dropped during sync")).toBeInTheDocument();
  });

  it("renders custom title and message", () => {
    render(
      <MemoryRouter>
        <ErrorState title="Expedition Not Found" message="Trip was not found on server." />
      </MemoryRouter>
    );

    expect(screen.getByText("Expedition Not Found")).toBeInTheDocument();
    expect(screen.getByText("Trip was not found on server.")).toBeInTheDocument();
  });

  it("calls onRetry callback when Try Again button is clicked", () => {
    const handleRetry = vi.fn();
    render(
      <MemoryRouter>
        <ErrorState message="Failed to load" onRetry={handleRetry} />
      </MemoryRouter>
    );

    const retryButton = screen.getByRole("button", { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("renders navigation link back to expeditions by default", () => {
    render(
      <MemoryRouter>
        <ErrorState message="Could not fetch trip" />
      </MemoryRouter>
    );

    const backLink = screen.getByRole("link", { name: /return to expeditions/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/trips");
  });

  it("hides back link when showBackToTrips is false", () => {
    render(
      <MemoryRouter>
        <ErrorState message="Could not fetch trips" showBackToTrips={false} />
      </MemoryRouter>
    );

    expect(screen.queryByRole("link", { name: /return to expeditions/i })).not.toBeInTheDocument();
  });

  it("renders compact mode correctly with retry", () => {
    const handleRetry = vi.fn();
    render(
      <MemoryRouter>
        <ErrorState compact title="Section Error" message="Failed to load section" onRetry={handleRetry} />
      </MemoryRouter>
    );

    expect(screen.getByText("Section Error")).toBeInTheDocument();
    expect(screen.getByText("Failed to load section")).toBeInTheDocument();
    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
