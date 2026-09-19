# Sprint 14 — Production Readiness & First Cloud Deployment

**Status:** Complete  
**Sprint:** 14  
**Version target:** v0.14.0  
**Theme:** Production readiness, containerization, CI/CD, reliability, security, and first public cloud deployment  
**Prerequisite:** Sprint 13 — Authentication, User-Owned Workspaces & Profiles

---

## 1. Sprint Goal

Transition RidePlanner from a locally developed, authenticated multi-user application into a **secure, reproducible, reliably deployed public application**.

Sprint 14 was intentionally proportional to RidePlanner's current scale and purpose. The application is designed to serve a focused user base (roughly 5–20 initial riders) as a high-quality portfolio and production engineering demonstration.

The guiding objective:

> **Production engineering competence, not infrastructure theatre.**

Through Sprint 14, RidePlanner has successfully achieved:

- reproducible container builds via a multi-stage .NET 10 Dockerfile;
- hardened non-root container runtime on port 8080;
- strict externalization of production configuration and secrets;
- fail-fast startup configuration validation rejecting default development secrets;
- proxy-aware request processing with ASP.NET Core forwarded headers;
- persistent ASP.NET Core Data Protection keys stored durably in Neon PostgreSQL;
- automated pull-request validation for backend and frontend with dependency caching;
- continuous deployment on `main` via GitHub Actions OIDC / Workload Identity Federation;
- zero-downtime canary deployment on Cloud Run with 0% traffic and automated smoke tests;
- native `/health` and `/ready` health checks with database connectivity testing;
- structured JSON console logging with correlation IDs (`X-Correlation-ID`);
- public HTTPS operation across Vercel and Google Cloud Run;
- managed serverless PostgreSQL via Neon with connection pooling;
- full preservation of Sprint 13 authentication and multi-tenant isolation;
- manual and automated verification of deployment and rollback procedures.

---

# 2. Why This Sprint Matters

Sprints 1–12 established the product and architecture. Sprint 13 established identity, authentication, and user ownership.

Sprint 14 answered the next engineering question:

> **Can we actually ship and operate the application?**

The production path is now operational:

```text
Code
  ↓
Pull Request (Hermetic CI Validation, No Cloud Credentials)
  ↓
Merge to main
  ↓
Build & Publish Immutable SHA Image to Artifact Registry (WIF OIDC)
  ↓
Deploy 0% Traffic Cloud Run Revision (Tag: sha-${SHORT_SHA})
  ↓
Automated Smoke Tests (GET /health & GET /ready via jq)
  ↓
Migrate 100% Traffic to Validated Revision
  ↓
Health Verification & Production Logging
```

The sprint demonstrated:

- CI/CD automation and least-privilege security;
- Docker containerization best practices;
- environment configuration and secret externalization;
- reverse-proxy awareness and client IP resolution;
- cloud deployment on Google Cloud Run and Vercel;
- database migration discipline and Data Protection key persistence;
- native health checks avoiding Cloud Run reserved path conflicts;
- structured logging and request correlation;
- production security and multi-tenant isolation;
- instant revision rollback procedures.

---

# 3. Independent Review Outcome

An independent senior backend/platform review of the initial Sprint 14 plan identified several production-environment assumptions that needed to be made explicit.

The review agreed with the central scope decision:

- no Kubernetes;
- no service mesh;
- no multi-region deployment;
- no unnecessary autoscaling;
- no enterprise observability stack.

It highlighted critical operational considerations that were subsequently designed, implemented, and verified:

1. reverse-proxy client IP handling for rate limiting;
2. authentication cookie topology when frontend and backend are hosted separately;
3. persistence of ASP.NET Core Data Protection keys;
4. production EF Core migration behavior;
5. container user/port/security details;
6. Vite build-time environment variables;
7. CI dependency caching and concrete frontend quality gates;
8. correlation IDs;
9. production email/reset-password behavior;
10. excessive scope for automated production database-mutating E2E tests.

All findings have been resolved in the completed implementation.

> **Completed Hosting Decision:** Vercel for the React/Vite frontend, Google Cloud Run for the containerized .NET 10 API, and Neon for managed PostgreSQL.

---

# 4. Sprint Philosophy

## 4.1 Optimize For

1. Learning value
2. Interview value
3. Security
4. Reliability
5. Reproducibility
6. Low operational overhead
7. Low cloud cost

## 4.2 Avoid

1. infrastructure for hypothetical scale;
2. unnecessary services;
3. self-managed infrastructure where managed services are sufficient;
4. complicated deployment orchestration;
5. production tests that mutate real user data;
6. observability platforms that provide little value at current scale.

---

# 5. Target Production Architecture

The finalized production architecture is deliberately simple, secure, and cost-effective:

```text
                         ┌──────────────────────┐
                         │     User Browser     │
                         └──────────┬───────────┘
                                    │ HTTPS
                                    ▼
                         ┌──────────────────────┐
                         │       Vercel         │
                         │   React/Vite App     │
                         └──────────┬───────────┘
                                    │
                               /api/* rewrite
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Google Cloud Run   │
                         │      .NET 10 API      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │        Neon           │
                         │     PostgreSQL        │
                         └──────────────────────┘

                         GitHub Actions (WIF / OIDC)
                                │
                                ├─► Artifact Registry (SHA Docker Images)
                                └─► Cloud Run (0% Traffic Canary Deploy & Migration)
```

- **Frontend — Vercel**
  - Hosts the React 19 / Vite static application over global edge CDN with managed HTTPS.
  - Automatically builds from GitHub.
  - Implements `/api/*` rewrites (`frontend/vercel.json`) proxying API traffic directly to Cloud Run, preserving a same-origin browser topology for Sprint 13 HttpOnly refresh cookies.

- **Backend — Google Cloud Run**
  - Executes the containerized .NET 10 API in region `asia-southeast1`.
  - Serverless container runtime with scale-to-zero capability to eliminate idle costs.
  - Manages immutable revisions with traffic splitting and tagged URLs (`sha-${SHORT_SHA}`).

- **Database — Neon PostgreSQL**
  - Serverless managed PostgreSQL (v18) in `ap-southeast-1` with built-in connection pooling.
  - Decoupled from the application container lifecycle; maintains persistent relational data and Data Protection keys.

- **Container Registry — Google Artifact Registry**
  - Repository: `asia-south1-docker.pkg.dev/ride-planner-504308/rideplanner/rideplanner-api`.
  - Stores immutable Git SHA-tagged container images.
  - Configured with an automatic cleanup policy that retains the 10 most recent images to bound storage usage while maintaining an ample rollback window.

- **Secret Management — Google Secret Manager & Cloud Run Environment Variables**
  - Production secrets (Neon connection strings, JWT signing keys, Google OAuth secrets) are securely managed and injected into Cloud Run at runtime.
  - Development placeholders are rejected by startup validation.

- **CI/CD Authentication — GitHub Actions OIDC / Workload Identity Federation (WIF)**
  - Employs keyless authentication via short-lived OIDC token exchange (`rideplanner-ci` service account). Zero static service account keys exist in GitHub Secrets.

- **Custom Domain — Deferred**
  - Provider domains (`vercel.app` and `run.app`) are used for the initial launch.
  - Same-origin `/api/*` rewrites eliminate third-party cookie restrictions without requiring a custom domain.

---

## 5.1 Finalized Hosting Decisions

