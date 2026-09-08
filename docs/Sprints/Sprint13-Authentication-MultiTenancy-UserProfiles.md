# Sprint 13 — Authentication, User-Owned Workspaces & Profiles

**Status:** Completed  
**Sprint:** 13  
**Version target:** v0.13.0  
**Theme:** Identity, authorization, user ownership, and secure session foundations  
**Prerequisite:** Sprint 12 — Obsidian Velocity UI/UX & Telemetry Overhaul

---

## 1. Sprint goal

Transition RidePlanner from an anonymous, single-user development application into a secure, user-owned platform. Each signed-in user must be able to privately own and manage their trips and configure travel defaults, while the existing planning experience remains functionally intact.

Sprint 13 introduces the foundations required for a responsible public cloud launch in Sprint 14:

- email/password registration and sign-in;
- Google sign-in;
- authenticated API access and renewable sessions;
- strict per-user trip ownership and data isolation;
- profile, travel preferences, and one default vehicle profile;
- a consistent Obsidian Velocity authentication experience.

> **Guiding rule:** Authentication proves who a user is. Authorization decides what that user may access. Both must be correct before the application stores real personal travel data in public infrastructure.

---

## 2. Why this sprint matters

Sprints 1–12 established a broad, polished, single-user trip-planning experience: trip lifecycle management, routes and stops, stays, budgets and expenses, checklists, documents, emergency contacts, readiness, summaries, and memories. The present application has no user identity or ownership boundary.

That is appropriate for local development, but it is not suitable for a public service. A deployed anonymous API could otherwise expose travel dates, personal contact numbers, document metadata, accommodation details, expenses, and memories to any caller.

This sprint is intentionally an engineering-learning sprint. It introduces concepts that are central to real production applications:

```text
Identity → claims → authentication → authorization → data isolation
      ↓
sessions → token expiry → refresh-token rotation → secure browser storage
      ↓
schema migrations → integration tests → security regression protection
```

---

## 3. Current baseline

### Confirmed existing architecture

- .NET 10 modular monolith using Clean Architecture.
- Domain, Application, Infrastructure, and API projects.
- EF Core with PostgreSQL migrations, with an in-memory fallback for local development.
- MediatR CQRS, FluentValidation, Unit of Work, RFC 7807 error handling, and API integration tests.
- React 19, TypeScript, Vite, MUI, TanStack Query, React Hook Form, and Zod.
- Current domain model: a `Trip` owns stops, accommodation, budget/expenses, checklist data, documents, emergency contacts, and memories.
- Existing API endpoints are not authenticated and current query paths are not user-scoped.

### Sprint 13 constraints

- Preserve the existing trip-planning behavior and API feature coverage.
- Do not place ASP.NET Identity framework types in the Domain project.
- Do not duplicate a user identifier onto every trip child entity merely for authorization.
- Do not store durable refresh credentials in browser `localStorage` or `sessionStorage`.
- Do not introduce a permanent anonymous-data mode after ownership enforcement is complete.
- Do not treat a global EF Core query filter as the only authorization control.

---

## 4. Target architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│ React SPA                                                        │
│ Login / Register / Google sign-in / Protected routes             │
│ In-memory access token + secure refresh-cookie session recovery  │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS / Bearer JWT
┌──────────────────────────────▼──────────────────────────────────┐
│ RidePlanner API                                                  │
│ ASP.NET Identity · JWT bearer validation · authorization         │
│ ICurrentUserService implementation from authenticated claims     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│ Application layer                                                │
│ Commands and queries use current user context and owner-scoped   │
│ repository operations                                            │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│ PostgreSQL                                                       │
│ ApplicationUser → UserProfile                                   │
│ ApplicationUser → owns Trip → owns all trip-scoped children      │
└─────────────────────────────────────────────────────────────────┘
```

### Ownership model

```text
ApplicationUser
  └── Trip (OwnerUserId)
        ├── TripStop
        ├── Accommodation
        ├── TripBudget
        │     ├── BudgetEstimate
        │     └── Expense
        ├── ChecklistCategory → ChecklistItem
        ├── TripDocument
        ├── EmergencyContact
        └── TripMemory
