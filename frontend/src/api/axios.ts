import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { refreshManager } from "./refreshManager";
import { tokenStore } from "./tokenStore";
import { normalizeApiError } from "./types";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

// 1. Request Interceptor: Attach in-memory Bearer token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: 401 handling with deduplicated refresh retry
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Determine eligibility for refresh handling:
    // - Must have received a 401 response
    // - Must have an original request configuration
    // - Must NOT have been retried already (_retry flag)
    // - Must NOT be marked to skip auth refresh (skipAuthRefresh)
    const isEligible =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh;

    if (isEligible) {
      originalRequest._retry = true;

      try {
        // Await the shared refresh promise (deduplicated across concurrent 401s)
        const newAccessToken = await refreshManager.getValidToken();

        // Update Authorization header on original request and replay
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(normalizeApiError(refreshError));
      }
    }

    // Standard RFC 7807 problem details normalization
    return Promise.reject(normalizeApiError(error));
  }
);