| Area | Component | Implementation / Decision | Operational Reasoning |
|---|---|---|---|
| Frontend | Vercel | React/Vite static build with edge CDN & `/api/*` rewrites | Simple deployment, automatic HTTPS, eliminates CORS/third-party cookie issues |
| Backend | Google Cloud Run | Containerized .NET 10 runtime (`asia-southeast1`) | Serverless, scale-to-zero, zero OS/server management, immutable revisions |
| PostgreSQL | Neon | Managed PostgreSQL 18 (`ap-southeast-1`, AWS Singapore) | Connection pooling, auto-suspend, high reliability, zero server operations |
| Images | Artifact Registry | Docker repository with 10-image retention policy | Immutable SHA tags, automated periodic cleanup, secure GCP-native storage |
| Secrets | Google Secret Manager | Environment secret injection into Cloud Run | Zero plain-text credentials in repository, least-privilege IAM access |
| CI/CD Auth | WIF (Workload Identity) | GitHub Actions OIDC token exchange | Keyless authentication, zero long-lived credentials stored in GitHub |
| Custom Domain | Deferred | Provider domains (`vercel.app`, `run.app`) | Unnecessary overhead for initial portfolio deployment; easily added later |

### Transactional Email

RidePlanner remains **demo-only for transactional email during the initial public deployment**.

The application utilizes the `IEmailSender` abstraction, with `DevelopmentEmailSender` as the active implementation. In production, password reset links are logged as a structured `[PRODUCTION DEMO SENDER]` warning to application logs rather than delivered via SMTP/API.

Reasoning:
- Delivery of real email is not required to validate cloud deployment.
- Avoids custom domain DNS/SPF/DKIM/DMARC configuration during initial launch.
- The `IEmailSender` abstraction ensures a transactional provider (e.g. Resend, Brevo, SendGrid) can be swapped in with zero code changes in domain or application layers.

### Artifact Registry Retention Policy

An Artifact Registry cleanup policy is configured:
- **Policy Rule:** Retains the 10 most recent container images; older images are automatically pruned.
- **Purpose:** Prevents unbounded accumulation of SHA-tagged container images and eliminates unnecessary storage fees while preserving an adequate window of recent images for rollback.
- **Independence:** Artifact Registry image retention operates independently from Cloud Run revision retention (active Cloud Run revisions remain functional).
- **Cadence:** Cleanup runs periodically in Google Cloud, not necessarily on each push.

### Deferred / Not Now

The following remain intentionally deferred:
- Custom domain (e.g., `rideplanner.com`)
- Real transactional email provider
- Redis distributed cache (in-memory caching remains sufficient for single-instance)
- Kubernetes / cluster orchestrators
- Service mesh
- Multi-region replication
- Dedicated load balancer / reverse proxy VMs
- Enterprise APM platforms (OpenTelemetry / Prometheus / Grafana)

> **Guiding principle:** Production engineering competence, not infrastructure theatre.

---ope decision, not an unfinished architectural design.

### Deferred / Not Now

The following are intentionally deferred:

- Custom domain
- Real transactional email provider
- Redis/cache infrastructure
- Kubernetes
- Service mesh
- Multi-region deployment
- Dedicated load balancer unless required by the selected hosting topology
- Enterprise observability platforms

> **Guiding principle:** Production engineering competence, not infrastructure theatre.

---

# 6. Authentication Transport Topology

Sprint 13 uses an in-memory access token plus an HttpOnly refresh-token cookie.

This makes production frontend/API topology an important architectural decision.

A deployment where the frontend is at `rideplanner.vercel.app` and the API is at `rideplanner-api-xyz.a.run.app` must not be assumed to behave like a same-origin application merely because CORS is configured.

Because a custom domain is deferred, the **Same-Origin API Proxy** approach is selected for Sprint 14.

### Selected Approach: Same-Origin API Proxy (Vercel Rewrites)

Expose API traffic through the frontend origin via Vercel edge rewrites:

```text
Vercel Frontend Origin (/api/*)
                  ↓
       Vercel rewrite (vercel.json)
                  ↓
https://rideplanner-api-73286917441.asia-southeast1.run.app/api/*
```

The browser communicates strictly with one origin (`rideplanner.vercel.app`).

Benefits:

- avoids modern browser third-party cookie restrictions for the HttpOnly refresh token;
- simpler browser security model;
- eliminates CORS preflights on proxied requests;
- reliable session restoration and rotation across browser restarts.

### Alternative (Deferred): Shared Custom Domain

Using a custom domain (e.g., `app.rideplanner.example` and `api.rideplanner.example`) is documented as a viable alternative for future sprints if direct multi-domain routing is desired. For Sprint 14, custom domains are deferred in favor of the Vercel same-origin rewrite proxy.

---

# 7. Scope

## 7.1 In Scope

### Production Configuration

- environment-specific configuration;
- production connection strings;
- JWT configuration;
- frontend API configuration;
- Google Maps configuration;
- production CORS;
- startup validation of required secrets;
- no secrets in source control.

### Reverse Proxy Awareness

- forwarded headers;
- correct client IP resolution;
- correct HTTPS detection;
- rate limiting compatibility with the deployment proxy.

### Authentication Resilience

- persistent ASP.NET Core Data Protection keys;
- refresh-token behavior across restarts;
- cookie configuration;
- production OAuth behavior.

### Docker

- backend multi-stage Dockerfile;
- non-root runtime;
- correct container port;
- `.dockerignore`;
- local PostgreSQL container.

### CI/CD

- GitHub Actions;
- backend build/tests;
- frontend lint/type/build/tests;
- dependency caching;
- PR validation;
- deployment on main.

### Reliability

- `/health`;
- `/ready`;
- structured JSON logging;
- correlation/request identifiers;
- safe production exception behavior.

### Cloud

- public frontend;
- public API;
- managed PostgreSQL;
- HTTPS;
- production configuration.

### Verification

- automated HTTP health/synthetic checks;
- manual end-to-end production runbook;
- security verification.

---

# 8. Explicitly Out of Scope

## Kubernetes

Deferred because current scale does not justify cluster orchestration.

## Multi-Region

Deferred.

## Autoscaling

Deferred unless real workload requires it.

## Service Mesh

Deferred.

## Kafka / Message Broker

Deferred until an actual asynchronous workload requires it.

## Prometheus/Grafana

Deferred.

## Full Observability Platform

Deferred.

OpenTelemetry may be introduced later when distributed tracing has meaningful value.

## Production Frontend Container

Not required because Vercel directly builds and hosts the Vite static application.

The frontend should be containerized only if there is a concrete deployment or learning reason.

## Production Docker Compose

Docker Compose may be used for local infrastructure/reproducibility.

It does not need to reproduce the entire cloud topology.

## Caddy/Nginx

Only introduce a dedicated reverse proxy if the chosen deployment architecture actually requires it.

## Automated Database-Mutating Production E2E

Do not create/delete real production trips merely to prove the application works after deployment.

Use:

- automated health/synthetic HTTP checks;
- manual business-flow verification;
- non-production test environments later if needed.

---

# 9. P0 — Critical Production Readiness Fixes

The following critical readiness fixes were implemented, verified, and deployed to production:

---

## 9.1 Forwarded Headers & Client IP Handling

Cloud platforms (Cloud Run and Vercel edge) place the application behind reverse proxies. ASP.NET Core forwarded-header processing is implemented in `Program.cs`:

