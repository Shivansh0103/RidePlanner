import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import * as authModule from "@/features/auth";

import { AnonymousRoute } from "../AnonymousRoute";
import { ProtectedRoute } from "../ProtectedRoute";

function mockAuth(overrides: Partial<authModule.AuthContextValue> = {}): authModule.AuthContextValue {
  return {
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
}

describe("Route Guards", () => {
  describe("ProtectedRoute", () => {
    it("renders AuthBootSplash when bootstrapping", () => {
      vi.spyOn(authModule, "useAuth").mockReturnValue(
        mockAuth({
          isBootstrapping: true,
          authState: { status: "bootstrapping", user: null, isAuthenticated: false },
        })
      );

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Protected Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/Verifying Rider Credentials/i)).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("redirects to /login preserving from location when unauthenticated", () => {
      vi.spyOn(authModule, "useAuth").mockReturnValue(
        mockAuth({
          isBootstrapping: false,
          isAuthenticated: false,
          user: null,
          authState: { status: "unauthenticated", user: null, isAuthenticated: false },
        })
      );

      render(
        <MemoryRouter initialEntries={["/trips/123"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/trips/:id" element={<div>Trip 123 Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Login Page")).toBeInTheDocument();
      expect(screen.queryByText("Trip 123 Content")).not.toBeInTheDocument();
    });

    it("renders protected child content when authenticated", () => {
      vi.spyOn(authModule, "useAuth").mockReturnValue(
        mockAuth({
          isBootstrapping: false,
          isAuthenticated: true,
          user: { id: "u-1", email: "rider@example.com" },
          authState: {
            status: "authenticated",
            user: { id: "u-1", email: "rider@example.com" },
            isAuthenticated: true,
          },
        })
      );

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Protected Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });
  });

  describe("AnonymousRoute", () => {
    it("renders AuthBootSplash when bootstrapping", () => {
      vi.spyOn(authModule, "useAuth").mockReturnValue(
        mockAuth({
          isBootstrapping: true,
          authState: { status: "bootstrapping", user: null, isAuthenticated: false },
        })
      );

      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route element={<AnonymousRoute />}>
              <Route path="/login" element={<div>Login Form</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/Verifying Rider Credentials/i)).toBeInTheDocument();
      expect(screen.queryByText("Login Form")).not.toBeInTheDocument();
    });

    it("renders anonymous form when unauthenticated", () => {
      vi.spyOn(authModule, "useAuth").mockReturnValue(
        mockAuth({
          isBootstrapping: false,
          isAuthenticated: false,
          user: null,
          authState: { status: "unauthenticated", user: null, isAuthenticated: false },
        })
      );

      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route element={<AnonymousRoute />}>
              <Route path="/login" element={<div>Login Form</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Login Form")).toBeInTheDocument();
    });

    it("redirects authenticated user to destination from location state", () => {
      vi.spyOn(authModule, "useAuth").mockReturnValue(
        mockAuth({
          isBootstrapping: false,
          isAuthenticated: true,
          user: { id: "u-1", email: "rider@example.com" },
          authState: {
            status: "authenticated",
            user: { id: "u-1", email: "rider@example.com" },
            isAuthenticated: true,
          },
        })
      );

      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/login",
              state: { from: { pathname: "/trips/abc" } },
            },
          ]}
        >
          <Routes>
            <Route element={<AnonymousRoute />}>
              <Route path="/login" element={<div>Login Form</div>} />
            </Route>
            <Route path="/trips/abc" element={<div>Trip ABC Content</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Trip ABC Content")).toBeInTheDocument();
      expect(screen.queryByText("Login Form")).not.toBeInTheDocument();
    });

    it("redirects authenticated user to /trips if no state.from is present", () => {
      vi.spyOn(authModule, "useAuth").mockReturnValue(
        mockAuth({
          isBootstrapping: false,
          isAuthenticated: true,
          user: { id: "u-1", email: "rider@example.com" },
          authState: {
            status: "authenticated",
            user: { id: "u-1", email: "rider@example.com" },
            isAuthenticated: true,
          },
        })
      );

      render(
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route element={<AnonymousRoute />}>
              <Route path="/login" element={<div>Login Form</div>} />
            </Route>
            <Route path="/trips" element={<div>Trips Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Trips Dashboard")).toBeInTheDocument();
    });
  });
});
