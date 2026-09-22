# Sprint 14.5 — Production Polish, Public Landing, Theme System & OAuth Hardening

**Status:** In Planning / Prepared  
**Sprint:** 14.5  
**Version Target:** v0.14.5  
**Theme:** Production reliability, user onboarding, multi-theme architecture, Google OAuth stabilization, and frontend resilience  
**Prerequisites:** Sprint 14 — Production Readiness & First Cloud Deployment  

---

## 1. Sprint Goal

Transition RidePlanner from its initial public cloud deployment into an **accessible, visually versatile, resilient, and fully operational production experience**.

Sprint 14 established the core cloud infrastructure: multi-stage Docker containerization on Google Cloud Run, edge hosting on Vercel with `/api/*` rewrites, managed Neon PostgreSQL with persistent Data Protection keys, keyless GitHub Actions CI/CD with canary traffic migration, and structured correlation logging.

However, a comprehensive production audit of the live deployment (`https://ride-planner-sand.vercel.app`) identified **11 concrete functional, operational, and UX gaps** that prevent calling the production experience complete.

Sprint 14.5 systematically resolves all 11 audit findings **without adding unnecessary infrastructure complexity** (no Redis, no Kubernetes, no microservices) and **without premature Phase 2 scope leakage** (deferring Weather, Elevation, PWA, and offline storage strictly to Sprints 15–16).

---

## 2. Why This Sprint Matters

Sprint 14 answered: *"Can we ship and run the application in the cloud?"*  
Sprint 14.5 answers: *"Can a real user discover, explore, authenticate, and reliably use the application in the real world?"*

```text
Visitor arrives at ride-planner-sand.vercel.app
       ↓
[AUDIT-02] High-impact Public Landing Page (Visual overview, telemetry preview, clear CTAs)
       ↓
Authenticates via Email/Password OR [AUDIT-01] 1-Click Google OAuth
       ↓
Enters Expedition Dashboard in Preferred Theme [AUDIT-03] (Dark / Light / System)
       ↓
Views Interactive Google Map [AUDIT-04] with Waypoints & Routes
       ↓
Enjoys Resilient Backend [AUDIT-05] with Neon Connection Retries & Hardened Recovery UX
```

---

## 3. Comprehensive Production Audit Findings & Root Causes (All 11 Items)

Every item below is supported by empirical evidence from the live production deployment and repository code:

### 3.1 AUDIT-01: Google OAuth Inoperable in Production (`invalid_client` & Reverse-Proxy Desync)
* **Severity:** **P0**
* **Evidence:**
  * [DependencyInjection.cs](file:///d:/Coding/RidePlanner/backend/RidePlanner/RidePlanner.Infrastructure/DependencyInjection.cs#L81-L95)
  * [ProductionConfigurationValidator.cs](file:///d:/Coding/RidePlanner/backend/RidePlanner/RidePlanner.Api/Common/ProductionConfigurationValidator.cs#L46-L56)
  * [Program.cs](file:///d:/Coding/RidePlanner/backend/RidePlanner/RidePlanner.Api/Program.cs#L89-L96)
  * [vercel.json](file:///d:/Coding/RidePlanner/frontend/vercel.json#L2-L11)
  * **Live Verification:** `GET https://ride-planner-sand.vercel.app/api/auth/external/google/start` returns 302 with `client_id=development-placeholder-google-client-id` and `redirect_uri=https://rideplanner-api-73286917441.asia-southeast1.run.app/signin-google`.
* **Root Causes:**
  1. `Authentication:Google:ClientId` and `ClientSecret` are missing from Cloud Run / Secret Manager.
  2. `ProductionConfigurationValidator.cs` skips validation when credentials are null/empty, allowing `DependencyInjection.cs` to default to development placeholders.
  3. `ForwardedHeadersOptions` in `Program.cs` omits `ForwardedHeaders.XForwardedHost`, causing ASP.NET Core to construct the redirect URI using the direct Cloud Run host rather than the public Vercel domain.
  4. Google OAuth handler defaults to `CallbackPath = "/signin-google"`, which is not matched by `vercel.json` (`/api/:path*`), resulting in an SPA fallback (`index.html`) on callback.
  5. Correlation and refresh cookies set on `run.app` cannot be sent by the browser to `vercel.app` due to cross-origin cookie restrictions.
* **Impact:** Any user clicking "Sign in with Google" is blocked by Google `Error 401: invalid_client`. Even with valid credentials, host desync and cookie domain mismatches trigger "Correlation failed" errors.
* **Action:** Configure `options.CallbackPath = "/api/signin-google"`, enable `ForwardedHeaders.XForwardedHost`, validate non-empty production credentials at startup, inject credentials into Cloud Run, and register `https://ride-planner-sand.vercel.app/api/signin-google` in Google Cloud Console.

---

### 3.2 AUDIT-02: Missing Public Unauthenticated Homepage / Root Route Bounces to Login
* **Severity:** **P1**
* **Evidence:**
  * [AppRouter.tsx](file:///d:/Coding/RidePlanner/frontend/src/app/router/AppRouter.tsx#L112-L132)
  * [ProtectedRoute.tsx](file:///d:/Coding/RidePlanner/frontend/src/app/router/ProtectedRoute.tsx#L14-L16)
  * [HomePage.tsx](file:///d:/Coding/RidePlanner/frontend/src/shared/pages/HomePage.tsx#L30-L50)
* **Root Causes:** The root URL (`/`) is nested directly under `<ProtectedRoute />`. When an unauthenticated visitor accesses `https://ride-planner-sand.vercel.app/`, `ProtectedRoute` immediately bounces them to `/login`. Furthermore, `HomePage.tsx` is an internal dashboard (querying trips, readiness, accommodations) rather than a product landing page.
* **Impact:** First-time visitors and portfolio reviewers cannot see what RidePlanner is or what it does; the application appears as an internal login gate.
* **Action:** Build a public `LandingPage.tsx` with hero messaging, Bento feature overview, and Sign In / Register CTAs. Update `AppRouter.tsx` so unauthenticated visitors see `LandingPage` at `/` while authenticated riders access the cockpit.

---

### 3.3 AUDIT-03: Hardcoded Dark Mode Palette & Lack of Multi-Theme System
* **Severity:** **P1**
* **Evidence:**
  * [theme.ts](file:///d:/Coding/RidePlanner/frontend/src/app/theme/theme.ts#L3-L58)
  * [AppProviders.tsx](file:///d:/Coding/RidePlanner/frontend/src/app/providers/AppProviders.tsx#L18)
  * [MainLayout.tsx](file:///d:/Coding/RidePlanner/frontend/src/layouts/MainLayout.tsx#L468)
  * [SettingsPage.tsx](file:///d:/Coding/RidePlanner/frontend/src/features/profile/pages/SettingsPage.tsx#L46-L54)
* **Root Causes:** `theme.ts` exports a static MUI theme with `mode: "dark"`. There is no theme context, no support for Light or System mode, and no theme settings in the UI. Additionally, layout containers use hardcoded dark hex codes (`#121416`, `#141824`, `#18181b`) rather than theme palette tokens.
* **Impact:** Riders planning trips outdoors in bright sunlight suffer poor legibility due to glare.
* **Action:** Implement `ThemeModeProvider` (`'dark' | 'light' | 'system'`) with `localStorage` persistence, create an Obsidian Light palette (slate/titanium tones with dark ink typography), refactor layout hex codes to semantic tokens, and expose theme selection in Settings and User Menu.

---

### 3.4 AUDIT-04: Google Maps Missing API Key in Production Vercel Environment
* **Severity:** **P1**
* **Evidence:**
  * [Map.tsx](file:///d:/Coding/RidePlanner/frontend/src/shared/maps/Map.tsx#L23-L25)
  * [Map.tsx](file:///d:/Coding/RidePlanner/frontend/src/shared/maps/Map.tsx#L99-L105)
  * [frontend/.env](file:///d:/Coding/RidePlanner/frontend/.env#L2-L3)
* **Root Causes:** `frontend/.env` is git-ignored. In Vercel's project settings, `VITE_GOOGLE_MAPS_API_KEY` was not configured at build time. `Map.tsx` evaluates `!apiKey` and displays `MapFallback` with `"Google Maps API key is not configured."`.
* **Impact:** Production users cannot interact with the map, view route polylines, or view visual stop markers.
* **Action:** Restrict the Google Maps API key in Google Cloud Console by HTTP referrer (`https://ride-planner-sand.vercel.app/*` and `http://localhost:5173/*`), restrict API scope to Maps JavaScript and Places API, and set `VITE_GOOGLE_MAPS_API_KEY` in Vercel project environment variables.

---

### 3.5 AUDIT-05: Missing Production Database Connection Resiliency for Serverless Neon PostgreSQL
* **Severity:** **P1**
* **Evidence:**
  * [DependencyInjection.cs](file:///d:/Coding/RidePlanner/backend/RidePlanner/RidePlanner.Infrastructure/DependencyInjection.cs#L35-L37)
* **Root Causes:** EF Core database registration `options.UseNpgsql(connectionString)` omits `EnableRetryOnFailure()`. Neon PostgreSQL auto-suspends compute instances after inactivity and resumes in 500ms–2000ms upon new connections.
* **Impact:** When Neon wakes from sleep, the initial TCP handshake or SSL negotiation can experience transient socket timeouts, immediately returning 500 Internal Server Errors to users.
* **Action:** Configure Npgsql execution strategy:
  `npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 3, maxRetryDelay: TimeSpan.FromSeconds(5), errorCodesToAdd: null)`.

---

### 3.6 AUDIT-06: Missing Production Transactional Email Provider (Password Reset Delivery Blocked)
* **Severity:** **P1**
* **Evidence:**
  * [ForgotPasswordForm.tsx](file:///d:/Coding/RidePlanner/frontend/src/features/auth/components/ForgotPasswordForm.tsx#L70-L76)
  * [DevelopmentEmailSender.cs](file:///d:/Coding/RidePlanner/backend/RidePlanner/RidePlanner.Infrastructure/Notifications/DevelopmentEmailSender.cs#L25-L37)
  * [DependencyInjection.cs](file:///d:/Coding/RidePlanner/backend/RidePlanner/RidePlanner.Infrastructure/DependencyInjection.cs#L132)
* **Root Causes:** In `DependencyInjection.cs`, `IEmailSender` is unconditionally registered as `DevelopmentEmailSender`. When users in production trigger password recovery, the reset link is written to Cloud Run stdout (`[PRODUCTION DEMO SENDER]`), but no actual email is transmitted over the wire.
* **Impact:** Production users cannot self-service reset forgotten passwords; emails are never delivered.
* **Action:** Integrate a production transactional email sender (supporting Resend HTTP REST API as modern default and standard SMTP fallback) with a responsive, branded HTML password reset template. Inject email credentials into Cloud Run / Secret Manager and validate non-empty configuration in `ProductionConfigurationValidator.cs`. Fallback to `DevelopmentEmailSender` in local development when unconfigured.

---

### 3.7 AUDIT-07: Public Health Check Route Under `/api` Prefix [SKIPPED — UNNECESSARY]
* **Severity:** **P2 (Skipped)**
* **Status:** **SKIPPED / UNNECESSARY**
* **Evaluation & Decision:** Native `/health` (in-memory liveness) and `/ready` (Neon PostgreSQL connectivity readiness) endpoints already exist directly on the Cloud Run backend ([HealthCheckExtensions.cs](file:///d:/Coding/RidePlanner/backend/RidePlanner/RidePlanner.Api/Common/HealthCheckExtensions.cs#L29-L37)) and are actively probed by Google Cloud Run infrastructure and the CI/CD deployment smoke test suite. Exposing an `/api/health` alias through Vercel's edge proxy rewrite is redundant and unnecessary. Skipped per team decision.

---

### 3.8 AUDIT-08: Logout Leaves Stale `last_active_trip_id` in Browser Storage
* **Severity:** **P2**
* **Evidence:**
  * [AuthProvider.tsx](file:///d:/Coding/RidePlanner/frontend/src/features/auth/context/AuthProvider.tsx#L156-L170)
  * [MainLayout.tsx](file:///d:/Coding/RidePlanner/frontend/src/layouts/MainLayout.tsx#L52-L69)
* **Root Causes:** `logout()` in `AuthProvider` clears `tokenStore` and `queryClient`, but does not remove `last_active_trip_id` from `localStorage`.
* **Impact:** If User A logs out and User B logs in on the same browser, User B's cockpit initially queries User A's trip ID, causing a flash of 404 error before recovering.
* **Action:** Add `localStorage.removeItem("last_active_trip_id")` to `logout()` in `AuthProvider.tsx`.

---

### 3.9 AUDIT-09: Primitive `ErrorState` Component Lacks Actionable Recovery
* **Severity:** **P2**
* **Evidence:**
  * [ErrorState.tsx](file:///d:/Coding/RidePlanner/frontend/src/shared/ui/ErrorState.tsx#L1-L15)
  * [TripDetailsPage.tsx](file:///d:/Coding/RidePlanner/frontend/src/features/trips/pages/TripDetailsPage.tsx#L119-L121)
* **Root Causes:** `ErrorState.tsx` is an unadorned `<Alert severity="error">{message}</Alert>` with no retry callback, no navigation back to `/trips`, and no card structure.
* **Impact:** When a trip query fails (network drop, invalid ID), the user is left on a dead screen with no way to recover without using browser navigation.
* **Action:** Upgrade `ErrorState.tsx` to a centered card with error icon, user-friendly message, optional `onRetry` button, and `"Return to Expeditions"` navigation action.

---

### 3.10 AUDIT-10: Rate Limiting Omitted from Token Refresh and OAuth Start Endpoints
* **Severity:** **P2**
* **Evidence:**
  * [AuthController.cs](file:///d:/Coding/RidePlanner/backend/RidePlanner/RidePlanner.Api/Controllers/AuthController.cs#L72-L93)
  * [AuthController.cs](file:///d:/Coding/RidePlanner/backend/RidePlanner/RidePlanner.Api/Controllers/AuthController.cs#L129-L141)
* **Root Causes:** `register`, `login`, `forgot-password`, and `reset-password` have dedicated rate limit attributes, but `POST /api/auth/refresh` and `GET /api/auth/external/google/start` have no `[EnableRateLimiting]` attribute applied.
* **Impact:** Attackers can flood `/api/auth/external/google/start` to trigger outbound OAuth redirects or repeatedly probe `/api/auth/refresh`.
* **Action:** Add rate limit policies for `TokenRefresh` (30 requests/min per IP) and `ExternalOAuth` (15 requests/min per IP) in `RateLimitingExtensions.cs` and apply them to `AuthController`.

---

### 3.11 AUDIT-11: Vitest Worker Timeout on Windows Local Development
* **Severity:** **P3**
* **Evidence:**
  * [vite.config.ts](file:///d:/Coding/RidePlanner/frontend/vite.config.ts#L42-L48)
  * [package.json](file:///d:/Coding/RidePlanner/frontend/package.json#L11)
  * **Test Verification:** `npm run test` on Windows fails with `Error: [vitest-pool-runner]: Timeout waiting for worker to respond`.
* **Root Causes:** Vitest v4 defaults to `forks` pool on Windows, which times out when running 17 test suites sequentially in JSDOM unless `pool: 'threads'` is configured.
* **Impact:** CI passes on Ubuntu, but Windows developers cannot run `npm run test` without passing manual `--pool=threads` CLI flags.
* **Action:** Set `pool: 'threads'` directly inside `vite.config.ts` under the `test` block.

---

### 3.12 AUDIT-12 (Security): Missing Basic HTTP Security Headers (HSTS, nosniff, DENY)
* **Severity:** **P2**
* **Evidence:**
  * [Program.cs](file:///d:/Coding/RidePlanner/backend/RidePlanner/RidePlanner.Api/Program.cs#L101-L109)
* **Root Causes:** ASP.NET Core pipeline omits `app.UseHsts()` and custom response header middleware for security headers.
* **Impact:** Response headers lack standard OWASP defensive headers (`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`).
* **Action:** Add `app.UseHsts()` in non-development mode and attach security headers via middleware in `Program.cs`.

---

### 3.13 AUDIT-13 (Dependencies): Transitive NuGet Security Advisories in Crypto Packages
* **Severity:** **P3**
* **Evidence:**
  * Compiler warning `NU1903: Package 'System.Security.Cryptography.Xml' 10.0.4 has a known high severity vulnerability`.
* **Root Causes:** Brought in transitively by `Microsoft.AspNetCore.Authentication.Google`.
* **Impact:** Security scanning warning in build logs.
* **Action:** Explicitly reference patched package version or monitor upstream .NET 10 patch releases.

---

## 4. Target Architecture & Scope Boundaries

### 4.1 Topology Preservation
Sprint 14.5 preserves the proven three-tier architecture without adding new cloud services:
* **Frontend:** Vercel Edge CDN (React 19 / TypeScript / Vite / MUI)
* **Backend:** Google Cloud Run container (.NET 10 modular monolith on port 8080)
* **Database:** Neon Serverless PostgreSQL 18 with connection pooling

```text
Browser (HTTPS)
   │
   ├── [Page Requests] ──────────────────► Vercel Edge CDN (Static SPA assets)
   │
   ├── [/api/* Requests] ────────────────► Vercel Edge Rewrite
   │                                              │
   │                                     (X-Forwarded-Host, X-Forwarded-Proto)
   │                                              │
   │                                              ▼
   └── [/api/signin-google Callback] ────► Google Cloud Run (.NET 10 API)
                                                  │
                                          (Retry Resilient Npgsql)
                                                  │
                                                  ▼
                                           Neon PostgreSQL 18
```

### 4.2 Explicit Scope Boundary
* **Included:** 10 active audit items (Google OAuth fix, public landing page, Dark/Light/System themes, Google Maps Vercel configuration, Neon connection resiliency, production transactional email integration via Resend HTTP API/SMTP, logout storage cleanup, ErrorState recovery, rate limiting, Vitest Windows threads fix) plus security headers.
* **Skipped (Reviewed & Confirmed Unnecessary):**
  * **AUDIT-07 (Public Health Route Mapping):** Native `/health` (in-memory liveness) and `/ready` (Neon PostgreSQL readiness) endpoints already exist directly on the Cloud Run backend and are probed by automated CI/CD smoke tests and cloud health monitoring. Exposing an `/api/health` alias through Vercel's edge proxy is unnecessary.
* **Explicitly Excluded (Future Sprints):**
  * Weather HUD & Open-Meteo integration (Sprint 15)
  * Elevation profiles & topography graphs (Sprint 15)
  * Progressive Web App (PWA) & service workers (Sprint 16)
  * Offline-first IndexedDB storage & GPX export (Sprint 16)
  * Custom domain DNS registration (provider domains remain sufficient)
  * Redis distributed caching or Kubernetes orchestration (unnecessary for current scale)

---

## 5. Detailed Implementation Plans (Addressing All 11 Findings)

### 5.1 Workstream A: Production Google OAuth Stabilization (AUDIT-01, AUDIT-10, AUDIT-12)
1. **Backend Callback Path:**
   * Modify `AddGoogle` in `backend/RidePlanner/RidePlanner.Infrastructure/DependencyInjection.cs`:
     ```csharp
     options.CallbackPath = "/api/signin-google";
     ```
   * Ensures the OAuth callback is captured by Vercel's `/api/*` rewrite rule and proxied to Cloud Run.
2. **Enable Forwarded Host Processing:**
   * In `backend/RidePlanner/RidePlanner.Api/Program.cs`:
     ```csharp
     forwardedHeadersOptions.ForwardedHeaders |= ForwardedHeaders.XForwardedHost;
     ```
   * Ensures `HttpContext.Request.Host` reflects `ride-planner-sand.vercel.app`, allowing ASP.NET Core to construct the public HTTPS redirect URI.
3. **Fail-Fast Startup Validation:**
   * Update `ProductionConfigurationValidator.cs`: In production, assert that `Authentication:Google:ClientId` and `Authentication:Google:ClientSecret` are neither null, empty, nor placeholder strings.
4. **Cloud Run Secret Injection:**
   * Configure `Authentication__Google__ClientId` and `Authentication__Google__ClientSecret` in Cloud Run environment / Secret Manager.
5. **Google Cloud Console Configuration:**
   * **Authorized JavaScript Origins:**
     * `https://ride-planner-sand.vercel.app`
     * `http://localhost:5173`
   * **Authorized Redirect URIs:**
     * `https://ride-planner-sand.vercel.app/api/signin-google`
     * `http://localhost:5084/api/signin-google`
6. **Rate Limiting on Auth Endpoints (AUDIT-10):**
   * Add `TokenRefresh` (30 req/min) and `ExternalOAuth` (15 req/min) policies in `RateLimitingExtensions.cs`; decorate `Refresh` and `StartGoogleLogin` in `AuthController.cs`.
7. **Basic Security Headers (AUDIT-12):**
   * Add `app.UseHsts()` in non-development mode and attach standard defensive headers in `Program.cs`.

---

### 5.2 Workstream B: Public Unauthenticated Landing Experience (AUDIT-02)
1. **Create Public Landing Page (`frontend/src/shared/pages/LandingPage.tsx`):**
   * **Hero Section:** High-impact adventure imagery, tagline (*"Command Your Motorcycle Expeditions"*), and prominent *"Start Planning — Free"* / *"Sign In"* action buttons.
   * **4-Pillar Feature Matrix (Bento Grid):**
     * *Interactive Route Cockpit:* Multi-day waypoint mapping, route telemetry, and custom waypoint sequencing.
     * *6-Category Expedition Readiness:* Gear, documents, lodging, fuel, health, and bike maintenance check dials.
     * *Smart Fuel Calculator:* Range-aware consumption estimates based on tank volume and efficiency.
     * *Accommodation & Document Hub:* Stays, permits, offline emergency contacts, and expense ledger.
   * **Visual Identity:** Adheres strictly to the Obsidian design system (electric indigo, acid green, precision cyan telemetry accents).
2. **Router Architecture Updates (`AppRouter.tsx`):**
   * Update the root path (`/`):
     * If unauthenticated ➔ Renders `<LandingPage />`.
     * If authenticated ➔ Redirects to `/trips` (or renders the authenticated cockpit).
   * Relocate the authenticated trip cockpit component to `/dashboard` (with `/trips` as the primary expedition hub).

---

### 5.3 Workstream C: Multi-Theme System (AUDIT-03)
1. **Theme Mode Provider (`frontend/src/app/theme/ThemeContext.tsx`):**
   * State: `'dark' | 'light' | 'system'`.
   * Persisted in `localStorage` (`rideplanner_theme_mode`).
   * Listens to browser `window.matchMedia('(prefers-color-scheme: dark)')` when in `'system'` mode.
2. **Obsidian Light Palette Design (`frontend/src/app/theme/theme.ts`):**
   * Create a dedicated light theme factory `createAppTheme(mode: 'dark' | 'light')`:
     * Background Canvas: `#f8fafc` (Clean Slate Canvas).
     * Surface / Paper: `#ffffff` (Elevated Titanium Card).
     * Text Primary: `#0f172a` (High-contrast obsidian ink).
     * Text Secondary: `#475569` (Muted telemetry slate).
     * Dividers / Borders: `rgba(15, 23, 42, 0.08)`.
     * Retains brand telemetry colors (Electric Indigo `#6366f1`, Precision Cyan `#0891b2`, Amber `#d97706`, Crimson `#ef4444`).
3. **Refactor Hardcoded Hex Colors in Layouts:**
   * In `MainLayout.tsx`, replace `bgcolor: "#121416"` with `bgcolor: "background.default"`.
   * Replace `borderBottom: "1px solid rgba(255, 255, 255, 0.08)"` with `borderColor: "divider"`.
   * Ensure user menus, breadcrumbs, drawer headers, and trip cockpit tabs inherit theme tokens cleanly.
4. **Settings & Profile Controls:**
   * Add a Theme toggle selector (segmented button: Dark / Light / System) in `SettingsPage.tsx` and within `UserMenu.tsx`.

---

### 5.4 Workstream D: Google Maps Production Key Configuration (AUDIT-04)
1. **Google Cloud Console Restrictions:**
   * Restrict API key application restriction to **HTTP referrers**:
     * `https://ride-planner-sand.vercel.app/*`
     * `http://localhost:5173/*`
   * Restrict API scope strictly to:
     * *Maps JavaScript API*
     * *Places API (New)*
     * *Geocoding API*
2. **Vercel Environment Configuration:**
   * Configure project environment variables on Vercel:
     * `VITE_GOOGLE_MAPS_API_KEY = AIzaSy...`
     * `VITE_GOOGLE_MAPS_MAP_ID = 5da1b...`
   * Set for both **Production** and **Preview** environments.
3. **Graceful Fallback Preservation:**
   * Retain `MapFallback.tsx` so that if API quotas are exceeded or network connectivity drops, waypoints degrade gracefully to the summary card rather than crashing.

---

### 5.5 Workstream E: Serverless Database Connection Resiliency (AUDIT-05)
1. **Neon PostgreSQL Connection Resiliency:**
   * Update `backend/RidePlanner/RidePlanner.Infrastructure/DependencyInjection.cs`:
     ```csharp
     options.UseNpgsql(connectionString, npgsqlOptions =>
     {
         npgsqlOptions.EnableRetryOnFailure(
             maxRetryCount: 3,
             maxRetryDelay: TimeSpan.FromSeconds(5),
             errorCodesToAdd: null);
     });
     ```
   * Eliminates unhandled 500 exceptions during Neon PostgreSQL auto-suspend wakeups.

---

### 5.6 Workstream F: Production Transactional Email Integration (AUDIT-06)
1. **Email Provider Implementation (`RidePlanner.Infrastructure`):**
   * Create `ResendEmailSender.cs` implementing `IEmailSender`:
     * Dispatches HTTP POST requests to `https://api.resend.com/emails` via `HttpClient`.
     * Formats JSON payload:
       ```json
       {
         "from": "RidePlanner <onboarding@resend.dev>",
         "to": ["user@example.com"],
         "subject": "Reset your RidePlanner password",
         "html": "<!DOCTYPE html>..."
       }
       ```
     * Authenticates with `Bearer <Email:ApiKey>`. Built natively with .NET 10 `HttpClient` and `System.Text.Json` (zero third-party NuGet dependencies).
   * Create `SmtpEmailSender.cs` implementing `IEmailSender`:
     * Universal SMTP fallback configurable for Brevo, SendGrid, Amazon SES, or custom SMTP servers via host, port, credentials, and SSL/TLS.
2. **Branded Obsidian Password Reset HTML Template:**
   * Responsive HTML email template styled with RidePlanner design language:
     * Dark obsidian masthead (`#090a0f`) with RidePlanner typography and electric indigo brand accent (`#6366f1`).
     * Direct Call-to-Action button: *"Reset Your Password"*.
     * Raw link fallback and explicit security notice (token validity window of 2 hours; advisory to ignore if not requested).
3. **Provider Registration & Selection (`DependencyInjection.cs`):**
   * Inspect `Email:Provider` setting (`"Resend"`, `"Smtp"`, `"Development"`):
     * If `"Resend"`: Register `services.AddHttpClient<IEmailSender, ResendEmailSender>()`.
     * If `"Smtp"`: Register `services.AddTransient<IEmailSender, SmtpEmailSender>()`.
     * Otherwise (or in Development when unconfigured): Register `services.AddTransient<IEmailSender, DevelopmentEmailSender>()`.
4. **Fail-Fast Startup Validation (`ProductionConfigurationValidator.cs`):**
   * In production, assert that `Email:Provider` is configured (`"Resend"` or `"Smtp"`), credentials (`Email:ApiKey` or SMTP host/credentials) are present, non-empty, and not placeholder values.
5. **Cloud Run Secret Injection:**
   * Add secret environment variables in Cloud Run:
     * `Email__Provider`: `"Resend"`
     * `Email__ApiKey`: Secret Manager reference
     * `Email__FromEmail`: `"RidePlanner <onboarding@resend.dev>"` (or verified domain address)

---

### 5.7 Workstream G: Production UX Polish, Error Recovery & Local Testing (AUDIT-08, AUDIT-09, AUDIT-11)
1. **Session Logout Cleanup (AUDIT-08):**
   * In `AuthProvider.tsx` `logout()`, add `localStorage.removeItem("last_active_trip_id")` alongside `tokenStore.clear()` and `queryClient.clear()`.
2. **Enhanced ErrorState Component (AUDIT-09):**
   * Transform `ErrorState.tsx` into a structured card with error icon, friendly message, optional `"Try Again"` trigger (`onRetry`), and a `"Return to Expeditions"` navigation CTA.
3. **Vitest Windows Threads Configuration (AUDIT-11):**
   * In `frontend/vite.config.ts`, set `pool: 'threads'` under `test` configuration so `npm run test` executes reliably across both Windows and Linux CI without worker timeout errors.

---

## 6. Testing & Quality Assurance Plan

### 6.1 Automated Tests to Add
1. **Backend Integration & Unit Tests (`RidePlanner.Api.IntegrationTests` / `RidePlanner.Infrastructure.Tests`):**
   * `ForwardedHeaders_WhenXForwardedHostProvided_UpdatesRequestHost`: Verifies that `X-Forwarded-Host` sets `Request.Host` correctly.
   * `GoogleStart_GeneratesCorrectCallbackAndHost`: Verifies that the redirect URL returned by `/api/auth/external/google/start` uses `/api/signin-google` and honors forwarded hosts.
   * `ResendEmailSender_DispatchesCorrectPayload`: Verifies `ResendEmailSender` formats authorization header, recipient, subject, and HTML body correctly against a mock `HttpMessageHandler`.
   * `ProductionConfigurationValidator_RejectsMissingEmailApiKeyInProduction`: Verifies that production startup aborts when email credentials are blank.
   * `RateLimiting_AppliesToRefreshAndOAuth`: Verifies that rate limiting rejects excessive calls to `/refresh` and `/start`.
2. **Frontend Unit & Component Tests (`vitest`):**
   * `ThemeContext.test.tsx`: Verifies dark/light/system toggling and `localStorage` persistence.
   * `LandingPage.test.tsx`: Verifies hero rendering, feature highlights, and CTA links.
   * `routeGuards.test.tsx`: Verifies anonymous user landing on `/` sees the landing page, and authenticated user is routed to trips.
   * `ErrorState.test.tsx`: Verifies retry and back navigation callbacks.

### 6.2 Manual Production Verification Checklist
* [ ] Click "Sign in with Google" on `https://ride-planner-sand.vercel.app` ➔ Authenticate with Google ➔ Redirected back to `/auth/callback` ➔ Session restored ➔ Lands on `/trips`.
* [ ] Open `https://ride-planner-sand.vercel.app/` in an incognito window ➔ Verify public landing page renders without authentication prompts.
* [ ] Switch theme to Light ➔ Refresh browser ➔ Verify light mode persists with crisp contrast.
* [ ] Switch theme to System ➔ Verify OS dark/light changes are reflected in real time.
* [ ] Navigate to an expedition detail page ➔ Verify interactive Google Map loads with route lines and stop markers (zero fallback alerts).
* [ ] Trigger password reset on `https://ride-planner-sand.vercel.app/forgot-password` ➔ Check real email received in inbox with branded HTML template ➔ Click reset link ➔ Complete password reset successfully.
* [ ] Log out ➔ Verify `last_active_trip_id` is purged from `localStorage`.
* [ ] Run `npm run test` locally on Windows ➔ Verify all 17 test suites complete cleanly using thread pool.

---

## 7. Sprint Definition of Done (Active Criteria)

Sprint 14.5 is **DONE** when all criteria below are verified:

1. **[AUDIT-01] Google OAuth Operational in Production:** "Sign in with Google" works end-to-end on `https://ride-planner-sand.vercel.app`. Google callback (`/api/signin-google`) is proxied cleanly by Vercel to Cloud Run, refresh token cookie is set on Vercel domain, and session bootstraps without error.
2. **[AUDIT-02] Public Landing Page Live:** Unauthenticated visitors accessing `/` see the landing page with product highlights and CTAs. Authenticated riders navigating to `/` or clicking the logo access their expedition dashboard.
3. **[AUDIT-03] Multi-Theme System Operational:** Dark, Light, and System modes function seamlessly across all views. User selection persists across sessions in `localStorage`. Zero unreadable text or contrast bugs in light mode.
4. **[AUDIT-04] Google Maps Live in Production:** Expeditions display interactive Google Maps with custom dark/light styling, polylines, and waypoints (zero missing key fallback alerts). Key is secured with HTTP referrer restrictions.
5. **[AUDIT-05] Database Connection Resiliency Verified:** Npgsql `EnableRetryOnFailure` is active in EF Core configuration, eliminating sleep-resume 500s during Neon auto-suspend resume transitions.
6. **[AUDIT-06] Production Transactional Email Operational:** Real transactional email delivery (Resend HTTP REST API with SMTP fallback) is integrated in `RidePlanner.Infrastructure`. Password reset emails are transmitted over the wire and received in rider inboxes with a responsive, branded HTML template. Validated at startup in production and gracefully falls back to `DevelopmentEmailSender` in local dev.
7. **[AUDIT-08] Clean Logout Storage Hygiene:** `last_active_trip_id` is purged from `localStorage` upon user logout.
8. **[AUDIT-09] Actionable Error Recovery UI:** `ErrorState` renders a structured card with retry and back-navigation triggers.
9. **[AUDIT-10] Auth Endpoint Rate Limiting:** `POST /api/auth/refresh` and `GET /api/auth/external/google/start` are protected by fixed-window rate limiters.
10. **[AUDIT-11] Vitest Windows Compatibility:** `vite.config.ts` uses `pool: 'threads'`, allowing `npm run test` to pass cleanly on Windows without timeouts.
11. **[AUDIT-12] Security Headers Hardening:** Standard OWASP defensive headers (HSTS, nosniff, DENY) attached to backend responses.
12. **Code Quality & CI Validation:** All backend automated tests (250+) pass in Release mode; all frontend Vitest tests (95+) pass locally and in GitHub Actions CI with zero ESLint warnings.
*(Note: AUDIT-07 was reviewed and skipped as native `/health` and `/ready` checks already exist directly on Cloud Run).*