```csharp
var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
    ForwardLimit = null
};
forwardedHeadersOptions.KnownNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedHeadersOptions);
```

### Verified Outcomes:
- **Client IP Resolution:** `ResolveClientIp` in authentication rate-limiting middleware parses the true client IP from `X-Forwarded-For`. Unrelated users behind Cloud Run's reverse proxy are never grouped into a single shared IP address.
- **HTTPS Scheme Detection:** `Request.IsHttps` and `Request.Scheme` correctly report HTTPS when TLS terminates at the reverse proxy.
- **Redirects & URLs:** ASP.NET Core URL generation and cookie policies respect the forwarded protocol.

---

# 10. Persistent ASP.NET Core Data Protection Keys

In serverless and containerized environments, containers are ephemeral. If Data Protection keys are stored on the local container filesystem, restarting or redeploying a container generates a new key ring, invalidating all previously protected tokens and cookies.

### Implemented Solution: PostgreSQL Key Ring Persistence
In `RidePlanner.Infrastructure/DependencyInjection.cs`, Data Protection is configured to persist keys durably in the Neon PostgreSQL database:

```csharp
var dataProtectionBuilder = services.AddDataProtection();
if (!string.IsNullOrWhiteSpace(connectionString) && !string.Equals(connectionString, "InMemory", StringComparison.OrdinalIgnoreCase))
{
    dataProtectionBuilder.PersistKeysToDbContext<RidePlannerDbContext>();
}
```

The key ring is stored in the `DataProtectionKeys` table:
- **Survivability:** Keys survive container restarts, scaling events, and redeployments.
- **Session Stability:** Google OAuth account-linking tickets, password-reset tokens, and internal cryptographic payloads remain valid across releases.

---

# 11. Production Database Migrations

RidePlanner implements **Option A: Controlled Startup Migrations** for single-instance Cloud Run operation.

### Implemented Architecture:
In `Program.cs`:
```csharp
var runMigrations = app.Environment.IsDevelopment()
    || app.Configuration.GetValue<bool>("Database:RunMigrationsOnStartup")
    || string.Equals(Environment.GetEnvironmentVariable("RUN_MIGRATIONS_ON_STARTUP"), "true", StringComparison.OrdinalIgnoreCase);

if (runMigrations)
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<RidePlannerDbContext>();
    if (dbContext.Database.IsRelational())
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Applying database migrations...");
        await dbContext.Database.MigrateAsync();
        logger.LogInformation("Database migrations applied successfully.");
    }
}
```

### Verified Operational Behavior:
- **Controlled Activation:** Enabled in production via deployment configuration (`RUN_MIGRATIONS_ON_STARTUP=true`).
- **Observability:** Migration start, execution, and completion are logged to structured console output with error logging on failure.
- **Production Validation:** All 20 EF Core migrations were applied cleanly to Neon PostgreSQL upon initial deployment, including Identity, User Profile, Aggregate tables, and `DataProtectionKeys`.

---

# 12. Production Secret Validation

Production startup fails fast if required secrets are missing, insecure, or contain default development placeholders.

### Implemented Validator: `ProductionConfigurationValidator`
Executed at startup in `Program.cs` before any requests are accepted:
```csharp
ProductionConfigurationValidator.Validate(app.Configuration, app.Environment);
```

### Enforced Rules:
1. **JWT Secret:** `Jwt:Secret` is required, must be at least 32 characters (256 bits), and cannot match `DefaultDevJwtSecret` or contain `"super_secret"`.
2. **Database Connection:** `ConnectionStrings:RidePlannerDatabase` is required and cannot be `"InMemory"`.
3. **Google OAuth:** If configured, credentials cannot use development placeholders.
4. **CORS Origins:** `Cors:AllowedOrigins` must define valid origins and cannot only allow `http://localhost:5173`.
5. **Frontend Base URL:** `App:FrontendBaseUrl` is required and cannot be `http://localhost:5173`.

If any rule fails, the application throws an `InvalidOperationException` and terminates immediately, preventing insecure deployment.

---

# 13. Production Email / Password Reset

RidePlanner uses the `IEmailSender` abstraction (`RidePlanner.Application.Abstractions.Notifications.IEmailSender`).

### Implemented Behavior:
Implemented via `DevelopmentEmailSender` in `RidePlanner.Infrastructure/Notifications/DevelopmentEmailSender.cs`:
- **Production Mode:** When `_environment.IsProduction()`, password-reset requests generate a valid token and link, logging a structured notice:
  ```text
  [PRODUCTION DEMO SENDER] Transactional email provider is not configured.
  Password reset link generated for {ToEmail} was routed to application logs: {ResetUrl}
  ```
- **Security & User Experience:** The API returns a generic non-enumerating 200 OK response to the client. The reset URL is accessible in Cloud Run logs for testing and administrative resets.
- **Future Readiness:** External providers (Resend, Brevo, AWS SES) can be added by implementing `IEmailSender` without touching application or domain code.

---

# 14. Docker — Backend

## 14.1 Multi-Stage Build

Use:

```text
.NET SDK image
      ↓
restore
      ↓
build
      ↓
publish
      ↓
.NET ASP.NET runtime image
```

The final image must not contain the SDK or development artifacts.

---

## 14.2 Non-Root Runtime

Run the application using the runtime image's non-root application user where supported.

This reduces the impact of a container compromise.

---

## 14.3 Container Port

Use the runtime image's expected application port consistently, preferably:

```text
8080
```

The hosting provider's port configuration must match the container's binding.

Do not carry development assumptions such as:

```text
http://localhost:5084
```

into the production container.

---

## 14.4 Globalization

If an Alpine-based image is considered, explicitly verify ICU/globalization support.

RidePlanner deals with:

- INR/USD/EUR/GBP;
- dates;
- distances;
- localized display.

Do not trade away globalization correctness merely for a smaller image.

A standard Debian-based runtime is acceptable if it provides a simpler and more predictable production image.

---

## 14.5 Local Docker Compose Environment (API + PostgreSQL)

For local development and testing, `backend/compose.yaml` defines a complete local environment:

```text
Docker Compose
├── api
│   └── RidePlanner .NET 10 (Dockerfile)
│
└── postgres
    └── PostgreSQL 17
        └── postgres-data (named volume)
```

### Networking & Resolution
- **Internal Service Communication (`api` → `postgres:5432`):** Within the Docker bridge network (`backend_default`), Compose provides internal DNS resolution mapping the service name `postgres` directly to the database container's internal IP. The API connects using:
  ```text
  ConnectionStrings__RidePlannerDatabase="Host=postgres;Port=5432;Database=rideplanner;Username=rideplanner;Password=rideplanner_dev_password"
  ```
- **Host Machine Access (`Developer` → `localhost:5433`):** Port `5433:5432` exposes the database to the host machine for developer tools (e.g. `psql`, pgAdmin, or IDE database tools) while avoiding collision with any local PostgreSQL instance on default port `5432`.
- **Why the API must NOT use `localhost`:** Inside a container, `localhost` (`127.0.0.1`) refers strictly to the container's own isolated loopback interface. If the API attempted to connect to `localhost:5432` or `localhost:5433`, the connection would be refused because PostgreSQL runs in a separate container namespace.

### Startup Ordering vs. Runtime Readiness
- **Startup Ordering (`depends_on + condition: service_healthy`):** Compose checks PostgreSQL's health check (`pg_isready -U rideplanner -d rideplanner`) and waits until it passes before launching the API container.
- **Runtime Readiness (`/ready`):** Startup ordering only controls container boot order. The application's native `/ready` endpoint validates continuous runtime reachability of PostgreSQL throughout the application lifecycle.