```

`Trip` is the ownership boundary. Every read or mutation of a trip or one of its descendants must verify that the relevant trip belongs to the authenticated user.

---

## 5. Scope

### In scope

1. ASP.NET Core Identity with `Guid` keys.
2. Email/password registration, sign-in, sign-out, and password-reset workflow.
3. Google external sign-in using a standards-compliant OpenID Connect flow.
4. Short-lived JWT access tokens and rotating refresh tokens.
5. Claims-based API authentication and `[Authorize]` protection of existing business endpoints.
6. `Trip.OwnerUserId` persistence, migrations, ownership enforcement, and legacy-data transition.
7. User profile, default currency, distance unit, and one default vehicle profile.
8. Auth UI, protected routes, session restoration, and settings UI using the existing design system.
9. Unit, application, API integration, and targeted browser-flow coverage.
10. ADRs, setup guidance, threat model, and a learning log for major decisions.

### Explicitly out of scope

- Team/organization workspaces, invitations, and shared-trip roles (Sprint 19).
- Real-time collaboration (Sprint 19).
- Multiple vehicles / full vehicle garage management; Sprint 13 supports one default vehicle profile.
- Avatar file upload and media storage; an optional avatar URL is acceptable.
- Offline persistence of sensitive personal data (Sprint 16, following threat modelling).
- Cloud deployment, managed databases, production observability, and automated release pipelines (Sprint 14).
- Financial currency conversion or exchange-rate support. Currency preference is a default; trip money remains stored in its assigned trip currency.

---

## 6. Architecture decision records

### ADR-0015: Use ASP.NET Core Identity for application identity

**Problem:** RidePlanner needs password handling, external sign-in, claims, and account lifecycle support. Building those primitives manually is error-prone.

**Decision:** Use ASP.NET Core Identity with `ApplicationUser : IdentityUser<Guid>` in Infrastructure. Keep Identity framework types out of Domain.

**Why:** Identity provides reviewed password hashing, account APIs/primitives, security stamps, external-login integration points, and EF Core persistence support.

**Trade-offs:** Identity adds tables and framework conventions. It is more complex than a hand-written `Users` table, but that complexity represents security-critical behavior that should not be reimplemented casually.

**Learning exercise:** Inspect the resulting Identity tables and explain the difference between a password hash, a password, a claim, and a security stamp.

### ADR-0016: Scope user ownership at the Trip aggregate root

**Problem:** Existing trip data is anonymous. A public API must prevent cross-user data access.

**Decision:** Add a required `OwnerUserId` foreign key to `Trip`. Authorize descendants by traversing their parent trip relationship.

**Why:** `Trip` is already the aggregate root for all current planning data. Adding ownership only once avoids redundant columns and inconsistent ownership records.

**Trade-offs:** Some descendant queries require a join or a parent lookup. This cost is appropriate for security-critical access control.

**Learning exercise:** Write an integration test where User B requests User A’s expense through its trip route and confirm a 404 response.

### ADR-0017: Use access JWTs plus rotating, HttpOnly refresh tokens

**Problem:** A browser SPA needs renewable authentication without exposing durable credentials to JavaScript.

**Decision:** Issue a short-lived JWT access token (target: 15 minutes) and store it in memory. Store a rotating refresh token in a `Secure`, `HttpOnly`, appropriately scoped cookie; persist only a hash and metadata of the refresh token server-side.

**Why:** The access token supports an API-first architecture and future mobile clients. The HttpOnly refresh token reduces exposure to token theft through XSS.

**Trade-offs:** Refresh flows, cookie policies, CORS, CSRF considerations, and server-side revocation records increase implementation complexity. This is deliberate learning scope.

**Learning exercise:** Decode a JWT locally, identify its header/payload/signature, then demonstrate why decoding is not signature validation.

### ADR-0018: Use explicit owner-scoped repositories as the primary isolation control

**Problem:** A global query filter can accidentally be bypassed or behave unexpectedly in migrations, administration, background processing, and tests.

**Decision:** Application use cases query resources through owner-scoped methods such as `GetTripForOwnerAsync`. A global filter may be considered later as defence-in-depth, never as the sole authorization mechanism.

**Why:** The authorization boundary remains visible in use cases and testable at the API boundary.

**Trade-offs:** Repository contracts grow slightly. The explicitness is preferable to invisible security behavior.

**Learning exercise:** Compare the SQL/query behavior and failure modes of an explicit owner predicate versus a global filter.

### ADR-0019: Store canonical travel values and snapshot currency at trip level

**Problem:** User display preferences must not silently reinterpret historical distances or money.

**Decision:** Continue storing route distance canonically in kilometres. Store the currency code used by a trip’s budget/money values on the trip or budget. Profile currency is a default for new trips; changing it does not convert historical values.

**Why:** A preference controls presentation/defaults, while business data retains its meaning.

**Trade-offs:** Currency conversion is explicitly deferred. A new trip must choose or inherit a currency.

**Learning exercise:** Explain why displaying an existing `20,000` amount with a different currency symbol is data corruption, not localization.

---

## 7. Data model and migration plan

### New identity and profile records

`ApplicationUser` (Infrastructure):

- `Id: Guid`
- Identity email/user-name fields supplied by ASP.NET Core Identity
- optional `DisplayName`
- optional `AvatarUrl`
- Identity security fields and external-login mapping

`UserProfile`:

- `UserId: Guid` (one-to-one with `ApplicationUser`)
- `PreferredCurrencyCode` (`INR`, `USD`, `EUR`, `GBP` initially)
- `DistanceUnit` (`Kilometers`, `Miles`)
- `DefaultVehicleName`
- `DefaultTankCapacityLitres`
- `DefaultFuelEfficiencyKmPerLitre`
- timestamps

### Existing trip changes

`Trip` gains:

- `OwnerUserId: Guid` required in the finished schema;
- a navigational relationship only where it is useful for Infrastructure mapping, without introducing Identity into Domain;
- trip/budget currency code if the existing data model does not already define one.

### Migration strategy

1. Add Identity and profile tables.
2. Add `OwnerUserId` initially in a migration-safe manner.
3. For a development database with existing anonymous trips, use an explicit one-time legacy-owner assignment path.
4. Backfill each existing trip to the chosen development account.
5. Make `OwnerUserId` non-nullable and index it.
6. Verify no trip has a null or invalid owner.

**Security rule:** Do not ship a predictable seeded password such as `Rider@123`. Development seeding must be opt-in and use an environment-provided secret or an explicitly created local account.

---

## 8. Backend implementation plan

### Phase 1 — Identity, persistence, and account foundation

1. Configure ASP.NET Core Identity and Identity EF Core storage.
2. Introduce `ApplicationUser` and `UserProfile` persistence configuration.
3. Create the ownership/profile migration and verify it against a clean database and legacy local data.
4. Define `ICurrentUserService` in Application:

```csharp
public interface ICurrentUserService
{
    bool IsAuthenticated { get; }
    Guid? UserId { get; }
}
```

5. Implement the API adapter from authenticated claims.
6. Add registration, login, logout, refresh, current-user, password-reset, and profile contracts.

### Phase 2 — Token and external-login flows

1. Configure JWT bearer validation: signing key, issuer, audience, lifetime validation, clock skew.
2. Implement access-token generation with minimal stable claims: subject/user ID, email where required, display name where useful, and token identifier.
3. Implement refresh-token creation, hashing, expiry, rotation, revocation, and reuse detection policy.
4. Configure Google OpenID Connect external login; validate provider configuration, redirect URI, state, and nonce through supported middleware/library flows.
5. Introduce an email sender abstraction for verification/password reset, with a safe development implementation.
6. Add rate limiting to account-sensitive endpoints.

### Phase 3 — Ownership enforcement

1. Add `OwnerUserId` to `Trip` creation and map it from `ICurrentUserService` in the create-trip use case.
2. Replace unscoped trip lookups with owner-scoped access where the request is user-facing.
3. Protect existing controllers with `[Authorize]`.
4. Ensure nested child-resource routes verify the parent trip ownership before any resource operation.
5. Standardize cross-user behavior as `404 Not Found` to avoid resource-existence disclosure.
6. Keep an explicit path for non-HTTP test/setup code only where needed; do not create a public bypass.

### Phase 4 — Profile and vehicle defaults

1. Implement `GetUserProfileQuery` and `UpdateUserProfileCommand` with validation.
2. Add default currency/unit/vehicle values.
3. Apply profile defaults during new-trip and fuel-calculator workflows without changing existing stored values implicitly.
4. Update server-side DTOs, mappings, and API contracts.

### API surface

Suggested endpoint family:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
GET  /api/users/profile
PUT  /api/users/profile
GET  /api/auth/external/google/start
GET  /api/auth/external/google/callback
```

Existing trip and trip-descendant endpoints remain, but require authentication and operate only within the caller’s owned workspace.

### Backend Prerequisites for Frontend Auth Integration (Phase 0)

Before frontend authentication can be verified end-to-end, two specific backend items must be finalized:

1. **`POST /api/auth/logout` endpoint in `AuthController.cs`**:
   - The backend must expose an explicit logout action that reads the `refreshToken` cookie, calls `IRefreshTokenService` to revoke the session lineage, and clears the HttpOnly cookie via `AuthCookieHelper.ClearRefreshTokenCookie(Response, Request.IsHttps)`.
2. **CORS credentials configuration in `Program.cs`**:
   - In lines 23–32 of `Program.cs`, the `"Frontend"` CORS policy must call `.AllowCredentials()`. Otherwise, browser security policies will reject any cross-origin request carrying `withCredentials: true` from the Vite dev server (`http://localhost:5173`) to the API (`http://localhost:5084`).

---

## 9. Frontend Architecture & Implementation Plan

### 9.1 Architectural Overview & Transport Topology

The frontend authentication architecture uses a **Decoupled Dual-Client Memory Token Architecture**. The transport layer cleanly separates unauthenticated refresh/auth calls from intercepted business requests to eliminate circular dependencies, while React state is managed via a strict discriminated union.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              React Tree                                │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                         AppProviders                           │   │
│   │  ┌──────────────────────────────────────────────────────────┐  │   │
│   │  │                       AuthProvider                       │  │   │
│   │  │  - Manages reactive AuthState (discriminated union)      │  │   │
│   │  │  - Orchestrates initial bootstrap (single-step refresh)  │  │   │
│   │  │  - Coordinates with QueryClient cache on user change     │  │   │
│   │  └──────────────────────────────┬───────────────────────────┘  │   │
│   │                                 │                              │   │
│   │  ┌──────────────────────────────▼───────────────────────────┐  │   │
│   │  │                      Protected Router                    │  │   │
│   │  │  - Anonymous routes (/login, /register)                  │  │   │
│   │  │  - Protected routes (/, /trips, /trips/:id)              │  │   │
│   │  │  - Obsidian Velocity Boot Splash Screen                  │  │   │
│   │  └──────────────────────────────────────────────────────────┘  │   │
│   └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────┬──────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Core Transport Layer                            │
│                                                                        │
│   ┌────────────────────────────────┐  ┌─────────────────────────────┐  │
│   │        tokenStore.ts           │  │     refreshManager.ts       │  │
│   │  - In-memory closure token     │  │  - Shared refresh Promise   │  │
│   │  - Zero React render coupling  │  │  - Deduplicates 401 calls   │  │
│   │  - Synchronous getter/setter   │  │  - Single session-expiry evt│  │
│   └───────────────▲────────────────┘  └──────────────▲──────────────┘  │
│                   │                                  │                 │
│                   │                ┌─────────────────┴──────────────┐  │
│                   │                │      refreshTransport.ts       │  │
│                   │                └─────────────────▲──────────────┘  │
│                   │                                  │                 │
│   ┌───────────────┴──────────────────────────────────┼──────────────┐  │
│   │                 apiClient (Intercepted)          │  rawClient   │  │
│   │  - Request interceptor attaches Bearer token     │  (Base HTTP) │  │
│   │  - Response interceptor traps 401 -> delegates   │  (No auth    │  │
│   │    to refreshManager -> retries once             │   intercept) │  │
│   └─────────────────────────────────┬────────────────┴──────┬───────┘  │
└─────────────────────────────────────┼───────────────────────┼──────────┘
                                      │ HTTPS (withCreds)     │
                                      ▼                       ▼
                               RidePlanner Backend API
