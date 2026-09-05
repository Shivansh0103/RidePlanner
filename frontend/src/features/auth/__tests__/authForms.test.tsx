import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { UserMenu } from "../components/UserMenu";
import { AuthContext, type AuthContextValue } from "../context/AuthContext";

describe("Auth UI Components", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.restoreAllMocks();
  });

  function createWrapper(authValue: Partial<AuthContextValue> = {}) {
    const contextValue: AuthContextValue = {
      isBootstrapping: false,
      isAuthenticated: false,
      user: null,
      authState: { status: "unauthenticated", user: null, isAuthenticated: false },
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      ...authValue,
    };

    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={contextValue}>
          <MemoryRouter>{children}</MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>
    );
  }

  describe("LoginForm", () => {
    it("renders email and password inputs and submits with valid credentials", async () => {
      const loginMock = vi.fn().mockResolvedValue(undefined);

      render(<LoginForm />, {
        wrapper: createWrapper({ login: loginMock }),
      });

      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/^Password/i);
      const submitButton = screen.getByRole("button", { name: /Enter Cockpit/i });

      await userEvent.type(emailInput, "rider@example.com");
      await userEvent.type(passwordInput, "Secret123!");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(loginMock).toHaveBeenCalledWith({
          email: "rider@example.com",
          password: "Secret123!",
        });
      });
    });

    it("displays validation errors when fields are empty", async () => {
      render(<LoginForm />, { wrapper: createWrapper() });

      const submitButton = screen.getByRole("button", { name: /Enter Cockpit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      });
    });
  });

  describe("RegisterForm", () => {
    it("displays error when passwords do not match", async () => {
      render(<RegisterForm />, { wrapper: createWrapper() });

      const emailInput = screen.getByLabelText("Email Address");
      const passwordInput = screen.getByLabelText("Password");
      const confirmInput = screen.getByLabelText("Confirm Password");
      const submitButton = screen.getByRole("button", { name: /Create Rider Profile/i });

      await userEvent.type(emailInput, "newrider@example.com");
      await userEvent.type(passwordInput, "Password123!");
      await userEvent.type(confirmInput, "DifferentPass123!");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      });
    });

    it("submits registration with valid matching credentials", async () => {
      const registerMock = vi.fn().mockResolvedValue({ autoLoginSucceeded: true });

      render(<RegisterForm />, {
        wrapper: createWrapper({ register: registerMock }),
      });

      const emailInput = screen.getByLabelText("Email Address");
      const passwordInput = screen.getByLabelText("Password");
      const confirmInput = screen.getByLabelText("Confirm Password");
      const submitButton = screen.getByRole("button", { name: /Create Rider Profile/i });

      await userEvent.type(emailInput, "validrider@example.com");
      await userEvent.type(passwordInput, "SecurePass123!");
      await userEvent.type(confirmInput, "SecurePass123!");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(registerMock).toHaveBeenCalledWith({
          email: "validrider@example.com",
          password: "SecurePass123!",
        });
      });
    });
  });

  describe("UserMenu", () => {
    it("renders user information and triggers logout when clicked", async () => {
      const logoutMock = vi.fn().mockResolvedValue(undefined);

      render(<UserMenu />, {
        wrapper: createWrapper({
          isAuthenticated: true,
          user: { id: "user-456", email: "ducati_rider@example.com" },
          authState: {
            status: "authenticated",
            user: { id: "user-456", email: "ducati_rider@example.com" },
            isAuthenticated: true,
          },
          logout: logoutMock,
        }),
      });

      // Displays username derived from email
      expect(screen.getByText("ducati_rider")).toBeInTheDocument();
      expect(screen.getByText("READY")).toBeInTheDocument();

      // Open menu
      const menuTrigger = screen.getByLabelText(/rider account options/i);
      fireEvent.click(menuTrigger);

      // Verify email and logout option in menu
      expect(screen.getByText("ducati_rider@example.com")).toBeInTheDocument();
      const logoutButton = screen.getByRole("menuitem", { name: /Log Out/i });
      expect(logoutButton).toBeInTheDocument();

      // Click logout
      await userEvent.click(logoutButton);
      expect(logoutMock).toHaveBeenCalled();
    });
  });
});