### Production Distinction
- This Compose setup is **strictly for local development and reproducibility**.
- Production topology remains:
  ```text
  User Browser ──► Vercel (React/Vite) ──► Cloud Run (.NET 10 API) ──► Neon (Managed PostgreSQL)
  ```
- PostgreSQL is never packaged into the production API container.

---

# 15. `.dockerignore`

The Docker build context must exclude unnecessary and sensitive local content.

At minimum consider:

```text
**/.env
**/.git
**/bin
**/obj
**/node_modules
```

Also exclude local IDE/build artifacts as appropriate.

A production build should never accidentally copy a developer's `.env` file into an image.

---

# 16. Frontend Build Strategy

The frontend is a Vite application.

Vite `VITE_*` variables are generally **build-time values**.

Therefore:

```text
npm run build
      ↓
VITE_API_BASE_URL
      ↓
compiled JavaScript
```

CI/CD must explicitly provide the correct production values when building the frontend.

Otherwise a production bundle can accidentally contain development configuration such as:

```text
http://localhost:5084/api
```

This must be verified by inspecting the deployment configuration and production behavior.

---

# 17. Frontend Container Decision

Since Vercel directly supports:

```text
Git repository
    ↓
Vite build
    ↓
static hosting/CDN
```

use that.

Do not add:

```text
Vite
 ↓
Node container
 ↓
Nginx container
 ↓
cloud service
```

merely because Docker can do it.

The frontend container is optional.

The backend container is the more important Docker learning objective because it demonstrates packaging a long-running .NET service.

---

# 18. CI — GitHub Actions

GitHub Actions is the continuous integration system for RidePlanner.

## 18.1 Backend CI Foundation (P1.6-A)

Automated backend validation is implemented in `.github/workflows/backend-ci.yml`.

Key properties:
- **Triggers:** Runs automatically on pushes to `main` and on pull requests targeting `main`.
- **Permissions:** Configured for least privilege (`contents: read`). No cloud credentials, secrets, or write tokens are provided.
- **Concurrency:** Automatically cancels in-progress CI runs for the same branch/PR when newer commits are pushed.
- **Workflow Pipeline:**
  1. Checks out repository via `actions/checkout@v4`.
  2. Sets up .NET 10 via `actions/setup-dotnet@v4` with built-in NuGet caching (`cache: true` keyed on `backend/RidePlanner/**/*.csproj`).
  3. Restores solution: `dotnet restore backend/RidePlanner/RidePlanner.slnx`.
  4. Compiles solution in Release mode: `dotnet build backend/RidePlanner/RidePlanner.slnx --configuration Release --no-restore`.
  5. Runs complete test suite: `dotnet test backend/RidePlanner/RidePlanner.slnx --configuration Release --no-build --no-restore --nologo` (covers Domain, Application, and API integration tests).
- **Scope & Non-Goals:**
  - This is validation-only CI. It does not build/publish Docker images or deploy to Cloud Run (deferred to later steps).
  - No external PostgreSQL instance or secrets are required; all 247 test cases run hermetically.

## 18.2 Docker Image CI Build (P1.6-B)

The Backend CI workflow (`.github/workflows/backend-ci.yml`) extends beyond .NET tests to validate the production container build:

```text
P1.6-A:
Checkout ──► Setup .NET ──► Restore ──► Build ──► Test

P1.6-B:
Checkout ──► Setup .NET ──► Restore ──► Build ──► Test ──► Docker Build ──► Verify Image
```

Key properties:
- **Build Step:** Executes `docker build -f backend/Dockerfile -t rideplanner-api:ci backend`.
- **Validation:** Confirms that the multi-stage Dockerfile and `.dockerignore` successfully compile and package the API in a clean CI runner environment.
- **Scope & Non-Goals:**
  - This step builds the image locally within the GitHub Actions runner.
  - The image is **not pushed to any registry** yet. Artifact Registry, GCP authentication, and Cloud Run deployment are deferred to later steps.
  - No secrets, credentials, or external databases are introduced into the CI Docker build.

## 18.3 Artifact Registry Publishing via Workload Identity Federation (P1.6-C)

On pushes to the `main` branch, the Backend CI workflow authenticates securely to Google Cloud and publishes the production image to Google Artifact Registry:

```text
PR Targeting main:
Checkout ──► Setup .NET ──► Restore ──► Build ──► Test ──► Docker Build ──► Verify Image (NO GCP Auth / NO Push)

Push to main:
Checkout ──► Setup .NET ──► Restore ──► Build ──► Test ──► Docker Build ──► Verify Image
       ──► WIF Auth (OIDC) ──► Docker Login ──► Push to Artifact Registry (SHA Tag)
```

Key architectural and security properties:
- **Zero Stored Secrets (Keyless Authentication):** Uses Google Cloud **Workload Identity Federation (WIF)**. GitHub Actions mints a short-lived OIDC token (`id-token: write`). `google-github-actions/auth@v3` exchanges this token with Google Security Token Service (STS) for short-lived access credentials via service account impersonation. No static JSON service account keys or long-lived credentials exist in GitHub Secrets or the repository.
- **WIF Trust Boundaries:**
  - **Pool:** `github-actions` in project `ride-planner-504308` (`projects/73286917441/locations/global/workloadIdentityPools/github-actions`).
  - **Provider:** `github` (`.../providers/github`).
  - **Attribute Condition:** Strictly restricts token exchange to `assertion.repository_owner_id == '92602431' && assertion.repository_id == '1289731955'` (`Shivansh0103/RidePlanner`).
- **Least-Privilege Service Account:**
  - Service Account: `rideplanner-ci@ride-planner-504308.iam.gserviceaccount.com`.
  - Roles: `Artifact Registry Writer` scoped strictly to the `rideplanner` repository. It does not possess project-wide owner or editor roles.
- **Artifact Registry Repository:**
  - Path: `asia-south1-docker.pkg.dev/ride-planner-504308/rideplanner/rideplanner-api`.
- **Immutable SHA-Based Tagging:**
  - Images are tagged with the immutable Git commit SHA: `${{ github.sha }}`.
  - Avoids mutable `latest` tags for production deployment traceability.
  - If a workflow run for an existing commit is re-run, an existence check (`docker manifest inspect`) skips re-pushing to honor Artifact Registry's immutable tags policy without failing the workflow.
- **Pull Request Isolation:**
  - Pull requests execute compilation, tests, and local Docker image building to validate changes.
  - Pull requests **never** authenticate to Google Cloud and **never** push to Artifact Registry.
- **Scope & Non-Goals:**
  - This step concludes with the image published to Artifact Registry.
  - Deployment to Cloud Run, smoke testing, and traffic routing are handled in Section 18.5.

## 18.4 Frontend CI

Automated frontend validation is implemented in `.github/workflows/frontend-ci.yml`.

Key properties:
- **Triggers:** Runs automatically on pull requests targeting `main` and on pushes to `main`.
- **Concurrency:** Automatically cancels in-progress CI runs when newer commits are pushed to the same PR or branch.
- **Environment & Caching:** Uses Node.js 24 with npm dependency caching keyed to `frontend/package-lock.json`.
- **Quality Gates:**
  1. `npm ci`: Clean install from lockfile.
  2. `npm run lint`: ESLint code quality checks.
  3. `npm run build`: Production bundle compilation via Vite (TypeScript validation & asset packaging).
  4. `npm run test`: Vitest test suite execution across all 17 test suites (91 unit and component tests).