```

---

### 9.2 Core Transport Architecture & Circular Dependency Prevention

#### The Circular Dependency Risk
A common trap in Axios-based authentication architectures is coupling the main API client with the refresh handler:
```text
[CIRCULAR TRAP]
apiClient (axios.ts) ──> refreshManager.ts ──> authApi.ts ──> apiClient (axios.ts)
```
If `authApi.refresh()` uses the same `apiClient`, the refresh request itself will be processed by `apiClient`'s 401 response interceptor. If the refresh request fails with a 401 (e.g. cookie expired), it can recursively trigger another refresh attempt or create complex interceptor loops.

#### The Architectural Solution: Strict Directed Acyclic Graph (DAG)
We enforce an explicit separation between the unauthenticated base HTTP transport and the intercepted authenticated transport:

1. **`rawClient` (`src/api/rawClient.ts`)**:
   - A base Axios instance configured with `baseURL`, `timeout: 15000`, `headers: { "Content-Type": "application/json" }`, and `withCredentials: true`.
   - Has **NO authentication request interceptor** (never attaches Bearer tokens).
   - Has **NO 401 refresh response interceptor** (errors pass directly through standard RFC 7807 `ApiError` normalization).
2. **`refreshTransport` (`src/api/refreshTransport.ts`)**:
   - A lightweight, unintercepted caller that executes `POST /api/auth/refresh` using `rawClient`.
3. **`refreshManager` (`src/api/refreshManager.ts`)**:
   - A concurrency coordinator that imports `refreshTransport` and `tokenStore`.
   - Manages the shared `inFlightRefreshPromise` singleton. Has **zero dependency on `apiClient`**.
4. **`apiClient` (`src/api/axios.ts`)**:
   - The primary authenticated Axios instance used across all application features.
   - Imports `tokenStore` (to inject `Authorization: Bearer <token>` in the request interceptor).
   - Imports `refreshManager` (to resolve renewed tokens on 401 responses).
5. **Feature APIs & Auth Endpoints**:
   - `authApi.login()` and `authApi.register()` use `rawClient`.
   - `authApi.logout()` and `authApi.getCurrentUser()` use `apiClient`.
   - All domain feature clients (`tripApi`, `budgetApi`, etc.) use `apiClient`.

#### Explicit Dependency Rule
```text
rawClient (Level 0)
    ▲                ▲
    │                │
authApi.login/reg  refreshTransport (Level 1)
                     ▲
                     │
               refreshManager (Level 2)
                     ▲
                     │
                 apiClient (Level 3)
                     ▲
                     │
       Feature APIs (tripApi, etc.) (Level 4)
```
This unidirectional dependency flow completely eliminates circular module dependencies and guarantees that the refresh call can never invoke its own retry interceptor.

---

### 9.3 Memory-Only Access Token Management & Accurate Security Model

#### Token Storage Implementation
The JWT access token is managed strictly in memory via a dedicated module closure (`src/api/tokenStore.ts`):
```ts
let currentAccessToken: string | null = null;

export const tokenStore = {
  get: (): string | null => currentAccessToken,
  set: (token: string | null): void => {
    currentAccessToken = token;
  },
  clear: (): void => {
    currentAccessToken = null;
  },
};
```

#### Accurate Security Review & Threat Boundaries

##### What Memory-Only Storage Provides
- **Zero Durable Persistence**: The access token is never written to `localStorage`, `sessionStorage`, `IndexedDB`, or cookies accessible to JavaScript.
- **Elimination of Offline Exfiltration**: An attacker gaining physical or file-system access to the client machine cannot extract tokens from persistent browser storage.
- **Ephemeral Lifetime**: Full page reloads or tab closures immediately wipe the token from memory.
- **Refresh Token Isolation**: The long-lived refresh credential remains protected inside a `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/api/auth` cookie, completely invisible to JavaScript execution.

##### What Memory-Only Storage Does NOT Provide (XSS Reality)
> **Security Rule:** Memory-only access-token storage reduces persistence and exposure through browser storage but does not eliminate XSS risk. XSS prevention remains a separate security requirement.

If an attacker achieves arbitrary script execution (XSS) within the application origin:
1. The malicious script executes within the same JavaScript execution context.
2. The attacker can invoke authenticated functions via `apiClient` or monkey-patch the DOM network primitives (`window.fetch`, `XMLHttpRequest`) to hijack in-flight requests while the tab is open.
3. Memory-only storage limits the window of opportunity to the active in-memory session (15 minutes), but it does not prevent live script execution. XSS mitigation (strict Content Security Policy, output encoding, React JSX escaping) remains mandatory.

##### Component Boundary Rule
UI components **must never read the raw access token directly**. Components consume `useAuth()`, which exposes only sanitized user identity (`id`, `email`) and auth status, preserving encapsulation and minimizing accidental token logging in React DevTools.

---

### 9.4 Refresh Concurrency & Deduplicated Session Expiry

#### The Backend Constraint: Active Reuse Detection
In `RefreshTokenService.cs`, the backend implements strict refresh-token rotation and family revocation:
```csharp
if (existingToken.IsRevoked)
{
    // REUSE DETECTED: A previously consumed token was presented again.
    // Revoke all active tokens in the entire family/session lineage.
    ...
}
```
If multiple API requests (e.g. `useTrips`, `useReadiness`, `useBudgetSummary`) receive a 401 at the same time and fire independent refresh calls with the same cookie:
1. Request 1 succeeds, rotates the refresh token, and issues Token B.
2. Request 2 presents Token A (which is now revoked).
3. The backend detects token reuse and **revokes the entire session lineage**, destroying the user's session.

Therefore, concurrent refresh deduplication is a **mandatory correctness requirement**.

#### The Concurrency Architecture (`refreshManager.ts`)

```ts
import { refreshTransport } from "./refreshTransport";
import { tokenStore } from "./tokenStore";

class RefreshManager {
  private inFlightRefreshPromise: Promise<string> | null = null;
  private sessionExpiredListeners: Array<() => void> = [];

  public onSessionExpired(listener: () => void): () => void {
    this.sessionExpiredListeners.push(listener);
    return () => {
      this.sessionExpiredListeners = this.sessionExpiredListeners.filter((l) => l !== listener);
    };
  }

  public async getValidToken(): Promise<string> {
    // If a refresh is already in flight, attach to the existing promise
    if (this.inFlightRefreshPromise) {
      return this.inFlightRefreshPromise;
    }

    this.inFlightRefreshPromise = (async () => {
      try {
        const response = await refreshTransport.executeRefresh();
        const newToken = response.accessToken;
        tokenStore.set(newToken);
        return newToken;
      } catch (error) {
        tokenStore.clear();
        this.emitSessionExpired();
        throw error;
      } finally {
        this.inFlightRefreshPromise = null;
      }
    })();

    return this.inFlightRefreshPromise;
  }

  private emitSessionExpired(): void {
    this.sessionExpiredListeners.forEach((fn) => fn());
  }
}

