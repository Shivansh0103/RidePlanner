import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthContext, type AuthContextValue } from "@/features/auth/context/AuthContext";

import { profileApi } from "../../api/profileApi";
import type { UserProfile } from "../../types/userProfile";
import { SettingsPage } from "../SettingsPage";

vi.mock("../../api/profileApi");

const mockProfile: UserProfile = {
  preferredCurrencyCode: "INR",
  distanceUnit: "Kilometers",
  defaultVehicleName: "Royal Enfield Himalayan",
  defaultTankCapacityLitres: 17,
  defaultFuelEfficiencyKmPerLitre: 30,
  createdAt: "2026-09-05T10:00:00Z",
  updatedAt: "2026-09-05T10:00:00Z",
};

describe("SettingsPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.restoreAllMocks();
  });

  function createWrapper() {
    const authContextValue: AuthContextValue = {
      isBootstrapping: false,
      isAuthenticated: true,
      user: { id: "user-123", email: "rider@example.com" },
      authState: {
        status: "authenticated",
        user: { id: "user-123", email: "rider@example.com" },
        isAuthenticated: true,
      },
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    };

    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authContextValue}>
          <MemoryRouter>{children}</MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>
    );
  }

  it("renders profile settings form with loaded preferences", async () => {
    vi.mocked(profileApi.getProfile).mockResolvedValue(mockProfile);

    render(<SettingsPage />, { wrapper: createWrapper() });

    expect(
      screen.getByText(/Rider Settings & Expedition Preferences/i)
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Royal Enfield Himalayan")).toBeInTheDocument();
      expect(screen.getByDisplayValue("17")).toBeInTheDocument();
      expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    });
  });

  it("allows updating vehicle nickname and saves preferences", async () => {
    vi.mocked(profileApi.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(profileApi.updateProfile).mockResolvedValue({
      ...mockProfile,
      defaultVehicleName: "Triumph Tiger 900",
    });

    render(<SettingsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Royal Enfield Himalayan")).toBeInTheDocument();
    });

    const vehicleInput = screen.getByLabelText(/Vehicle Model \/ Nickname/i);
    await userEvent.clear(vehicleInput);
    await userEvent.type(vehicleInput, "Triumph Tiger 900");

    const saveButton = screen.getByRole("button", { name: /Save Preferences/i });
    expect(saveButton).toBeEnabled();
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(profileApi.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultVehicleName: "Triumph Tiger 900",
        })
      );
    });
  });
});
