import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { refreshManager, tokenStore } from "@/api";

import { authApi } from "../api/authApi";
import { AuthProvider } from "../context/AuthProvider";
import { useAuth } from "../hooks/useAuth";

describe("AuthContext & AuthProvider", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    tokenStore.clear();
    vi.restoreAllMocks();
  });

  function createWrapper() {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  }

  it("throws error when useAuth is used outside of AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider"
    );
  });

  it("bootstraps session successfully on mount when refresh cookie is valid", async () => {
    vi.spyOn(refreshManager, "restoreSession").mockResolvedValue({
      user: { id: "user-123", email: "rider@example.com" },
      accessToken: "bootstrapped-token-abc",
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    // Initially in bootstrapping state
    expect(result.current.isBootstrapping).toBe(true);

    await waitFor(() => {
      expect(result.current.isBootstrapping).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: "user-123",
      email: "rider@example.com",
    });
    expect(result.current.authState.status).toBe("authenticated");
  });

  it("transitions to unauthenticated when bootstrap session fails", async () => {
    vi.spyOn(refreshManager, "restoreSession").mockRejectedValue(
      new Error("No active session")
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isBootstrapping).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.authState.status).toBe("unauthenticated");
  });

  it("login sets tokenStore and transitions to authenticated", async () => {
    vi.spyOn(refreshManager, "restoreSession").mockRejectedValue(
      new Error("No active session")
    );

    vi.spyOn(authApi, "login").mockResolvedValue({
      accessToken: "login-jwt-token-456",
      tokenType: "Bearer",
      expiresIn: 900,
      userId: "user-login-789",
      email: "login@example.com",
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isBootstrapping).toBe(false);
    });

    await act(async () => {
      await result.current.login({
        email: "login@example.com",
        password: "Password123!",
      });
    });

    expect(tokenStore.get()).toBe("login-jwt-token-456");
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: "user-login-789",
      email: "login@example.com",
    });
  });

  it("logout clears tokenStore, queryClient cache, and transitions to unauthenticated", async () => {
    vi.spyOn(refreshManager, "restoreSession").mockResolvedValue({
      user: { id: "user-123", email: "rider@example.com" },
      accessToken: "bootstrapped-token-abc",
    });

    const logoutApiSpy = vi.spyOn(authApi, "logout").mockResolvedValue();
    const queryClientClearSpy = vi.spyOn(queryClient, "clear");

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    tokenStore.set("bootstrapped-token-abc");

    await act(async () => {
      await result.current.logout();
    });

    expect(logoutApiSpy).toHaveBeenCalled();
    expect(tokenStore.get()).toBeNull();
    expect(queryClientClearSpy).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("logout still executes local cleanup if backend logout fails", async () => {
    vi.spyOn(refreshManager, "restoreSession").mockResolvedValue({
      user: { id: "user-123", email: "rider@example.com" },
      accessToken: "bootstrapped-token-abc",
    });

    vi.spyOn(authApi, "logout").mockRejectedValue(new Error("Network Error"));
    const queryClientClearSpy = vi.spyOn(queryClient, "clear");

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    tokenStore.set("bootstrapped-token-abc");

    await act(async () => {
      await result.current.logout();
    });

    // Cleanup still executed
    expect(tokenStore.get()).toBeNull();
    expect(queryClientClearSpy).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