export const refreshManager = new RefreshManager();
```

#### Deduplicated Session Expiry Invariant
> **Invariant:** All concurrent 401 responses must share exactly one refresh execution; a failed refresh must trigger exactly one session-invalidated transition.

When refresh fails (e.g. refresh cookie expired after 30 days or revoked by server):
1. All waiting requests reject with the same error.
2. `emitSessionExpired()` fires **exactly once**.
3. `AuthProvider` reacts to `onSessionExpired`:
   - Transitions state to `unauthenticated`.
   - Clears query cache (`queryClient.clear()`).
   - Emits a single warning toast: *"Your session has expired. Please sign in again."*
   - Navigates to `/login` once.
4. This completely eliminates UI spam (no duplicate notifications, no multiple redirects).

---

### 9.5 Authentication State Machine & Discriminated Union

To guarantee that invalid states cannot exist at compile-time, `AuthState` is represented as a TypeScript discriminated union:

```ts
// features/auth/types/authState.ts

export interface AuthUser {
  id: string;
  email: string;
}

export type AuthState =
  | {
      status: "bootstrapping";
      user: null;
      error: null;
    }
  | {
      status: "authenticated";
      user: AuthUser;
      error: null;
    }
  | {
      status: "unauthenticated";
      user: null;
      error: string | null;
    };
```

#### State Transition Diagram

```text
                       [ SPA Initial Load ]
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │     BOOTSTRAPPING     │
                     │      user: null       │
                     └───────────┬───────────┘
                                 │
                     POST /api/auth/refresh
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
           200 OK (token)                   401 / Network Failure
                 │                               │
                 ▼                               ▼
     ┌───────────────────────┐       ┌───────────────────────┐
     │     AUTHENTICATED     │       │    UNAUTHENTICATED    │
     │   user: AuthUser      │       │      user: null       │
     └───────────▲───────────┘       └───────────▲───────────┘
                 │                               │
                 │   Login Success               │
                 ├───────────────────────────────┤
                 │                               │
                 │   Logout / Refresh Expiry     │
                 └───────────────────────────────┘
```

#### State Transition Rules

| Current State | Event | Trigger / Action | Next State |
| :--- | :--- | :--- | :--- |
| *(None)* | Page Mount | Initialize state. Dispatch `refreshTransport.executeRefresh()`. Router renders `AuthBootSplash`. | `bootstrapping` |
| `bootstrapping` | Refresh Success (200 OK) | Store token in `tokenStore`. Set user to `{ id: res.userId, email: res.email }`. | `authenticated` |
| `bootstrapping` | Refresh Failure (401 / Network Error) | Ensure `tokenStore.clear()`. Set user to `null`. | `unauthenticated` |
| `unauthenticated` | Login Success | Store token in `tokenStore`. Clear cache (`queryClient.clear()`). Set user. | `authenticated` |
| `authenticated` | Logout Triggered | Call `authApi.logout()`. In `finally`: `tokenStore.clear()`, `queryClient.clear()`, remove local items. | `unauthenticated` |
| `authenticated` | Refresh Failed on 401 Retry | `onSessionExpired` fires. `tokenStore.clear()`, `queryClient.clear()`. Toast user. | `unauthenticated` |

---

### 9.6 Application Bootstrap: Single-Step Refresh vs `/me`

#### Architectural Decision: `refresh → authenticated` (Single-Step)
We explicitly decide that **`POST /api/auth/refresh` directly establishes the authenticated session**, without an immediate sequential call to `GET /api/auth/me`.

#### Architectural Rationale (What → Why → How → Tradeoff)
- **What**: On application startup, the SPA issues a single `POST /api/auth/refresh` request carrying the HttpOnly cookie. A 200 response immediately establishes the authenticated state.
- **Why**:
  1. **Data Completeness**: The backend `LoginResponse` returned by `/refresh` already contains all canonical identity fields: `userId`, `email`, `accessToken`, `tokenType`, and `expiresIn`.
  2. **Redundancy of Current `/me`**: The current backend `/api/auth/me` endpoint returns only `{ userId, isAuthenticated }`. Calling `/me` immediately after `/refresh` returns *less* information than `/refresh` just provided (it lacks `email`).
  3. **Performance (Cold-Boot Latency)**: Cold starts require establishing session state before rendering protected pages. A single roundtrip cuts bootstrap latency in half compared to a sequential two-request chain.
  4. **Clean Separation of Profile Data**: Rich user preferences (currency, distance unit, vehicle profile) belong in `GET /api/users/profile` (Sprint 13 Phase 4), which is cached and managed as standard TanStack Query server state, rather than blocking auth bootstrap.
- **How**:
  ```ts
  // AuthProvider bootstrap effect
  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const response = await refreshTransport.executeRefresh();
        if (isMounted) {
          tokenStore.set(response.accessToken);
          setAuthState({
            status: "authenticated",
            user: { id: response.userId, email: response.email },
            error: null,
          });
        }
      } catch {
        if (isMounted) {
          tokenStore.clear();
          setAuthState({ status: "unauthenticated", user: null, error: null });
        }
      }
    }

    bootstrap();
    return () => { isMounted = false; };
  }, []);
  ```
- **Tradeoff**: Does not verify that the Bearer token passes `/me` before rendering. However, because the token was just signed by the server in `/refresh`, validation failure is practically impossible unless system clocks differ wildly. `/api/auth/me` remains available for token verification tests and API integration suites.

---

### 9.7 Axios Interceptor Design & Explicit Request Metadata

#### Avoiding Loose URL Matching
Rather than relying on brittle URL string matching (`url.includes("/auth/refresh")`), request eligibility is controlled through **explicit typed Axios request configuration metadata**:

```ts
// src/api/types.ts
declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean; // Bypasses 401 refresh interception
    _retry?: boolean;          // Guards against multiple retry loops
  }
}
```

#### The `apiClient` Interceptor Implementation

```ts
// src/api/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshManager } from "./refreshManager";
import { tokenStore } from "./tokenStore";
import { ApiError, ProblemDetails } from "./types";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true,
});