- **Pull Request Isolation:** PRs execute all frontend validation gates hermetically without cloud credentials, tokens, or production deployments.

## 18.5 Automated Cloud Run Deployment & Safe Traffic Migration

On pushes to `main`, after Artifact Registry publishing succeeds, the Backend CI workflow automatically deploys to Cloud Run using a zero-downtime, smoke-tested traffic migration strategy:

```text
main branch push
      ↓
CI Quality Gates (.NET build, tests, Docker build)
      ↓
WIF OIDC Token Exchange (Service Account: rideplanner-ci)
      ↓
Docker Login & Push Immutable SHA Tag to Artifact Registry
      ↓
Deploy New Revision to Cloud Run (0% Traffic, Tag: sha-${SHORT_SHA})
      ↓
Automated Smoke Tests against Tagged Revision URL (GET /health & GET /ready via jq)
      ↓
   [Pass?]
  ├── Yes ──► Migrate 100% Production Traffic to New Revision
  └── No  ──► Fail Workflow Run (0% Traffic Moved; Existing Production Revision Remains Active)
```

### Architectural & Deployment Design Principles
1. **Immutable Image Deployments:** Deployments always reference the exact Git commit SHA image (`asia-south1-docker.pkg.dev/ride-planner-504308/rideplanner/rideplanner-api:${{ github.sha }}`). Mutable `latest` tags are never used.
2. **Zero-Downtime Blue/Green Revision Model:**
   - The new revision is deployed with `--no-traffic`. It receives 0% of the service's public traffic upon initial deployment.
   - The revision receives a dedicated Cloud Run traffic tag: `sha-${SHORT_SHA}`.
   - Cloud Run provisions a deterministic, tagged URL:
     ```text
     https://sha-${SHORT_SHA}---rideplanner-api-73286917441.asia-southeast1.run.app
     ```
3. **Simplified Revision Discovery:**
   - The workflow queries Cloud Run directly for `status.latestReadyRevisionName` upon deployment.
   - The tagged URL is constructed deterministically from known variables (`TAG`, `SERVICE_NAME`, `PROJECT_NUMBER`, `REGION`), removing complex runtime JSON filtering.
4. **Automated Smoke Tests Prior to Traffic Migration:**
   - Probes the tagged URL without affecting public traffic:
     - `GET /health` (Liveness: validates HTTP 200, top-level `.status == "Healthy"`, and `.checks[name=self].status == "Healthy"` via `jq`).
     - `GET /ready` (Readiness: validates HTTP 200, top-level `.status == "Healthy"`, and `.checks[name=database].status == "Healthy"` via `jq`).
   - Does not merely substring-search for "Healthy"; strictly inspects structured JSON keys.
   - Retries up to 12 times with 5s backoff to accommodate cold container startup and database migration verification.
5. **Failure Isolation:**
   - If either health check probe fails, the deployment step terminates with `exit 1`.
   - The traffic migration step is skipped.
   - Public users experience zero downtime or degradation because 100% of production traffic remains pinned to the previous healthy revision.
6. **Deterministic Traffic Migration:**
   - Once smoke tests pass, `gcloud run services update-traffic` assigns 100% traffic specifically to the newly validated revision name (e.g. `rideplanner-api-0000X-xxx=100`).
   - The workflow verifies and prints the updated traffic table.

---

# 19. CI Dependency Caching

Dependency caching is implemented across all workflows:

- **.NET (Backend CI):** `actions/setup-dotnet@v4` with `cache: true` keyed to `backend/RidePlanner/**/*.csproj`.
- **Node (Frontend CI):** `actions/setup-node@v4` with `cache: npm` keyed to `frontend/package-lock.json`.

The goal is fast, repeatable validation:
```text
PR
 ↓
Cached restore & fast validation
 ↓
Developer receives feedback in under 2 minutes
```

---

# 20. CI/CD Separation

RidePlanner strictly isolates PR validation from deployment:

```text
Pull Request
    ↓
CI only (Hermetic .NET test + Frontend test + Docker build, Zero GCP access)
```

and:

```text
Merge to main
     ↓
CI Gates Pass
     ↓
Keyless GCP WIF OIDC Auth
     ↓
Artifact Registry Push
     ↓
Cloud Run 0% Canary Deploy
     ↓
Smoke Tests (/health, /ready)
     ↓
100% Traffic Migration
```

A deployment cannot bypass the CI build/test gates.

---

# 21. Deployment

The release flow is fully automated:

```text
Pull Request
    ↓
CI passes
    ↓
Merge to main
    ↓
Build / Tag image
    ↓
Cloud Run deploy (0% traffic)
    ↓
Automated health probe verification
    ↓
100% Traffic shift
```

---

# 22. Health Checks

Native ASP.NET Core health-check infrastructure is implemented in `RidePlanner.Api/Common/HealthCheckExtensions.cs`:

> [!NOTE]
> Google Cloud Run reserves/intercepts URL paths ending in "z" (e.g. `/healthz` and `/readyz`), returning Google Frontend 404s before requests reach the container. Therefore, `/health` and `/ready` are the final public endpoint names.

Both endpoints are configured with:
- `.AllowAnonymous()`
- `.DisableRateLimiting()`
- Custom structured JSON response writer (`WriteHealthCheckResponse`) returning `{ status: "...", checks: [ ... ] }`.

## `/health` (Liveness)
- Answers: *Is the process alive?*
- Evaluates the `"self"` in-memory probe. Does not touch the database.
- Returns HTTP 200 with `.status: "Healthy"` and `.checks[name="self"].status: "Healthy"`.

## `/ready` (Readiness)
- Answers: *Can this instance serve normal traffic?*
- Evaluates the `"database"` check by executing `CanConnectAsync` against `RidePlannerDbContext` with a 5-second timeout.
- Returns HTTP 200 when database connectivity is established, or HTTP 503 Service Unavailable if Neon PostgreSQL is unreachable.

---

# 23. Structured Logging

Structured JSON console logging is implemented via `AddRidePlannerLogging` in `Program.cs`.

In production:
- Outputs standardized JSON logs to standard output.
- Cloud Run automatically ingests these logs into Google Cloud Logging with structured severity levels (`INFO`, `WARNING`, `ERROR`).
- Essential fields captured: `Timestamp`, `LogLevel`, `TraceId`, `SpanId`, `X-Correlation-ID`, `RequestPath`, `StatusCode`, and `ElapsedMilliseconds`.
- Sensitive data (passwords, JWT secrets, database connection credentials) is strictly excluded.

---

# 24. Correlation IDs

End-to-end request tracing is implemented via `CorrelationIdMiddleware` (`RidePlanner.Api.Middleware`):

```text
Browser / Client
   ↓ (Optional incoming X-Correlation-ID)
CorrelationIdMiddleware
   ↓ (Generates or validates GUID)
Attached to HttpContext.Items & Logger Scope
   ↓
Emitted in Response Header: X-Correlation-ID
   ↓
Included in ProblemDetails on Errors
```

