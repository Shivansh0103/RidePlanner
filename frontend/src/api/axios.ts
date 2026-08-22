import axios, { AxiosError } from "axios";

import { ApiError, type ProblemDetails } from "./types";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ProblemDetails | Record<string, unknown>>) => {
    // Case 1: No response received (Network error, offline, timeout, CORS)
    if (!error.response) {
      const isTimeout =
        error.code === "ECONNABORTED" ||
        (error.message && error.message.toLowerCase().includes("timeout"));

      return Promise.reject(
        new ApiError({
          message: isTimeout
            ? "Request timed out. Please try again."
            : "Unable to connect to the server. Please check your network connection.",
          status: 0,
          title: isTimeout ? "Request Timeout" : "Network Error",
          isNetworkError: true,
          raw: error,
        })
      );
    }

    // Case 2: Server responded with an HTTP error status (4xx / 5xx)
    const { status, data } = error.response;
    const problem = data as ProblemDetails | undefined;

    // Support legacy { Error: "..." } or standard { error: "..." } format if present
    const legacyError =
      typeof data === "object" && data !== null
        ? ((data as { Error?: string }).Error ??
          (data as { error?: string }).error)
        : undefined;

    const title =
      problem?.title ||
      (status >= 500 ? "Server Error" : "Request Failed");
    const detail = problem?.detail || legacyError;
    const errors = problem?.errors;

    // Pick best message for the default Error.message
    let message = detail || title;
    if (errors && Object.keys(errors).length > 0) {
      const firstField = Object.keys(errors)[0];
      const firstError = errors[firstField]?.[0];
      if (firstError) {
        message = firstError;
      }
    }

    return Promise.reject(
      new ApiError({
        message,
        status,
        title,
        detail,
        errors,
        raw: data,
      })
    );
  }
);