// Request Interceptor: Attach in-memory Bearer token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: 401 handling with deduplicated refresh retry
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ProblemDetails | Record<string, unknown>>) => {
    const originalRequest = error.config;

    // Check eligibility: must be a 401, not already retried, and not marked to skip refresh
    const isEligible =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh;

    if (isEligible) {
      originalRequest._retry = true;

      try {
        // Await the shared refresh promise
        const newAccessToken = await refreshManager.getValidToken();

        // Update Authorization header on original request and replay
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Standard RFC 7807 problem details normalization
    return Promise.reject(normalizeApiError(error));
  }
);
```

---

### 9.8 TanStack Query Cache Isolation & Cross-User Invariant

#### The Invariant
> **Invariant:** No authenticated session may inherit server-state cache belonging to another authenticated identity.

#### Trigger Transitions
1. **Explicit User Logout**: User clicks "Sign Out".
2. **Session Invalidation**: 401 encountered and refresh fails (cookie expired or revoked).
3. **Identity Switch**: User A logs out and User B logs in on the same browser session.
4. **Bootstrap Unauthenticated State**: Startup probe reveals no valid session.

#### Strategy Comparison & Recommendation
- *Option A: Scoping all query keys by user ID* (`['trips', userId, ...]`).
  - *Rejected*: Requires rewriting every query key across 10 features; leaves old user data lingering in memory until garbage collection.
- *Option B: Targeted query key invalidation*.
  - *Rejected*: Fragile and prone to developer omission when new feature modules are added.
- *Option C (Recommended): Complete Cache Purge (`cancelQueries()` + `clear()`)*.
  - When session terminates:
    ```ts
    queryClient.cancelQueries(); // Abort in-flight requests
    queryClient.clear();         // Synchronously empty query and mutation caches
    ```
  - **What → Why → How → Tradeoff**:
    - **What**: Wipe the entire QueryClient cache on any logout or identity transition.
    - **Why**: Enforces 100% data isolation across users with zero chance of data leaks and requires zero refactoring of feature query keys.
    - **How**: Invoked synchronously in the logout sequence and session-expired handler.
    - **Tradeoff**: The next signed-in user must fetch fresh data from the API; this is the intended and correct behavior.

---

### 9.9 Protected Routing & Deep-Link Preservation

#### Route Structure in React Router 7
Routes are divided into public authentication routes and protected application routes:

```tsx
// src/app/router/AppRouter.tsx
const router = createBrowserRouter([
  // Public Auth Routes (accessible only when unauthenticated)
  {
    element: <AnonymousRoute />,
    children: [
      { path: "/login", element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
      { path: "/register", element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper> },
    ],
  },

  // Protected Application Routes (requires status === 'authenticated')
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <SuspenseWrapper><HomePage /></SuspenseWrapper> },
          { path: "trips", element: <SuspenseWrapper><TripsPage /></SuspenseWrapper> },
          { path: "trips/new", element: <SuspenseWrapper><CreateTripPage /></SuspenseWrapper> },
          { path: "trips/:tripId", element: <SuspenseWrapper><TripDetailsPage /></SuspenseWrapper> },
          { path: "trips/:tripId/edit", element: <SuspenseWrapper><EditTripPage /></SuspenseWrapper> },
        ],
      },
    ],
  },

  { path: "*", element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> },
]);
```

#### Route Guards
- **`ProtectedRoute`**:
  - If `status === "bootstrapping"`: renders `AuthBootSplash` (suspends UI without redirect).
  - If `status === "unauthenticated"`: redirects to `/login` with `state: { from: location }`.
  - If `status === "authenticated"`: renders `<Outlet />`.
- **`AnonymousRoute`**:
  - If `status === "bootstrapping"`: renders `AuthBootSplash`.
  - If `status === "authenticated"`: redirects to `state.from` (or `/`).
  - If `status === "unauthenticated"`: renders `<Outlet />`.
- **Deep-Link Restoration**:
  When redirecting to `/login`, the complete path and search string (`location.pathname + location.search`) are stored in `location.state.from`. Upon successful login, the application navigates to `location.state?.from ? ... : "/"`.

---

### 9.10 Registration & Automatic Login Resilience

#### The Workflow
`POST /api/auth/register` creates the identity in the database and returns `200 OK` with `{ id, email }`. It does not return a token. To provide a modern onboarding UX, the frontend chains registration into an automatic login:

```text
User submits Registration Form
              │
              ▼
    POST /api/auth/register
              │
              ├─────────────────────────────────────────┐
              ▼                                         ▼
         [ 200 OK ]                               [ Failure ]
    Account created successfully            Display validation errors
              │                             or 409 Conflict alert
              ▼
    POST /api/auth/login (auto)
              │
              ├─────────────────────────────────────────┐
              ▼                                         ▼
         [ 200 OK ]                               [ Failure ]
    Store token in memory                   Account WAS created!
    Navigate to destination                 DO NOT report registration failed!
                                            Display success notification:
                                            "Account created! Please sign in."
                                            Navigate to /login with email prefilled
```

#### Error Handling Rule
If registration succeeds but the automatic login call fails (e.g. transient network drop or temporary lockout):
1. **Never tell the user registration failed**. The account exists in the database.
2. Direct the user to `/login` with an informational notice: *"Account created successfully. Please enter your password to sign in."*
3. Prefill the email field to eliminate retyping.

---

### 9.11 Logout Flow & Local Cleanup Invariant

#### Guaranteed Local Cleanup
Logout involves both a server-side revocation and a client-side purge. The client-side cleanup must execute **regardless of network outcome**:

```ts
// AuthProvider.tsx
const logout = async () => {
  try {
    // Attempt best-effort server-side session revocation & cookie clearing
    await authApi.logout();
  } catch (error) {
    // Log warning; do not interrupt local cleanup
    console.warn("Server logout failed, proceeding with local cleanup:", error);
  } finally {
    // GUARANTEED LOCAL CLEANUP:
    tokenStore.clear();
    queryClient.cancelQueries();
    queryClient.clear();
    localStorage.removeItem("last_active_trip_id");
    setAuthState({ status: "unauthenticated", user: null, error: null });
    navigate("/login", { replace: true });
  }
};
```

**Why**: A network timeout, 500 error, or offline state during sign-out must never leave the user trapped in an authenticated UI state.

---

### 9.12 Multi-Tab Behavior & Scope

#### The Multi-Tab Model
- Each browser tab maintains its own in-memory access token (`tokenStore`).
- All tabs under the same origin share the HttpOnly `refreshToken` cookie.

#### Scenarios & Scope Boundary
1. **Tab A logs out**: The backend revokes the refresh session and clears the cookie. Tab B retains its in-memory access token and can perform actions until that token expires (max 15 minutes). When Tab B attempts a token refresh, the server returns 401, Tab B clears its state and redirects to `/login`.
2. **Tab A refreshes token**: Tab A receives a new access token and the cookie rotates. Tab B will automatically send the updated cookie when it eventually performs its own refresh.
3. **Cross-Tab Synchronization (`BroadcastChannel`)**:
   - Explicitly **out of scope for Sprint 13**.
   - Introducing `BroadcastChannel` or `window.addEventListener('storage')` adds synchronization complexity and race conditions across tabs.
   - The 15-minute access token lifespan establishes a strict, acceptable upper bound for stale tab activity in Sprint 13. Cross-tab session sync will be evaluated in Sprint 14/19.

---

### 9.13 Module & Folder Structure

The authentication feature adheres to the existing RidePlanner feature conventions:

```text
frontend/src/
├── api/
│   ├── rawClient.ts               # Base Axios client (no auth interceptors)
│   ├── refreshTransport.ts        # Dedicated unintercepted caller for POST /refresh
│   ├── refreshManager.ts          # Shared refresh promise & concurrency coordinator
│   ├── tokenStore.ts              # In-memory access token closure
│   ├── axios.ts                   # Primary intercepted apiClient (Bearer + 401 retry)
│   └── types.ts                   # ApiError, ProblemDetails, request config extensions
│
├── app/
│   ├── providers/
│   │   ├── AppProviders.tsx       # Inserts AuthProvider inside QueryClientProvider
│   │   └── queryClient.ts         # QueryClient defaults
│   └── router/
│       ├── AppRouter.tsx          # Public & protected route definitions
│       ├── ProtectedRoute.tsx     # Route guard with bootstrap splash
│       └── AnonymousRoute.tsx     # Route guard for /login & /register
│
└── features/
    └── auth/
        ├── api/
        │   ├── authApi.ts         # Endpoints: login, register, logout, me
        │   └── authKeys.ts        # Query keys: authKeys.me()
        ├── components/
        │   ├── AuthLayout.tsx     # Obsidian Velocity split-screen auth frame
        │   ├── LoginForm.tsx      # React Hook Form + Zod login form
        │   ├── RegisterForm.tsx   # React Hook Form + Zod registration form
        │   ├── UserMenu.tsx       # Dynamic avatar menu in MainLayout sidebar
        │   └── AuthBootSplash.tsx # Branded telemetry loading screen for bootstrap
        ├── context/
        │   ├── AuthContext.ts     # React Context definition
        │   └── AuthProvider.tsx   # State provider handling bootstrap & transitions
        ├── hooks/
        │   ├── useAuth.ts         # Hook exposing { user, status, isAuthenticated, login, logout }
        │   ├── useLogin.ts        # Mutation hook for login
        │   └── useRegister.ts     # Mutation hook for registration
        ├── pages/
        │   ├── LoginPage.tsx      # Routed login page
        │   └── RegisterPage.tsx   # Routed registration page
        ├── schemas/
        │   ├── loginSchema.ts     # Zod schema for login validation
        │   └── registerSchema.ts  # Zod schema for registration validation
        ├── types/
        │   ├── authContracts.ts   # LoginRequest, LoginResponse, RegisterRequest, etc.
        │   └── authState.ts       # Discriminated union AuthState & AuthUser
        └── index.ts               # Public barrel export