### Properties:
- **Header:** `X-Correlation-ID`.
- **Validation:** Enforces alphanumeric, dash, underscore, dot, or colon format up to 128 characters. If missing or invalid, a new GUID is generated.
- **Logging Scope:** Begins a logging scope with `CorrelationId`, ensuring all log entries emitted during request execution share the identifier.
- **Diagnostic Traceability:** Allows any user-reported error to be matched directly to Cloud Run logs.

---

# 25. Production CORS

Because RidePlanner uses the **Same-Origin API Proxy** via Vercel rewrites:
- Browser requests to `/api/*` originate from `rideplanner.vercel.app` and are rewritten at the edge to Cloud Run.
- Cloud Run's CORS policy (`app.UseCors("Frontend")`) allows the Vercel production origin with credentials.
- `AllowAnyOrigin` is prohibited in production.

---

# 26. Google Maps API Security

Production Google Maps API key configuration:

> [!IMPORTANT]
> A production Google Maps API key is **intentionally not configured** in the initial public deployment.
> The production UI gracefully renders the "Google Maps API key is not configured" placeholder state. This is expected behavior and not a deployment failure.

Future follow-up when production Maps is activated:
- Provision dedicated production key in Google Cloud Console.
- Apply HTTP referrer restrictions (`https://rideplanner.vercel.app/*`).
- Restrict enabled APIs strictly to Maps JavaScript API and Places API.
- Maintain separate development and production keys.

---

# 27. Production Database & Container Image Management

Neon is finalized and validated as the managed PostgreSQL provider.

### Production Environment Configuration
- **Provider:** Neon Managed PostgreSQL
- **Project Name:** `rideplanner-production`
- **Project ID:** `icy-butterfly-52098985`
- **Branch:** `production`
- **Database Name:** `rideplanner`
- **PostgreSQL Version:** 18
- **Region:** `ap-southeast-1` (AWS Singapore)
- **Endpoint Type:** Connection pooling enabled (`*-pooler...`)
- **Transport Security:** SSL required (`SSL Mode=Require; Trust Server Certificate=true`)
- **Migration Strategy:** Controlled startup migration (`RUN_MIGRATIONS_ON_STARTUP=true`). All 20 initial migrations have been applied and validated in production.
- **Data Protection Table:** `DataProtectionKeys` table stores persistent encryption keys.
- **Credentials & Secret Management:** Connection credentials injected exclusively via Google Secret Manager / Cloud Run environment.

### Artifact Registry Retention Policy
- **Repository:** `asia-south1-docker.pkg.dev/ride-planner-504308/rideplanner/rideplanner-api`
- **Retention Rule:** Retains the 10 most recent container images; older images are automatically pruned.
- **Rollback Window:** Retains sufficient recent images for immediate rollback without unbounded image accumulation.
- **Cadence:** Cloud cleanup runs periodically in GCP background.

---

# 28. Cold Starts and Small-Tier Hosting

Low-cost/free hosting may sleep after inactivity.

This is acceptable for the current project.

The application should therefore:

- tolerate cold starts;
- avoid unnecessarily short client request timeouts during initial bootstrap;
- use realistic health probe expectations;
- document that a first request after inactivity may be slower.

This should not be "fixed" by introducing an unnecessarily expensive always-on architecture.

---

# 29. Production Smoke Verification

Do not mutate the live production database with a large automated E2E suite on every deployment.

Instead divide verification into two layers.

## Automated Deployment Probe

Automatically verify:

```text
GET frontend
    ↓
HTTP 200

GET /health
    ↓
HTTP 200

GET /ready
    ↓
expected healthy response
```

Optionally verify a safe non-mutating API endpoint.

## Manual Business-Flow Runbook

Maintain a concise 10-minute checklist:

```text
1. Open frontend
2. Register/login
3. Refresh page
4. Verify session recovery
5. Create a trip
6. Edit the trip
7. Reload
8. Verify persistence
9. Verify maps
10. Verify logout
11. Verify login again
12. Verify ownership boundary with a second account
```

This is sufficient for the current scale.

A proper staging environment can later support automated full E2E tests if the project grows.

---

# 30. Security Verification

Before declaring Sprint 14 complete:

### Authentication

- [ ] HTTPS works.
- [ ] Access token lifetime is correct.
- [ ] Refresh cookie is HttpOnly.
- [ ] Refresh cookie is Secure in production.
- [ ] Cookie SameSite behavior matches the chosen topology.
- [ ] Refresh token survives normal application restarts.
- [ ] OAuth flow survives supported restart scenarios.
# 29. Production Smoke Verification

Production verification was executed without mutating live user data on deployment:

## Automated Deployment Probe (CI Pipeline)
Every deployment to `main` executes automated synthetic smoke tests against the tagged canary URL before traffic is routed:
- **Frontend Probe:** `GET https://rideplanner.vercel.app` → Returns HTTP 200.
- **Liveness Probe:** `GET /health` → Returns HTTP 200 with `.status == "Healthy"` and `.checks[name="self"].status == "Healthy"`.
- **Readiness Probe:** `GET /ready` → Returns HTTP 200 with `.status == "Healthy"` and `.checks[name="database"].status == "Healthy"`.

## Completed Manual Business-Flow Runbook
The end-to-end production runbook was executed and verified against live infrastructure:
1. **Live Deployments:** Production frontend is live on Vercel; production backend is live on Google Cloud Run (`https://rideplanner-api-73286917441.asia-southeast1.run.app`).
2. **Reverse Proxy Connectivity:** Frontend/API communication functions seamlessly via Vercel edge `/api/*` rewrites (`vercel.json`).
3. **Session Recovery & Token Rotation:** Authentication, session restoration, and HttpOnly refresh token rotation were verified across page refreshes and browser restarts.
4. **Trip Lifecycle & Persistence:** Trip creation, waypoint additions, checklist items, and budget records were created, modified, and verified persistently stored in Neon PostgreSQL.
5. **Google Maps State:** Verified that UI gracefully renders the "Google Maps API key is not configured" placeholder state without throwing application errors.
6. **Multi-Tenant Isolation:** User A and User B accounts were tested; User B attempting to access User A's trips received `404 Not Found`, confirming strict tenancy isolation.
7. **Rollback Execution:** Cloud Run revision rollback was executed and validated; traffic was cleanly restored to the active revision afterward.

---

# 30. Security Verification

Completed verification checklist:

### Authentication
- [x] HTTPS works across frontend and backend.
- [x] Access token lifetime is correct (15 minutes, stored in memory).
- [x] Refresh cookie is HttpOnly.
- [x] Refresh cookie is Secure in production.
- [x] Cookie SameSite behavior matches the chosen topology (SameSite=Lax with Vercel same-origin `/api/*` proxy).
- [x] Refresh token survives normal application restarts.
- [x] OAuth flow survives supported restart scenarios (Data Protection keys persisted in Neon PostgreSQL).
- [x] Password reset behavior is production-appropriate (logged via `[PRODUCTION DEMO SENDER]`).

### Authorization
- [x] Unauthenticated business request → 401 Unauthorized.
- [x] User A can access User A's trip.
- [x] User B cannot access User A's trip.
- [x] Nested resources enforce parent trip ownership.
- [x] Cross-user access remains 404 Not Found to prevent resource existence leakage.

### Proxy
- [x] Forwarded headers are correctly processed (`XForwardedFor | XForwardedProto`).
- [x] Client IP rate limiting behaves per user/client behind reverse proxies.
- [x] HTTPS detection works accurately behind Cloud Run.

