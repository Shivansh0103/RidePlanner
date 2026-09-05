import axios from "axios";

import { normalizeApiError } from "./types";

/**
 * Unintercepted base Axios instance.
 *
 * Used for:
 * 1. Unauthenticated auth endpoints (POST /auth/login, POST /auth/register).
 * 2. Token refresh calls (POST /auth/refresh) in refreshTransport.
 *
 * Architectural Rule:
 * This client NEVER carries an Authorization header and NEVER intercepts 401s.
 * This guarantees a strict Directed Acyclic Graph (DAG) and prevents circular
 * refresh loops.
 */
export const rawClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

rawClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error))
);