```

---

### 9.14 Sprint 12 UI/UX Compatibility & Integration

1. **Obsidian Velocity Auth Styling**:
   - `AuthLayout.tsx` adopts established design tokens: `#121416` Deep Obsidian canvas, `#1a1a1e` elevated card surfaces, `#6366f1` Electric Indigo primary buttons, and JetBrains Mono micro-headers.
   - Desktop: High-impact expedition telemetry brand pane on the left, streamlined card on the right.
   - Mobile: Responsive single-column card with top branding.
2. **MainLayout Profile Widget Integration**:
   - In `frontend/src/layouts/MainLayout.tsx` (lines 460–499), replace the static hardcoded `"Rider One"` box with `UserMenu`.
   - Displays user initial avatar, user email, and an interactive menu containing:
     - User Identity / Email
     - Status indicator: `AUTHENTICATED` (Acid Green telemetry pulse)
     - Profile / Settings link (prepared for Sprint 13 Phase 4)
     - Sign Out button (triggering `logout()`)
3. **Sidebar Telemetry Protection**:
   - `useTrips()` in `MainLayout` is safe because `MainLayout` only renders when `status === "authenticated"` inside `ProtectedRoute`.

---

### 9.15 Refined Implementation Phases

Implementation proceeds in six sequential, test-backed phases:

#### Phase 0 — Backend Prerequisites
- Add `POST /api/auth/logout` endpoint in `AuthController.cs` and `IRefreshTokenService`.
- Add `.AllowCredentials()` to CORS policy `"Frontend"` in `Program.cs`.
- Verify backend endpoint contracts via integration tests.

#### Phase 1 — Transport Security & Core Clients
- Implement `tokenStore.ts` (in-memory access token closure).
- Implement `rawClient.ts` (unintercepted base Axios instance).
- Implement `refreshTransport.ts` (unintercepted POST `/api/auth/refresh` caller).
- Implement `refreshManager.ts` (shared promise singleton & session-expiry event emitter).
- Update `apiClient` in `src/api/axios.ts` with Bearer request interceptor and 401 retry response interceptor.
- Write Vitest tests for `tokenStore`, `refreshManager`, and Axios interceptors.

#### Phase 2 — Auth State & Context
- Implement `authContracts.ts` and `authState.ts` (discriminated union).
- Implement `authApi.ts` using `rawClient` for unauthenticated calls and `apiClient` for authenticated calls.
- Implement `AuthContext.ts` and `AuthProvider.tsx` (bootstrap effect, login, logout, `onSessionExpired` handler).
- Implement `useAuth.ts`, `useLogin.ts`, `useRegister.ts`.
- Integrate `AuthProvider` into `AppProviders.tsx`.

#### Phase 3 — Routing & Protection
- Implement `AuthBootSplash.tsx` (Obsidian Velocity branded loading screen).
- Implement `ProtectedRoute.tsx` and `AnonymousRoute.tsx`.
- Update `AppRouter.tsx` to mount public and protected route branches.
- Verify deep-link preservation (`state.from`) and return navigation.

#### Phase 4 — UI & Obsidian Velocity Integration
- Implement Zod schemas: `loginSchema.ts`, `registerSchema.ts`.
- Implement `LoginForm.tsx`, `RegisterForm.tsx`, `AuthLayout.tsx`.
- Implement `LoginPage.tsx` and `RegisterPage.tsx`.
- Implement `UserMenu.tsx` and integrate into `MainLayout.tsx` (replacing static "Rider One").

#### Phase 5 — Integration & Regression Verification
- Verify multi-user data isolation (User A -> Logout -> User B).
- Verify complete QueryClient cache purging on session termination.
- Verify token renewal on expired access token and single retry.
- Verify concurrent 401 deduplication (multiple simultaneous requests share one refresh).
- Verify registration auto-login resilience when login fails.
- Run full regression test suite across all existing trip planning features.

---

## 10. Security checklist

- [x] Every existing business endpoint requires authenticated access.
- [x] Every trip read/write resolves ownership with the current user.
- [x] Cross-user access returns 404 and makes no data change.
- [x] Passwords are handled exclusively by Identity APIs; passwords never enter logs.
- [x] Refresh tokens are random, hashed at rest, time-limited, rotated, and revocable.
- [x] Refresh cookies use `HttpOnly`, `Secure`, `SameSite=Lax`, and `Path=/api/auth`.
- [x] Access token validation checks issuer, audience, signing key, lifetime, and zero clock skew.
- [x] Memory-only access-token storage reduces persistence and exposure through browser storage; XSS prevention remains enforced via CSP and React escaping.
- [x] Refresh requests are strictly deduplicated on the frontend to prevent backend reuse detection from destroying active session families.
- [x] CORS configuration in backend explicitly allows credentials (`.AllowCredentials()`).
- [x] Client guarantees complete in-memory cleanup (token, query cache, local storage) upon logout, regardless of network success or failure.
- [x] Google sign-in uses registered redirect URIs and trusted provider validation.
- [x] Sensitive auth endpoints are rate-limited.
- [x] Secrets are loaded from local secret/configuration providers, never committed to source control.
- [x] Logs redact `Authorization`, cookies, passwords, reset tokens, and refresh tokens.

---

## 11. Testing and verification

### Backend tests

- Registration validates input and creates an identity/profile correctly.
- Login succeeds only with valid credentials.
- Invalid credentials return a non-enumerating response.
- JWT validation rejects expired, incorrect-issuer, incorrect-audience, and invalid-signature tokens.
- Refresh rotation invalidates the old token and revocation prevents reuse.
- Concurrent refresh calls with same token: exactly one succeeds, second fails with 401.
- Trip creation assigns the authenticated user as owner.
- User A can perform allowed operations on their own trip.
- User B receives 404 for User A’s trip, stop, accommodation, budget/expense, checklist, document, contact, and memory routes.
- Logout endpoint invalidates refresh session and clears cookie.

### Frontend tests

- **Token Store Unit Tests**: `tokenStore.get()`, `set()`, `clear()`.
- **Zod Schema Tests**: `loginSchema`, `registerSchema` validation rules and error messages.
- **Transport & Interceptor Tests**:
  - `apiClient` attaches `Authorization: Bearer <token>` when token is present.
  - `apiClient` skips `Authorization` header when `tokenStore` is empty.
  - `rawClient` never attaches `Authorization` header and never intercepts 401s.
  - Single 401 response triggers token refresh and retries original request once.
  - Repeated 401 does not trigger infinite refresh loop (`_retry` guard).
  - Multiple concurrent 401 requests trigger **exactly one** refresh HTTP request.
  - Failed refresh triggers **exactly one** session-invalidated event and rejects all waiting requests.
- **State & Provider Tests**:
  - Bootstrap with valid cookie transitions state to `authenticated` using `/refresh` response.
  - Bootstrap with invalid cookie transitions state to `unauthenticated`.
  - Logout clears access token, cancels queries, and purges QueryClient cache.
  - `onSessionExpired` transitions state to `unauthenticated` and purges cache.
- **Router Tests**:
  - Unauthenticated access to `/trips` redirects to `/login` with `state.from`.
  - Authenticated user visiting `/login` redirects to `/` or `state.from`.
  - Bootstrapping state displays `AuthBootSplash` without redirecting.
- **UI Component Tests**:
  - `LoginForm` displays form-level alert on 401 credentials error.
  - `RegisterForm` displays field-level errors on validation failure.
  - `RegisterForm` auto-login failure notifies user of account creation and redirects to `/login`.
  - `UserMenu` displays real user email and executes logout.

### Manual verification matrix