### Secrets
- [x] No production secrets are committed in source control.
- [x] Production startup rejects placeholder JWT secrets via `ProductionConfigurationValidator`.
- [x] Database credentials are externalized via Google Secret Manager.
- [x] OAuth secrets are externalized via Google Secret Manager.
- [-] Google Maps key is restricted. *(Intentionally deferred: Production Google Maps API key is not configured; UI gracefully renders unconfigured state)*

---

# 31. Testing Strategy

Existing and new test suites protect the application across all layers:

## Test Suites (All 247 Backend Tests Passing)
- **Domain Tests (`RidePlanner.Domain.Tests`):** 93 passed. Validates entity invariants, business logic, and lifecycle rules.
- **Application Tests (`RidePlanner.Application.Tests`):** 109 passed. Validates MediatR query/command handlers, validators, and mapping logic.
- **API Integration Tests (`RidePlanner.Api.IntegrationTests`):** 45 passed. Validates HTTP pipelines, controller endpoints, ProblemDetails, correlation IDs, forwarded headers, rate limiting, and health checks.
- **Frontend Vitest (`frontend/`):** 91 unit and component tests passing across 17 test suites.

---

# 32. Database Migration Safety

### Operational Principles Applied:
1. **Backward Compatibility:** All migrations are strictly additive. Column deletions or destructive alterations are avoided in active releases.
2. **Persistence Guarantee:** Production database is never dropped or automatically recreated.
3. **Independent Concern:** Application rollback and database schema rollback are treated as separate operational actions.

---

# 33. Rollback / Recovery

The deployment architecture provides instant zero-downtime rollback capabilities.

### Cloud Run Instant Revision Rollback
Cloud Run revisions are **immutable snapshots**. When a new revision receives 100% traffic, previous revisions remain available (scaled to zero at zero cost).

#### Instant Traffic Rollback via gcloud CLI:
```bash
# 1. List available revisions and commit tags
gcloud run revisions list \
  --project ride-planner-504308 \
  --region asia-southeast1 \
  --service rideplanner-api \
  --format="table(metadata.name:label=REVISION,status.conditions[0].status:label=ACTIVE,metadata.creationTimestamp:label=CREATED)"

# 2. Route 100% traffic back to the previous known-good revision
gcloud run services update-traffic rideplanner-api \
  --project ride-planner-504308 \
  --region asia-southeast1 \
  --to-revisions PREVIOUS_REVISION_NAME=100

# 3. Confirm traffic distribution
gcloud run services describe rideplanner-api \
  --project ride-planner-504308 \
  --region asia-southeast1 \
  --format="table(status.traffic.revisionName:label=REVISION,status.traffic.percent:label=PERCENT,status.traffic.tag:label=TAG)"
```

#### Instant Traffic Rollback via Google Cloud Console:
1. Open **Cloud Run** in Google Cloud Console for project `ride-planner-504308`.
2. Select service `rideplanner-api` in region `asia-southeast1`.
3. Open the **Revisions** tab and click **Manage Traffic**.
4. Set the desired previous revision to 100% and save. Traffic shifts instantly without container rebuilding.

### Verification of Rollback Procedure
The manual Cloud Run rollback procedure was executed and verified during Sprint 14:
1. Traffic was shifted from the active revision to a previous revision using `gcloud run services update-traffic`.
2. Verified that the previous revision immediately served incoming requests without downtime or container rebuilds.
3. Production traffic was then cleanly returned to 100% on the validated revision.

---

# 34. Implementation Sequence — Completion Record

### P0 — Production Readiness Audit — Complete
- Conducted full audit of configuration, development defaults, rate limiting, and Data Protection.
- Identified need for forwarded headers, persistent Data Protection keys in PostgreSQL, and fast-fail secret validation.

### P1 — Critical Backend Hardening — Complete
- Implemented `ForwardedHeadersOptions` in `Program.cs`.
- Implemented PostgreSQL key ring persistence via `PersistKeysToDbContext<RidePlannerDbContext>()`.
- Implemented controlled startup migrations (`RUN_MIGRATIONS_ON_STARTUP=true`).
- Implemented `ProductionConfigurationValidator.Validate` for fast-fail secret checks.
- Implemented native health check extensions (`/health` and `/ready`) avoiding Cloud Run reserved z-suffix paths.
- Implemented `CorrelationIdMiddleware` for `X-Correlation-ID` header and logger scoping.
- Implemented `DevelopmentEmailSender` with `[PRODUCTION DEMO SENDER]` logging.

### P2 — Containerization — Complete
- Built multi-stage `backend/Dockerfile` with .NET 10 SDK build and non-root runtime image (`USER $APP_UID`) on port 8080.
- Implemented comprehensive `.dockerignore`.
- Created `backend/compose.yaml` providing reproducible local PostgreSQL 17 + API development environment.

### P3 — CI — Complete
- Created `.github/workflows/backend-ci.yml` running .NET 10 restore, build, and tests (247 passing) with NuGet caching.
- Added container build and inspect step (`docker build -f backend/Dockerfile -t rideplanner-api:ci backend`).
- Created `.github/workflows/frontend-ci.yml` running Node 24, npm cache, `npm ci`, lint, build, and tests (91 passing).
- Enforced complete isolation for PRs (zero GCP access or push privileges).

### P4 — Cloud Infrastructure — Complete
- Configured Neon PostgreSQL 18 with connection pooling and SSL in `ap-southeast-1`.
- Configured Google Artifact Registry repository with 10-image retention cleanup policy.
- Configured Google Cloud Run service `rideplanner-api` in `asia-southeast1` with Secret Manager bindings and non-root execution.
- Configured Google Cloud Workload Identity Federation (WIF) and service account `rideplanner-ci` for keyless GitHub Actions OIDC authentication.
- Configured Vercel deployment for React/Vite frontend with `/api/*` rewrites to Cloud Run.

### P5 — First Deployment — Complete
- Deployed initial revision to Google Cloud Run with Neon PostgreSQL.
- Applied all 20 EF Core database migrations successfully on startup.
- Verified `/health` and `/ready` probes responding with HTTP 200 Healthy.
- Verified Vercel frontend connectivity via `/api/*` rewrites.

### P6 — CI/CD — Complete
- Added automated Cloud Run deployment to `.github/workflows/backend-ci.yml` on pushes to `main`.
- Implemented 0% traffic deployment with traffic tag `sha-${SHORT_SHA}`.
- Implemented automated `jq`-based smoke testing for `/health` and `/ready` (verifying `.status == "Healthy"` and `.checks[name="database"].status == "Healthy"`).
- Implemented automated 100% traffic migration upon smoke test success, leaving older revisions for instant rollback.

### P7 — Production Verification — Complete
- Verified live production frontend on Vercel and API on Cloud Run.
- Verified authentication, session restore, and refresh cookie rotation.
- Verified trip management, waypoint creation, and checklist persistence.
- Verified multi-tenant isolation between User A and User B (404 on cross-user access).
- Verified instant revision rollback and restored 100% production traffic.

### P8 — Documentation — Complete
- Documented full production architecture, deployment topologies, and hosting decisions.
- Updated Sprint 14 documentation, roadmaps, and changelog to reflect the actual completed implementation.

---

# 35. Definition of Done

## Application
- [x] Public frontend deployed over HTTPS (Vercel edge CDN).
- [x] Public API deployed over HTTPS (Google Cloud Run in `asia-southeast1`).
- [x] Managed PostgreSQL connected (Neon serverless PostgreSQL 18 with connection pooling).
- [x] Sprint 13 authentication works in production (dual-token JWT + HttpOnly refresh cookies).
- [x] Sprint 13 ownership isolation works in production (User A / User B isolation validated).

