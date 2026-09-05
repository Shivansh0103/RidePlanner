import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../axios";
import { rawClient } from "../rawClient";
import { refreshManager } from "../refreshManager";
import { refreshTransport } from "../refreshTransport";
import { tokenStore } from "../tokenStore";
import { ApiError } from "../types";

describe("Core Transport & Security Layer", () => {
  beforeEach(() => {
    tokenStore.clear();
    vi.restoreAllMocks();
  });

  describe("tokenStore", () => {
    it("starts with null token in memory", () => {
      expect(tokenStore.get()).toBeNull();
    });

    it("sets and retrieves in-memory access token", () => {
      tokenStore.set("sample-jwt-token-123");
      expect(tokenStore.get()).toBe("sample-jwt-token-123");
    });

    it("clears in-memory access token", () => {
      tokenStore.set("sample-jwt-token-123");
      tokenStore.clear();
      expect(tokenStore.get()).toBeNull();
    });
  });

  describe("refreshManager Concurrency Deduplication", () => {
    it("deduplicates concurrent refresh requests into exactly 1 HTTP call", async () => {
      const executeRefreshSpy = vi
        .spyOn(refreshTransport, "executeRefresh")
        .mockImplementation(async () => {
          // Simulate slight network latency
          await new Promise((resolve) => setTimeout(resolve, 50));
          return {
            accessToken: "new-rotated-token-abc",
            tokenType: "Bearer",
            expiresIn: 900,
            userId: "user-123",
            email: "user@example.com",
          };
        });

      // Fire 4 concurrent requests for a valid token
      const [token1, token2, token3, token4] = await Promise.all([
        refreshManager.getValidToken(),
        refreshManager.getValidToken(),
        refreshManager.getValidToken(),
        refreshManager.getValidToken(),
      ]);

      // All 4 callers receive the identical renewed access token
      expect(token1).toBe("new-rotated-token-abc");
      expect(token2).toBe("new-rotated-token-abc");
      expect(token3).toBe("new-rotated-token-abc");
      expect(token4).toBe("new-rotated-token-abc");

      // Crucial: executeRefresh was called EXACTLY ONCE
      expect(executeRefreshSpy).toHaveBeenCalledTimes(1);
      expect(tokenStore.get()).toBe("new-rotated-token-abc");
    });

    it("emits single sessionExpired event and clears tokenStore on refresh failure", async () => {
      vi.spyOn(refreshTransport, "executeRefresh").mockRejectedValue(
        new ApiError({
          message: "Invalid refresh token",
          status: 401,
          title: "Unauthorized",
        })
      );

      const expiredHandler = vi.fn();
      const unsubscribe = refreshManager.onSessionExpired(expiredHandler);

      tokenStore.set("stale-token");

      // Concurrently fire 3 requests that will all fail
      const results = await Promise.allSettled([
        refreshManager.getValidToken(),
        refreshManager.getValidToken(),
        refreshManager.getValidToken(),
      ]);

      expect(results[0].status).toBe("rejected");
      expect(results[1].status).toBe("rejected");
      expect(results[2].status).toBe("rejected");

      // tokenStore cleared
      expect(tokenStore.get()).toBeNull();

      // Session expired handler called exactly once
      expect(expiredHandler).toHaveBeenCalledTimes(1);

      unsubscribe();
    });
  });

  describe("rawClient Configuration", () => {
    it("configures withCredentials: true on rawClient", () => {
      expect(rawClient.defaults.withCredentials).toBe(true);
    });

    it("has no Authorization header in defaults", () => {
      expect(rawClient.defaults.headers.common?.Authorization).toBeUndefined();
    });
  });

  describe("apiClient Interceptors", () => {
    it("configures withCredentials: true on apiClient", () => {
      expect(apiClient.defaults.withCredentials).toBe(true);
    });

    it("injects Authorization: Bearer header when tokenStore has token", async () => {
      tokenStore.set("active-bearer-token");

      // Verify request interceptor
      const requestInterceptor = apiClient.interceptors.request as unknown as {
        handlers: Array<{
          fulfilled: (config: { headers: Record<string, string> }) => {
            headers: Record<string, string>;
          };
        }>;
      };

      const handler = requestInterceptor.handlers[0];
      const initialConfig = { headers: {} as Record<string, string> };
      const modifiedConfig = await handler.fulfilled(initialConfig);

      expect(modifiedConfig.headers.Authorization).toBe("Bearer active-bearer-token");
    });

    it("does not inject Authorization header when tokenStore is empty", async () => {
      tokenStore.clear();

      const requestInterceptor = apiClient.interceptors.request as unknown as {
        handlers: Array<{
          fulfilled: (config: { headers: Record<string, string> }) => {
            headers: Record<string, string>;
          };
        }>;
      };

      const handler = requestInterceptor.handlers[0];
      const initialConfig = { headers: {} as Record<string, string> };
      const modifiedConfig = await handler.fulfilled(initialConfig);

      expect(modifiedConfig.headers.Authorization).toBeUndefined();
    });
  });
});