| Scenario | Expected result |
| --- | --- |
| Anonymous visit to `/trips` | Redirect to sign-in; deep link preserved in state |
| Successful login from deep link | Returns immediately to the originally requested trip route |
| New account registration | Account created, automatically logged in, enters private workspace |
| Registration succeeds, auto-login fails | Toast explains account was created; redirects to `/login` with email prefilled |
| User A creates a trip | Trip is visible only to User A |
| User B opens User A’s known trip URL | UI cannot load it; API returns 404 |
| Access token expires during planning | Transparent background refresh renews token; in-flight request replays seamlessly |
| Multiple queries fail with 401 at once | Exactly one refresh request is sent; all queries succeed; session family preserved |
| Refresh token expired (30 days) | Session invalidates once; single toast notification; redirects to `/login` |
| User clicks Logout | Backend session revoked, cookie cleared, memory token wiped, query cache emptied |
| User B signs in after User A logs out | Zero data or telemetry from User A remains in cache or UI |
| Browser tab refreshed | Cold boot calls `/refresh`; brief splash screen; session restored smoothly |

---

## 12. Learning plan and architectural reasoning

For every major architectural decision, we record the **What → Why → How → Tradeoff** framework to support engineering design reviews and interview explanations:

### 1. Memory-Only Access Token Storage
- **What**: Storing the short-lived JWT access token in a private JavaScript module closure (`tokenStore.ts`) rather than browser storage.
- **Why**: Prevents durable credential theft via malicious browser extensions or persistent XSS payloads reading `localStorage`.
- **How**: Module closure variable `let currentAccessToken: string | null = null;` accessed via synchronous getter/setter.
- **Tradeoff**: Token is wiped on full page reload or tab closure. Session restoration relies on a silent refresh probe during bootstrap.

### 2. HttpOnly Refresh Cookies with Strict Path Scoping
- **What**: Storing the long-lived refresh credential in a `Secure`, `HttpOnly`, `SameSite=Lax` cookie scoped to `Path=/api/auth`.
- **Why**: The refresh token cannot be read by JavaScript under any circumstances. Path scoping ensures the cookie is only transmitted during auth requests, minimizing CSRF attack surface on business endpoints.
- **How**: Set by ASP.NET Core `AuthCookieHelper` upon successful login/refresh; sent automatically by browser with `withCredentials: true`.
- **Tradeoff**: Requires explicit CORS credentials handling (`.AllowCredentials()`) and careful cross-origin local development setup.

### 3. Strict Refresh Token Rotation & Reuse Detection
- **What**: Every `/refresh` call invalidates the presented refresh token and issues a new one. Presenting an already-consumed token triggers instant revocation of the entire session lineage.
- **Why**: Detects and neutralizes refresh-token theft. If an attacker and legitimate client both attempt to use the same token, the entire family is revoked.
- **How**: Entity Framework Core tracks `TokenHash`, `ReplacedByTokenHash`, and `FamilyId`. If `existingToken.IsRevoked`, all tokens sharing `FamilyId` are marked revoked.
- **Tradeoff**: Concurrent requests on the client will trigger reuse detection if the client does not strictly deduplicate refresh operations.

### 4. Concurrency Deduplication via Shared Promise
- **What**: A singleton promise manager (`refreshManager.ts`) ensuring only one `/api/auth/refresh` request executes concurrently.
- **Why**: Solves the correctness and security issue caused by backend token rotation. Without deduplication, simultaneous 401s from dashboard queries would destroy the user's session family.
- **How**: If `inFlightRefreshPromise` exists, subsequent 401s attach to it; the promise is reset to `null` in a `finally` block once settled.
- **Tradeoff**: All waiting requests are temporarily blocked until the single refresh completes.

### 5. Transport Separation: `rawClient` vs `apiClient`
- **What**: Separating unintercepted HTTP transport (`rawClient`) from intercepted business transport (`apiClient`).
- **Why**: Completely eliminates circular module dependencies (`axios` -> `refreshManager` -> `authApi` -> `axios`) and ensures refresh calls cannot trigger 401 interceptor loops.
- **How**: `rawClient` handles unauthenticated endpoints; `refreshTransport` uses `rawClient`; `apiClient` uses `refreshManager` and `tokenStore`.
- **Tradeoff**: Maintains two Axios instances in the codebase instead of one.

### 6. Discriminated Union Auth State
- **What**: Representing authentication state as `{ status: 'bootstrapping' } | { status: 'authenticated', user } | { status: 'unauthenticated', error }`.
- **Why**: Eliminates impossible states (e.g. `isLoading: false, isAuthenticated: true, user: null`) at compile-time.
- **How**: TypeScript discriminated union evaluated in `AuthProvider` and consumed via `useAuth()`.
- **Tradeoff**: Requires narrowing state before accessing `user` in components.

### 7. Single-Step Bootstrap via `/refresh`
- **What**: Using the successful response from `POST /api/auth/refresh` to establish the authenticated session directly without calling `/api/auth/me`.
- **Why**: Halves cold-boot network latency (1 roundtrip instead of 2); `/refresh` already returns canonical `userId` and `email`.
- **How**: Bootstrap effect calls `refreshTransport.executeRefresh()` and sets `authenticated({ id: res.userId, email: res.email })`.
- **Tradeoff**: Does not verify token against `/me` before rendering. Profile preferences are cleanly deferred to standard query cache (`/api/users/profile`).

### 8. TanStack Query Complete Cache Purging
- **What**: Calling `queryClient.cancelQueries()` and `queryClient.clear()` on any session termination or identity transition.
- **Why**: Enforces the invariant that no session inherits another user's cached server state, with zero need to rewrite feature query keys.
- **How**: Executed synchronously in `logout()` and `onSessionExpired`.
- **Tradeoff**: Subsequent sign-in must fetch fresh data from the server.

### 9. Guaranteed Local Logout Cleanup
- **What**: Executing client token, cache, and local storage clearing in a `finally` block during sign-out.
- **Why**: A server error or network failure during logout must never trap the user in an authenticated state.
- **How**: `try { await authApi.logout(); } finally { tokenStore.clear(); queryClient.clear(); navigate('/login'); }`.
- **Tradeoff**: The server session might remain active until expiry if the server call fails, but the client is safely decommissioned.

### 10. Registration Auto-Login Resilience
- **What**: Chaining `POST /register` into automatic `POST /login`, with dedicated error recovery if the login step fails.
- **Why**: Provides smooth onboarding without lying to the user if the login step encounters a transient network issue.
- **How**: If `/register` succeeds but `/login` fails, notify user that account was created and navigate to `/login` with email prefilled.
- **Tradeoff**: Two network requests during sign-up instead of one.

---

## 13. Documentation deliverables

- [x] ADR: ASP.NET Core Identity boundary and placement (ADR-0015).
- [x] ADR: Trip aggregate ownership model (ADR-0016).
- [x] ADR: Access/refresh token session strategy (ADR-0017).
- [x] ADR: Explicit owner-scoped repositories (ADR-0018).
- [x] ADR: Canonical travel values and currency snapshot (ADR-0019).
- [x] ADR: Frontend Decoupled Transport & Concurrency Architecture (ADR-0020).
- [x] ADR: External Identity (Google OIDC) & Proof-of-Control Account Linking (ADR-0021).
- [x] ADR: Authentication Endpoint Rate Limiting Strategy (ADR-0022).
- [x] Local setup guide for Identity, JWT, Google, and email environment configuration.
- [x] Production configuration handoff for Sprint 14.
- [x] Updated architecture/domain/data-model documentation.
- [x] Updated API documentation with authentication requirements and problem-response behavior.
- [x] Updated changelog/version/readme after completion.
- [x] Sprint learning log with decision evidence and verification results.

---

## 14. Definition of done

Sprint 13 is complete only when all of the following are true:

### Functional

- [x] A user can register, sign in, sign out, recover/reset a password, and sign in through Google where configured.
- [x] Registration automatically logs the user in on success, with safe fallback to `/login` if auto-login fails.
- [x] A signed-in user has a private workspace and can use all existing RidePlanner feature flows.
- [x] Existing user-facing trip and child-resource API endpoints are authenticated.
- [x] Profile preferences and one default vehicle profile persist and influence intended defaults.

