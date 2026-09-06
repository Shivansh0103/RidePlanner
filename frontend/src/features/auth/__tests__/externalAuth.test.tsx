import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { AuthContext, type AuthContextValue } from "../context/AuthContext";
import { AuthCallbackPage } from "../pages/AuthCallbackPage";
import { LinkAccountPage } from "../pages/LinkAccountPage";
import { authApi } from "../api/authApi";

vi.mock("../api/authApi", () => ({
  authApi: {
    getLinkInfo: vi.fn(),
    linkExternalAccount: vi.fn(),
  },
}));

describe("External Authentication Frontend Components", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  function createAuthWrapper(overrides: Partial<AuthContextValue> = {}) {
    const contextValue: AuthContextValue = {
      isBootstrapping: false,
      isAuthenticated: false,
      user: null,
      authState: { status: "unauthenticated", user: null, isAuthenticated: false },
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      linkExternalAccount: vi.fn(),
      restoreSession: vi.fn(),
      ...overrides,
    };

    return {
      contextValue,
      Wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
        </QueryClientProvider>
      ),
    };
  }

  describe("GoogleSignInButton", () => {
    it("renders Google button with continue text", () => {
      render(
        <MemoryRouter>
          <GoogleSignInButton />
        </MemoryRouter>
      );

      expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
    });

    it("sanitizes open redirect returnUrl to fallback on click", () => {
      const originalLocation = window.location;
      Object.defineProperty(window, "location", {
        writable: true,
        value: { ...originalLocation, href: "" },
      });

      render(
        <MemoryRouter>
          <GoogleSignInButton returnUrl="https://evil.com" />
        </MemoryRouter>
      );

      const button = screen.getByRole("button", { name: /continue with google/i });
      fireEvent.click(button);

      expect(window.location.href).toContain("returnUrl=%2Ftrips");

      Object.defineProperty(window, "location", {
        writable: true,
        value: originalLocation,
      });
    });

    it("preserves valid local returnUrl on click", () => {
      const originalLocation = window.location;
      Object.defineProperty(window, "location", {
        writable: true,
        value: { ...originalLocation, href: "" },
      });

      render(
        <MemoryRouter>
          <GoogleSignInButton returnUrl="/trips/weekend-ride" />
        </MemoryRouter>
      );

      const button = screen.getByRole("button", { name: /continue with google/i });
      fireEvent.click(button);

      expect(window.location.href).toContain("returnUrl=%2Ftrips%2Fweekend-ride");

      Object.defineProperty(window, "location", {
        writable: true,
        value: originalLocation,
      });
    });
  });

  describe("AuthCallbackPage", () => {
    it("invokes restoreSession and navigates to returnUrl on success", async () => {
      const restoreSession = vi.fn().mockResolvedValue(undefined);
      const { Wrapper } = createAuthWrapper({ restoreSession });

      render(
        <Wrapper>
          <MemoryRouter initialEntries={["/auth/callback?status=success&returnUrl=%2Ftrips%2Fdetail"]}>
            <Routes>
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/trips/detail" element={<div>Trip Destination Reached</div>} />
            </Routes>
          </MemoryRouter>
        </Wrapper>
      );

      expect(screen.getByText(/Authenticating Rider Cockpit/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(restoreSession).toHaveBeenCalledTimes(1);
        expect(screen.getByText("Trip Destination Reached")).toBeInTheDocument();
      });
    });

    it("displays error message when provider returns error", async () => {
      const { Wrapper } = createAuthWrapper();

      render(
        <Wrapper>
          <MemoryRouter initialEntries={["/auth/callback?error=external_auth_failed"]}>
            <AuthCallbackPage />
          </MemoryRouter>
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Google authentication was cancelled or failed/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Return to Login/i })).toBeInTheDocument();
      });
    });
  });

  describe("LinkAccountPage", () => {
    it("displays error when ticket is missing", async () => {
      const { Wrapper } = createAuthWrapper();

      render(
        <Wrapper>
          <MemoryRouter initialEntries={["/auth/link-account"]}>
            <LinkAccountPage />
          </MemoryRouter>
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/No account linking ticket was provided/i)).toBeInTheDocument();
      });
    });

    it("loads masked email and provider info, then links account on password submit", async () => {
      vi.mocked(authApi.getLinkInfo).mockResolvedValue({
        maskedEmail: "r***r@example.com",
        provider: "Google",
      });

      const linkExternalAccount = vi.fn().mockResolvedValue(undefined);
      const { Wrapper } = createAuthWrapper({ linkExternalAccount });

      render(
        <Wrapper>
          <MemoryRouter initialEntries={["/auth/link-account?ticket=sample_test_ticket"]}>
            <Routes>
              <Route path="/auth/link-account" element={<LinkAccountPage />} />
              <Route path="/trips" element={<div>Trips Dashboard</div>} />
            </Routes>
          </MemoryRouter>
        </Wrapper>
      );

      // Verify ticket info loaded
      await waitFor(() => {
        expect(screen.getByText("r***r@example.com")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Confirm & Link Account/i })).toBeInTheDocument();
      });

      // Enter password
      const passwordInput = screen.getByLabelText(/Account Password/i);
      await userEvent.type(passwordInput, "ExistingSecret123!");

      const submitBtn = screen.getByRole("button", { name: /Confirm & Link Account/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(linkExternalAccount).toHaveBeenCalledWith({
          linkTicket: "sample_test_ticket",
          password: "ExistingSecret123!",
        });
        expect(screen.getByText("Trips Dashboard")).toBeInTheDocument();
      });
    });
  });
});