## Production Hardening
- [x] Forwarded headers configured (`XForwardedFor | XForwardedProto`).
- [x] Rate limiting uses correct client identity behind proxy (`ResolveClientIp`).
- [x] Data Protection keys persist across restart/redeployment (`DataProtectionKeys` in Neon DB).
- [x] Production migration strategy is implemented (`RUN_MIGRATIONS_ON_STARTUP=true`).
- [x] Production configuration is validated (`ProductionConfigurationValidator.Validate`).
- [x] No insecure default secrets are accepted (fast-fail startup enforcement).
- [x] Production email/reset behavior is explicitly supported or documented (`DevelopmentEmailSender`).

## Docker
- [x] Backend uses multi-stage build (.NET 10 SDK build + runtime image).
- [x] Final image runs non-root (`USER $APP_UID`).
- [x] Container uses correct production port (`ASPNETCORE_HTTP_PORTS=8080`, `EXPOSE 8080`).
- [x] `.dockerignore` excludes secrets, git, and build artifacts.
- [x] Local PostgreSQL can be reproduced with Docker (`backend/compose.yaml` with PostgreSQL 17).

## CI
- [x] Backend build passes in GitHub Actions.
- [x] Backend tests pass (all 247 tests passing hermetically).
- [x] Frontend lint passes (`npm run lint`).
- [x] Frontend build passes (`npm run build`).
- [x] Frontend tests pass (all 91 tests passing across 17 suites).
- [x] Dependency caching is configured (NuGet cache via `setup-dotnet`, npm cache via `setup-node`).
- [x] Pull requests receive automated validation without cloud credentials.

## CD
- [x] Main branch can deploy automatically via GitHub Actions WIF OIDC.
- [x] Deployment occurs only after CI succeeds.
- [x] Post-deployment health verification runs (automated `/health` and `/ready` probes via `jq`).
- [x] 100% traffic migration is gated on successful smoke tests.

## Reliability
- [x] `/health` exists (liveness probe).
- [x] `/ready` exists (readiness probe with database connectivity check).
- [x] Structured JSON logs exist (standardized console output ingested into Cloud Logging).
- [x] Correlation/request IDs are available (`CorrelationIdMiddleware`, `X-Correlation-ID`).
- [x] Sensitive information is not logged (credentials, tokens, secrets excluded).
- [x] Production exception responses remain safe (RFC 7807 ProblemDetails without leaking stack traces).

## Security
- [x] HTTPS enforced across all public endpoints.
- [x] Production CORS is restricted (allows Vercel production origin with credentials).
- [x] Authentication cookie topology is validated (Vercel same-origin `/api/*` rewrites).
- [-] Google Maps key is restricted. *(Intentionally deferred: Production Google Maps API key is not configured; UI gracefully renders unconfigured state)*
- [x] Production secrets are externalized via Google Secret Manager and deployment environment.

## Verification
- [x] Automated synthetic checks pass in CD pipeline.
- [x] Manual production runbook passes.
- [x] Authentication passes in production.
- [x] Trip CRUD passes in production.
- [x] Persistence passes in production.
- [x] Ownership isolation passes in production.

## Documentation
- [x] Deployment guide exists in sprint documentation.
- [x] Environment configuration is documented.
- [x] Migration procedure is documented.
- [x] Rollback/recovery is documented.
- [x] Architecture decisions are documented.

---

# 36. Interview Value

Sprint 14 produced several strong engineering stories:

## CI/CD
> "I separated PR validation from deployment so only validated changes reach production, and deployed to Cloud Run using a 0% traffic canary tag with automated jq-based smoke tests before migrating production traffic."

## Docker
> "I used a multi-stage .NET build and a non-root runtime image on port 8080 so the production container is small, hardened, and has a minimal attack surface."

## Reverse Proxies
> "I accounted for forwarded client IPs because rate limiting based on the raw TCP peer would treat users behind a cloud proxy as one client."

## Authentication Resilience
> "I persisted ASP.NET Core Data Protection keys in PostgreSQL because container filesystems are ephemeral and authentication-related protected state must survive restarts."

## Database Migrations
> "I explicitly designed the production migration path using controlled startup migrations instead of assuming development startup behavior would run in production."

## Health Checks
> "I separated liveness (/health) from readiness (/ready) because a process can be alive while a critical dependency like PostgreSQL is unavailable, and navigated Cloud Run's reservation of z-suffix endpoints."

## Secrets & Validation
> "Production configuration is injected through Secret Manager, and startup validation immediately rejects default development keys or missing connection strings."

## Engineering Judgment
> "RidePlanner had around 5–20 expected users, so I deliberately avoided Kubernetes, multi-region infrastructure, autoscaling, and an elaborate observability platform. I focused on the fundamentals that actually matter: secure configuration, containers, CI/CD, cloud deployment, health checks, logging, migration safety, and operational verification."

---

# 37. Portfolio Outcome

After Sprint 14, RidePlanner demonstrates:

```text
Modern React frontend (Vercel)
        +
.NET 10 backend (Google Cloud Run)
        +
Clean Architecture & CQRS / MediatR
        +
EF Core & Serverless PostgreSQL (Neon)
        +
Authentication & Authorization (ASP.NET Core Identity + JWT + HttpOnly Cookies)
        +
Docker Containerization (Multi-stage, Non-root)
        +
GitHub Actions CI/CD (OIDC / WIF keyless auth)
        +
Zero-Downtime Traffic Migration & Rollback
        +
Health Checks (/health, /ready)
        +
Structured JSON Logging & Correlation IDs (X-Correlation-ID)
        +
Production Security (Forwarded Headers, Data Protection in DB)
```

The application is deployed, operational, and verified.

---

# 38. Future Evolution

Infrastructure should grow when application requirements create a reason:

```text
Higher traffic
    → scaling / multiple replicas / distributed rate limiting

Background AI/OCR workloads
    → job processing / queues

Real-time collaboration
    → SignalR infrastructure

Distributed services
    → OpenTelemetry tracing

Live Maps Activation
    → Restricted production Google Maps API key
```

---

# 39. Final Sprint Principle

> **Deploy what we have. Do not build infrastructure for what we do not have.**

For RidePlanner:

```text
Production readiness
        =
Correct configuration
+ secure authentication
+ correct proxy behavior
+ persistent cryptographic state
+ safe database migrations
+ automated validation
+ reliable deployment
+ health checks
+ useful logs
+ tested production behavior
+ documented recovery
```

Sprint 14 has met and validated this standard.

---

## Document Governance

**Maintainer:** Ride Planner Core Engineering  
**Status:** Complete  
**Previous Sprint:** Sprint 13 — Authentication, User-Owned Workspaces & Profiles  
**Current Sprint:** Sprint 14 — Production Readiness & First Cloud Deployment  
**Next Sprint:** Sprint 15 — Route Weather Matrix & Elevation Profiles

**Source alignment:** Refined from the original Sprint 14 scope in `docs/Sprints/Future-Sprints-Roadmap.md` and updated to reflect the completed production deployment on Vercel, Google Cloud Run, and Neon PostgreSQL.

**Planning principle:** Infrastructure choices must be justified by current application requirements and learning value, not by hypothetical scale.