### Security

- [x] No anonymous caller can access planning data.
- [x] No user can read, infer, update, or delete another user’s data.
- [x] Access token is stored strictly in memory; refresh token is stored in an HttpOnly, Secure cookie.
- [x] Refresh concurrency deduplication is proven by automated tests; concurrent 401s do not trigger session family revocation.
- [x] QueryClient cache is completely purged on logout and identity transition.
- [x] Local cleanup executes reliably even when server logout network request fails.
- [x] Tokens, secrets, and credentials follow the security checklist.

### Engineering quality

- [x] Transport layer enforces strict unidirectional DAG dependency flow (no circular dependencies).
- [x] Domain remains independent of ASP.NET Identity and HTTP infrastructure.
- [x] Existing tests remain green and new identity/isolation tests are added.
- [x] Frontend build, lint, and test suite pass.
- [x] API integration tests include at least two distinct authenticated users.
- [x] Documentation and ADRs describe the final—not merely planned—implementation.

### Learning

- [x] Each ADR includes rationale and trade-offs.
- [x] Each major technical decision has a verification exercise.
- [x] The developer can explain the authentication, session, ownership, and browser-security model without relying on generated code.

---

## 15. Key decisions to confirm before implementation

1. **Backend Prerequisites**: Confirm implementation of `POST /api/auth/logout` and addition of `.AllowCredentials()` to CORS in `Program.cs` before frontend Phase 1 begins.
2. **Approved Legacy Development Account**: Confirm which development account receives existing anonymous local trips during the one-time legacy-data migration.
3. **Google Sign-in Timing**: Begin with email/password foundation; confirm whether Google sign-in is executed in Sprint 13 Phase 2 or deferred to Sprint 14.
4. **Initial Default Vehicle Profile**: Confirm that one default vehicle profile is sufficient, with a multiple-vehicle garage deferred.
5. **Sprint 14 Hosting Topology**: Confirm same-site reverse proxy vs separate origins to validate final cookie domain and CORS settings.

---

## 16. Sprint success statement

Sprint 13 succeeds when RidePlanner stops being a shared anonymous local application and becomes a secure, user-owned planning platform—while its implementation leaves the developer with a practical understanding of identity, sessions, authorization, data isolation, migrations, and security testing.

---

## 17. Frontend Authentication — Final Architectural Decisions

### Summary Decision Matrix

| Architectural Area | Final Decision | Core Rationale |
| :--- | :--- | :--- |
| **Access Token Storage** | In-Memory Module Closure (`tokenStore.ts`) | Eliminates persistent storage exposure (no localStorage/sessionStorage); fast synchronous access for Axios interceptors without React re-render overhead. |
| **Refresh Token Storage** | `HttpOnly`, `Secure`, `SameSite=Lax` Cookie (`Path=/api/auth`) | Inaccessible to JavaScript; protects refresh credential against XSS token exfiltration; path scoping limits transmission to auth endpoints. |
| **XSS Security Scope** | Persistence reduction only (not full XSS immunity) | Accurately acknowledges that in-memory tokens eliminate offline persistence but active in-memory XSS payloads can still execute authenticated calls during tab lifetime. |
| **Auth State Model** | TypeScript Discriminated Union (`AuthState`) | Eliminates impossible states (`isLoading: false, isAuthenticated: true, user: null`) at compile time; provides exhaustive type narrowing. |
| **Application Bootstrap** | Single-step `POST /api/auth/refresh` -> Authenticated | Halves cold-boot startup latency; `LoginResponse` already contains `userId` and `email`; avoids redundant `/me` call that currently lacks email. |
| **Transport Architecture** | Dual-Client DAG (`rawClient` vs `apiClient`) | Completely eliminates circular dependencies (`axios` -> `refreshManager` -> `authApi` -> `axios`); prevents refresh requests from triggering 401 interceptor loops. |
| **Refresh Concurrency** | Singleton Shared Promise (`refreshManager.ts`) | Mandatory correctness requirement: prevents concurrent 401s from sending duplicate refresh tokens and triggering backend session family revocation. |
| **Session Expiry UX** | Deduplicated `onSessionExpired` Event | Prevents multiple concurrent 401 failures from emitting duplicate toast notifications, redundant state transitions, or redirect loops. |
| **401 Interceptor Rules** | Explicit Request Metadata (`skipAuthRefresh`, `_retry`) | Replaces brittle URL string matching with explicit, typed request configuration flags. |
| **Query Cache Isolation** | Full Purge (`cancelQueries()` + `clear()`) | Enforces invariant that no session inherits another user's cache; requires zero refactoring of existing feature query keys. |
| **Protected Routing** | Layout-Based Route Guards (`ProtectedRoute`) | Centralized protection with deep-link preservation (`state.from`) and Obsidian Velocity telemetry boot splash (`AuthBootSplash`). |
| **Registration UX** | Chained Auto-Login with Graceful Fallback | Modern onboarding UX; if auto-login fails after successful registration, notifies user of account creation and redirects to `/login` without falsely reporting failure. |
| **Logout Semantics** | Guaranteed Local Cleanup in `finally` Block | Network failure during logout must never trap the user in an authenticated state; local tokens and cache are purged unconditionally. |
| **Multi-Tab Sync** | Deferred (Out of Scope for Sprint 13) | Avoids premature cross-tab complexity (`BroadcastChannel`); 15-minute token lifespan provides a safe upper bound on stale tab activity. |

### Final Transport & State Architecture Diagram

```text
                                 React Application
                                         │
                                         ▼
                             ┌───────────────────────┐
                             │     AppProviders      │
                             │   (Theme, Error)      │
                             └───────────┬───────────┘
                                         │
                                         ▼
                             ┌───────────────────────┐
                             │  QueryClientProvider  │
                             └───────────┬───────────┘
                                         │
                                         ▼
                             ┌───────────────────────┐
                             │     AuthProvider      │
                             │ (Bootstrap / State)   │
                             └───────────┬───────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
     ┌───────────────────────┐                       ┌───────────────────────┐
     │   Protected Router    │                       │  tokenStore (Memory)  │
     │  - ProtectedRoute     │                       │  - Private JWT store  │
     │  - AnonymousRoute     │                       │  - Zero persistence   │
     │  - Obsidian Splash    │                       └───────────▲───────────┘
     └───────────┬───────────┘                                   │
                 │                                               │
                 ▼                                               │
     ┌───────────────────────┐                                   │
     │    TanStack Query     │                                   │
     │  - enabled: isAuth    │                                   │
     │  - clear() on logout  │                                   │
     └───────────┬───────────┘                                   │
                 │                                               │
                 ▼                                               │
     ┌───────────────────────────────────────────────────────────┴───────────┐
     │                      apiClient (Intercepted)                          │
     │                                                                       │
     │  Request:  Attaches Authorization: Bearer <token>                     │
     │  Response: On 401 -> Delegates to refreshManager -> Retries once      │
     └───────────────────────────────────┬───────────────────────────────────┘
                                         │
                                         ▼
                             ┌───────────────────────┐
                             │    refreshManager     │
                             │ (Shared Promise Lock) │
                             └───────────┬───────────┘
                                         │
                                         ▼
                             ┌───────────────────────┐
                             │   refreshTransport    │
                             │ (Dedicated Caller)    │
                             └───────────┬───────────┘
                                         │
                                         ▼
                             ┌───────────────────────┐
                             │ rawClient (Base HTTP) │
                             │ (No Auth Interceptors)│
                             └───────────┬───────────┘
                                         │ POST /api/auth/refresh
                                         │ (HttpOnly Cookie: refreshToken)
                                         ▼
                             ┌───────────────────────┐
                             │  RidePlanner Backend  │
                             │     ASP.NET Core      │
                             └───────────────────────┘
```


