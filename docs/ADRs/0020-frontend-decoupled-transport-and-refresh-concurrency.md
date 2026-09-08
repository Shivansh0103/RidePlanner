# 20. Frontend Decoupled Transport and Refresh Concurrency Architecture

* Status: Approved
* Date: September 2026

## Context

In an SPA using short-lived in-memory JWT access tokens and rotating HttpOnly refresh cookies (ADR-0017), two critical frontend transport challenges arise:

1. **Circular Interceptor Dependencies**:
   If the primary HTTP client (`apiClient`) intercepts 401 Unauthorized responses by calling an auth API service (`authApi.refresh()`) that itself uses `apiClient`, a circular module dependency is formed. Furthermore, if the refresh call fails with a 401 (e.g. expired cookie), it recursively invokes the 401 interceptor, causing infinite retry loops or fragile URL string inspection.

2. **Refresh Concurrency & Session Family Revocation**:
   The backend implements strict refresh token rotation with active reuse detection (`RefreshTokenService`). If a user opens a dashboard that fires multiple concurrent requests (e.g., `useTrips`, `useReadiness`, `useBudgetSummary`), an expired access token causes all queries to receive 401 simultaneously. If each request sends an independent refresh request with the same cookie, the first request succeeds and rotates the token; subsequent requests present an already-consumed token, triggering backend reuse detection and revoking the entire user session lineage.

## Decision

We decided to establish a **Decoupled Dual-Client Directed Acyclic Graph (DAG) with a Singleton Promise Coordinator**:

1. **Strict Transport DAG (Circular Dependency Elimination)**:
   - **`rawClient` (Level 0)**: Unintercepted base Axios instance. Carries `withCredentials: true` but **never** attaches Bearer tokens and **never** intercepts 401 responses.
   - **`refreshTransport` (Level 1)**: Dedicated unintercepted caller for `POST /api/auth/refresh` using `rawClient`.
   - **`refreshManager` (Level 2)**: Concurrency coordinator importing `refreshTransport` and `tokenStore`. It has **zero dependency** on `apiClient`.
   - **`apiClient` (Level 3)**: Primary intercepted client used across features. Injects `Authorization: Bearer <token>` and delegates 401 retries to `refreshManager`.
   - **Unidirectional flow**: `rawClient` ➔ `refreshTransport` ➔ `refreshManager` ➔ `apiClient` ➔ Feature APIs.

2. **In-Flight Refresh Deduplication Singleton**:
   - `refreshManager.getValidToken()` maintains an `inFlightRefreshPromise` singleton.
   - When multiple 401s occur simultaneously, only the first request initiates `POST /api/auth/refresh`. All subsequent 401s attach to the existing promise.
   - Upon completion, the new access token is stored in `tokenStore` (in-memory closure), waiting requests replay with the new token, and the singleton promise is cleared in a `finally` block.

3. **Deduplicated Session Expiry Event**:
   - If the shared refresh call fails (cookie expired or revoked), `refreshManager` clears `tokenStore` and emits `onSessionExpired` **exactly once**.
   - `AuthProvider` responds by clearing the TanStack query cache (`queryClient.clear()`), transitioning state to `unauthenticated`, displaying a single session expiration toast, and redirecting to `/login`.

## Consequences

### Positive

- **Zero Infinite Loops**: `refreshTransport` cannot trigger 401 response interceptors because it executes via `rawClient`.
- **Session Family Preservation**: Prevents accidental triggering of backend reuse detection during concurrent queries.
- **Clean Developer Experience**: Feature queries and mutations interact only with `apiClient` or TanStack Query hooks without awareness of token rotation internals.

### Negative

- Requires maintaining two configured Axios instances (`rawClient` and `apiClient`).
- Components must rely on `useAuth()` and cannot access the raw in-memory JWT directly.
