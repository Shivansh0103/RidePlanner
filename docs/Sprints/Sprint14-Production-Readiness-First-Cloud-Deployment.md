# Sprint 14 — Production Readiness & First Cloud Deployment

**Status:** Planned  
**Sprint:** 14  
**Version target:** v0.14.0  
**Theme:** Production readiness, containerization, CI/CD, reliability, security, and first public cloud deployment  
**Prerequisite:** Sprint 13 — Authentication, User-Owned Workspaces & Profiles

---

## 1. Sprint Goal

Transition RidePlanner from a locally developed, authenticated multi-user application into a **secure, reproducible, reliably deployed public application**.

Sprint 14 is intentionally proportional to RidePlanner's current scale and purpose. The application is expected to serve a small number of users (roughly 5–20 initially) and is primarily a portfolio and learning project.

The objective is therefore:

> **Production engineering competence, not infrastructure theatre.**

By the end of this sprint, RidePlanner should:

- build reproducibly;
- run in a production container where appropriate;
- keep production configuration and secrets outside source control;
- correctly behave behind a cloud reverse proxy;
- preserve authentication cryptographic state across restarts;
- automatically build and test through GitHub Actions;
- deploy through a repeatable release path;
- expose meaningful liveness/readiness health checks;
- produce useful structured logs;
- run publicly over HTTPS;
- use managed PostgreSQL;
- preserve Sprint 13 authentication and authorization guarantees;
- pass focused deployment verification.

---

# 2. Why This Sprint Matters

Sprints 1–12 established the product and architecture. Sprint 13 established identity, authentication, and user ownership.

Sprint 14 answers the next engineering question:

> **Can we actually ship and operate the application?**

The production path becomes:

```text
Code
  ↓
Pull Request
  ↓
Automated validation
  ↓
Merge to main
  ↓
Build / Deploy
  ↓
Production
  ↓
Health + Logs
  ↓
Smoke Verification
```

The sprint demonstrates:

- CI/CD;
- Docker;
- environment configuration;
- secrets management;
- reverse-proxy awareness;
- cloud deployment;
- database migration discipline;
- health checks;
- structured logging;
- production security;
- deployment verification;
- rollback/recovery thinking.

---

# 3. Independent Review Outcome

An independent senior backend/platform review of the initial Sprint 14 plan identified several production-environment assumptions that needed to be made explicit.

The review agreed with the central scope decision:

- no Kubernetes;
- no service mesh;
- no multi-region deployment;
- no unnecessary autoscaling;
- no enterprise observability stack.

However, it identified important gaps in the original plan:

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

These findings are incorporated into this final Sprint 14 plan.

> **Important:** Hosting and infrastructure decisions for Sprint 14 are now finalized: Vercel for the React/Vite frontend, Google Cloud Run for the containerized .NET 10 API, and Neon for managed PostgreSQL.

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

The finalized production architecture is deliberately simple:

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

                         GitHub Actions
                               │
                               ▼
                         Backend CI/CD
                         → Cloud Run
```

- **Frontend — Vercel**
  - Chosen because it is a simple, low-overhead fit for the React/Vite frontend.
  - Provides straightforward GitHub-based deployment, HTTPS, CDN/edge delivery, and supports rewrites that allow `/api/*` traffic to be proxied to the backend.
  - This also helps preserve a same-origin browser-facing authentication topology for the Sprint 13 HttpOnly refresh-cookie flow.

- **Backend — Google Cloud Run**
  - Chosen because RidePlanner is already containerized/being containerized and Cloud Run provides managed container execution without requiring server management.
  - Scale-to-zero and usage-based operation keep the initial deployment inexpensive.
  - It also provides useful production engineering experience with GCP while keeping operational complexity proportional to the project's current scale.

- **Database — Neon PostgreSQL**
  - Chosen as the managed PostgreSQL provider.
  - Avoids operating a database server ourselves while providing a useful low-cost/free starting point and scale-to-zero characteristics appropriate for a small portfolio application.
  - The database remains independently managed from the Cloud Run application runtime.

- **Custom domain — Deferred**
  - A custom domain will not be purchased for the initial deployment.
  - Provider domains (`vercel.app` and `run.app`) are sufficient for the first public portfolio/learning deployment.
  - A custom domain can be introduced later without changing the fundamental application architecture.

---

## 5.1 Finalized Hosting Decisions

| Area | Decision | Reasoning |
|---|---|---|
| Frontend | Vercel | Simple React/Vite deployment, HTTPS/CDN, GitHub integration, and `/api/*` rewrites |
| Backend | Google Cloud Run | Managed containers, scale-to-zero, low operational overhead, good GCP learning/interview value |
| PostgreSQL | Neon | Managed PostgreSQL, low-cost/free starting point, scale-to-zero, no database server management |
| Custom domain | Deferred | Not required for the initial portfolio deployment |

### Transactional Email

RidePlanner will remain **demo-only for transactional email during the initial public deployment**.

The application already uses the `IEmailSender` abstraction, with `DevelopmentEmailSender` as the current implementation. The development sender logs the password-reset URL rather than delivering a real email.

Do not introduce Resend, Brevo, SendGrid, SES, or another transactional email provider as part of the initial deployment.

Reasoning:

- Real email delivery is not necessary to validate the initial cloud deployment.
- A production email provider would also introduce sender-domain/DNS configuration and another external dependency.
- The existing `IEmailSender` abstraction keeps the architecture ready to introduce a real provider later without changing the authentication/application layer.
- This is an intentional scope decision, not an unfinished architectural design.

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
https://rideplanner.vercel.app/api/*
                  ↓
             Vercel rewrite
                  ↓
https://rideplanner-api-xyz.a.run.app/api/*
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

- `/healthz`;
- `/readyz`;
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

These changes should happen before cloud deployment.

---

## 9.1 Forwarded Headers

Cloud platforms commonly place the application behind a reverse proxy/load balancer.

Configure ASP.NET Core forwarded-header handling so the application correctly understands:

- original client IP;
- original HTTPS scheme;
- proxy forwarding.

This is particularly important because Sprint 13 introduced account-sensitive rate limiting.

Without correct proxy handling:

```text
Many real users
      ↓
Cloud proxy
      ↓
same backend-visible IP
```

could cause rate limiting to treat unrelated users as the same client.

### Required outcome

`ResolveClientIp` must use the client IP established by trusted forwarded-header processing rather than blindly assuming the raw TCP peer is the user.

The deployment's actual proxy/network topology must be understood before deciding whether trusted proxy/network configuration should be explicitly constrained.

---

# 10. Persistent ASP.NET Core Data Protection Keys

Sprint 13 uses ASP.NET Core Data Protection.

Production containers are ephemeral. A container restart must not invalidate cryptographic state that the application expects to survive.

Persist the Data Protection key ring using a durable mechanism appropriate to the deployment.

For example, PostgreSQL can be used through the ASP.NET Core Data Protection EF Core integration:

```text
Application
     ↓
Data Protection
     ↓
Persistent key ring
     ↓
PostgreSQL
```

The implementation must verify that:

- keys survive application restart;
- keys survive redeployment;
- OAuth-related protected state remains valid where required;
- password-reset/account-protection workflows do not unexpectedly depend on ephemeral container storage.

---

# 11. Production Database Migrations

The current development startup path applies migrations only in development.

That cannot remain the production deployment mechanism.

The sprint must explicitly choose a production migration strategy.

## Option A — Controlled Startup Migration

Use a production environment flag such as:

```text
RUN_MIGRATIONS_ON_STARTUP=true
```

and execute migrations during deployment/startup.

This is simple for a single-instance application.

If this approach is chosen, migration execution must be:

- explicitly enabled;
- observable in logs;
- safe to repeat;
- documented;
- reconsidered before introducing multiple API replicas.

## Option B — Deployment Migration

Run an EF Core migration bundle or equivalent release command before application startup.

This provides a cleaner separation:

```text
Deploy
  ↓
Migration
  ↓
Application
```

### Decision Requirement

With Google Cloud Run hosting a single-instance container, Option A (Controlled Startup Migration via `RUN_MIGRATIONS_ON_STARTUP=true` or `Database:RunMigrationsOnStartup`) is finalized for the initial deployment.

The sprint is not complete until:

- a clean production database can be initialized;
- existing data can be migrated safely;
- migrations are repeatable;
- destructive changes are avoided or explicitly handled.

---

# 12. Production Secret Validation

The current configuration must not allow a known development/default secret to silently become a production credential.

Production startup should fail fast when required secrets are missing or contain known placeholders.

Examples:

- JWT signing secret;
- database connection string;
- Google OAuth secret;
- other authentication secrets.

The application should produce a clear configuration error without printing the secret itself.

### Rule

```text
Development default
        ≠
Production fallback
```

A placeholder value should never be accepted as a production credential.

---

# 13. Production Email / Password Reset

Sprint 13 includes password-reset behavior.

For Sprint 14, **Option B is finalized: RidePlanner remains demo-only for transactional email during the initial public deployment**.

The application already uses the `IEmailSender` abstraction, with `DevelopmentEmailSender` logging password-reset links rather than delivering real email. In production, it logs a clear `[PRODUCTION DEMO SENDER]` notice to application logs.

External transactional email providers (Resend, Brevo, SendGrid, SES) are intentionally deferred to avoid DNS/domain management overhead during the initial release. The `IEmailSender` interface ensures a real provider can be dropped in later without code rewrites.

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

CI should run for pull requests and appropriate pushes.

## Backend

```text
dotnet restore
dotnet build --configuration Release
dotnet test --configuration Release
```

Tests must include the existing test projects.

## Frontend

The workflow should explicitly run:

```text
npm ci
npm run lint
npm run build
npm run test
```

where those scripts are present in the current project.

The important point is that "frontend checks where applicable" should become concrete CI quality gates.

---

# 19. CI Dependency Caching

Use dependency caching where supported.

For .NET:

- cache NuGet packages.

For Node:

- cache npm dependencies using the frontend lockfile.

The goal is not micro-optimization.

The goal is:

```text
PR
 ↓
repeatable fast validation
 ↓
developer receives useful feedback quickly
```

---

# 20. CI/CD Separation

Use:

```text
Pull Request
    ↓
CI only
```

and:

```text
main
 ↓
CI
 ↓
Deploy
```

A deployment must not bypass the same build/test gates used for normal validation.

---

# 21. Deployment

The preferred release flow is:

```text
Pull Request
    ↓
CI passes
    ↓
Merge main
    ↓
Build/deploy
    ↓
Health verification
    ↓
Manual/controlled smoke verification
```

Where the hosting provider offers native GitHub deployment integration, prefer that over unnecessary custom cloud credentials.

---

# 22. Health Checks

Use native ASP.NET Core health-check infrastructure.

Do not build custom controllers simply to report health.

## `/healthz`

Liveness:

> Is the process alive?

This should answer whether the application process itself is functioning.

## `/readyz`

Readiness:

> Can this application instance serve normal traffic?

This may check critical dependencies such as PostgreSQL.

Conceptually:

```text
/healthz
   ↓
Process alive
   ↓
200

/readyz
   ↓
Critical dependencies available
   ↓
200 / 503
```

The readiness database check should have a sensible timeout so a temporarily waking managed database does not create misleading behavior.

Health endpoints must not expose:

- connection strings;
- credentials;
- stack traces;
- internal infrastructure details.

---

# 23. Structured Logging

Use structured JSON logging.

The final implementation should make a deliberate choice between:

- native .NET JSON console logging; or
- Serilog if a concrete requirement justifies the additional dependency/configuration.

For a small single-service deployment, native .NET structured JSON logging is a strong default because it reduces dependencies while still producing machine-readable logs.

Useful properties include:

- timestamp;
- level;
- event name;
- HTTP method;
- route;
- status code;
- duration;
- request/correlation ID;
- exception type where safe.

---

# 24. Correlation IDs

Production errors should be traceable between:

```text
Browser
  ↓
API
  ↓
Log entry
```

Introduce a request/correlation identifier.

For example:

```text
X-Correlation-ID
```

or an appropriate ASP.NET Core request identifier.

The identifier should:

- be included in logs;
- be available to application diagnostics;
- be returned in appropriate error responses such as ProblemDetails;
- never contain sensitive information.

This allows a production user report such as:

> "The trip save failed. Correlation ID: ABC123."

to be matched directly to server logs.

---

# 25. Production CORS

If the deployment is cross-origin, production CORS must explicitly allow the deployed frontend origin.

Avoid:

```text
AllowAnyOrigin
```

especially with credentialed authentication requests.

If a same-origin API proxy is selected, CORS becomes significantly simpler because the browser sees one public origin.

Regardless of topology, production browser behavior must be tested in a real browser.

---

# 26. Google Maps API Security

The production browser API key must be restricted.

Use:

- allowed HTTP referrers/domains;
- only required APIs;
- separate development and production keys where practical.

The goal is to ensure a leaked browser key does not become an unrestricted paid API credential.

---

# 27. Production Database

Neon is finalized as the managed PostgreSQL provider.

Neon provides:

- PostgreSQL compatibility;
- backups/recovery options;
- low cost;
- straightforward connection management.

The deployment should document managed-database behavior such as:

- connection limits;
- sleeping/wake behavior if present;
- TLS requirements;
- connection-string configuration.

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

GET /healthz
    ↓
HTTP 200

GET /readyz
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
- [ ] Password reset behavior is production-appropriate.

### Authorization

- [ ] Unauthenticated business request → 401.
- [ ] User A can access User A's trip.
- [ ] User B cannot access User A's trip.
- [ ] Nested resources enforce parent ownership.
- [ ] Cross-user access remains 404 where specified.

### Proxy

- [ ] Forwarded headers are correctly processed.
- [ ] Client IP rate limiting behaves per user/client.
- [ ] HTTPS detection works behind the cloud proxy.

### Secrets

- [ ] No production secrets are committed.
- [ ] Production startup rejects placeholder JWT secrets.
- [ ] Database credentials are externalized.
- [ ] OAuth secrets are externalized.
- [ ] Google Maps key is restricted.

---

# 31. Testing Strategy

Sprint 14 should strengthen the deployment boundary without exploding test scope.

## Existing Tests

CI must continue running:

- Domain tests;
- Application tests;
- API integration tests;
- frontend tests/checks.

## New Tests

Add focused tests for:

### Health

- liveness behavior;
- readiness behavior;
- dependency failure behavior.

### Configuration

- missing required production settings fail clearly;
- insecure placeholder secrets are rejected.

### Proxy

- forwarded client IP is correctly recognized;
- rate limiting does not collapse all users behind the proxy into one identity.

### Data Protection

- key persistence is configured correctly;
- restart does not unexpectedly invalidate supported protected state.

### Deployment Smoke

Automated HTTP checks only.

Business-flow verification remains manual at this scale.

---

# 32. Database Migration Safety

The deployment process must answer:

> What happens if the application version and database schema temporarily differ?

Rules:

1. Prefer backward-compatible migrations.
2. Avoid destructive migrations in the same release as code that still depends on the old schema.
3. Never automatically recreate the production database.
4. Document migration ordering.
5. Understand that rolling back application code does not automatically roll back a database schema.

This becomes increasingly important if RidePlanner later introduces multiple replicas.

---

# 33. Rollback / Recovery

The deployment documentation must explain:

- how to redeploy the previous known-good application version;
- how to inspect deployment logs;
- how to check `/healthz` and `/readyz`;
- how to verify PostgreSQL availability;
- how to disable or replace a broken deployment;
- what database migrations occurred;
- whether the previous application version is compatible with the current schema.

Key principle:

> **Application rollback and database rollback are separate operations.**

---

# 34. Suggested Implementation Sequence

## P0 — Production Readiness Audit

Before infrastructure work:

- inspect current Sprint 13 state;
- identify hard-coded development URLs;
- identify secrets/default values;
- inspect Data Protection;
- inspect database migration behavior;
- inspect rate limiting;
- inspect frontend build configuration;
- inspect logging;
- inspect authentication cookie behavior.

**Deliverable:** production readiness checklist.

---

## P1 — Critical Backend Hardening

Implement:

1. forwarded headers;
2. client IP/rate-limit correctness;
3. Data Protection key persistence;
4. production migration strategy;
5. production configuration validation;
6. native health checks;
7. correlation IDs;
8. production-safe email/reset strategy.

**Deliverable:** backend is production-aware before deployment.

---

## P2 — Containerization

Implement:

1. backend multi-stage Dockerfile;
2. non-root runtime;
3. correct port/binding;
4. globalization verification;
5. `.dockerignore`;
6. local PostgreSQL Compose.

**Deliverable:** reproducible backend runtime.

---

## P3 — CI

Implement:

1. GitHub Actions;
2. .NET restore/build/test;
3. npm install;
4. lint;
5. frontend build;
6. frontend tests;
7. dependency caching.

**Deliverable:** every PR receives automated validation.

---

## P4 — Cloud Infrastructure

Finalized targets:

- frontend: Vercel;
- backend: Google Cloud Run (.NET 10 container);
- database: Neon (managed PostgreSQL).

Then configure:

- HTTPS;
- secrets;
- environment variables;
- CORS/topology;
- authentication;
- Google Maps;
- database.

**Deliverable:** production environment exists.

---

## P5 — First Deployment

Deploy:

```text
Database
    ↓
Backend
    ↓
Migration
    ↓
Health checks
    ↓
Frontend
```

Verify:

- `/healthz`;
- `/readyz`;
- frontend;
- API connectivity.

---

## P6 — CI/CD

Connect:

```text
main
 ↓
CI
 ↓
Deployment
 ↓
Synthetic verification
```

**Deliverable:** repeatable release process.

---

## P7 — Production Verification

Run:

- automated health checks;
- manual authentication flow;
- trip CRUD;
- persistence;
- maps;
- logout/login;
- ownership verification.

**Deliverable:** production smoke-test report.

---

## P8 — Documentation

Document:

- architecture;
- deployment topology;
- environment variables;
- Docker;
- CI/CD;
- migrations;
- health checks;
- logs;
- security;
- rollback.

**Deliverable:** another developer can understand and reproduce the deployment.

---

# 35. Definition of Done

## Application

- [ ] Public frontend deployed over HTTPS.
- [ ] Public API deployed over HTTPS.
- [ ] Managed PostgreSQL connected.
- [ ] Sprint 13 authentication works in production.
- [ ] Sprint 13 ownership isolation works in production.

## Production Hardening

- [ ] Forwarded headers configured.
- [ ] Rate limiting uses correct client identity behind proxy.
- [ ] Data Protection keys persist across restart/redeployment.
- [ ] Production migration strategy is implemented.
- [ ] Production configuration is validated.
- [ ] No insecure default secrets are accepted.
- [ ] Production email/reset behavior is explicitly supported or documented.

## Docker

- [ ] Backend uses multi-stage build.
- [ ] Final image runs non-root.
- [ ] Container uses correct production port.
- [ ] `.dockerignore` excludes secrets/artifacts.
- [ ] Local PostgreSQL can be reproduced with Docker.

## CI

- [ ] Backend build passes.
- [ ] Backend tests pass.
- [ ] Frontend lint passes.
- [ ] Frontend build passes.
- [ ] Frontend tests pass.
- [ ] Dependency caching is configured.
- [ ] Pull requests receive automated validation.

## CD

- [ ] Main branch can deploy automatically.
- [ ] Deployment occurs only after CI succeeds.
- [ ] Post-deployment health verification runs.

## Reliability

- [ ] `/healthz` exists.
- [ ] `/readyz` exists.
- [ ] Structured JSON logs exist.
- [ ] Correlation/request IDs are available.
- [ ] Sensitive information is not logged.
- [ ] Production exception responses remain safe.

## Security

- [ ] HTTPS enforced.
- [ ] Production CORS is restricted.
- [ ] Authentication cookie topology is validated.
- [ ] Google Maps key is restricted.
- [ ] Production secrets are externalized.

## Verification

- [ ] Automated synthetic checks pass.
- [ ] Manual production runbook passes.
- [ ] Authentication passes.
- [ ] Trip CRUD passes.
- [ ] Persistence passes.
- [ ] Ownership isolation passes.

## Documentation

- [ ] Deployment guide exists.
- [ ] Environment configuration is documented.
- [ ] Migration procedure is documented.
- [ ] Rollback/recovery is documented.
- [ ] Architecture decisions are documented.

---

# 36. Interview Value

Sprint 14 should produce several strong engineering stories.

## CI/CD

> "I separated PR validation from deployment so only validated changes reach production."

## Docker

> "I used a multi-stage .NET build and a non-root runtime image so the production container is smaller and has a reduced attack surface."

## Reverse Proxies

> "I accounted for forwarded client IPs because rate limiting based on the raw TCP peer would treat users behind a cloud proxy as one client."

## Authentication Resilience

> "I persisted ASP.NET Core Data Protection keys because container filesystems are ephemeral and authentication-related protected state must survive restarts."

## Database Migrations

> "I explicitly designed the production migration path instead of assuming the development startup migration would run in production."

## Health Checks

> "I separated liveness from readiness because a process can be alive while a critical dependency is unavailable."

## Secrets

> "Production configuration is injected through the deployment environment, and the application refuses insecure placeholder credentials."

## Engineering Judgment

The strongest story may be knowing what **not** to build:

> "RidePlanner had around 5–20 expected users, so I deliberately avoided Kubernetes, multi-region infrastructure, autoscaling, and an elaborate observability platform. I focused on the fundamentals that actually matter: secure configuration, containers, CI/CD, cloud deployment, health checks, logging, migration safety, and operational verification."

---

# 37. Portfolio Outcome

After Sprint 14, RidePlanner should demonstrate:

```text
Modern React frontend
        +
.NET 10 backend
        +
Clean Architecture
        +
CQRS / MediatR
        +
EF Core / PostgreSQL
        +
Authentication
        +
Authorization
        +
Docker
        +
GitHub Actions
        +
Cloud deployment
        +
Health checks
        +
Structured logging
        +
Production security
```

This is already a strong portfolio architecture.

The project does **not** need to pretend to be a hyperscale distributed system.

---

# 38. Future Evolution

Infrastructure should grow when application requirements create a reason.

Possible future triggers:

```text
Higher traffic
    → scaling / multiple replicas

Background AI/OCR workloads
    → job processing / queues

Real-time collaboration
    → SignalR infrastructure

Distributed services
    → stronger tracing / OpenTelemetry

Large workload
    → caching / autoscaling / advanced observability

Global user base
    → CDN / regional architecture
```

The architecture should remain capable of evolving without prematurely implementing these systems.

---

# 39. Final Sprint Principle

> **Deploy what we have. Do not build infrastructure for what we do not have.**

Production readiness is not the number of cloud services deployed.

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

That is the standard Sprint 14 should meet.

---

## Document Governance

**Maintainer:** Ride Planner Core Engineering  
**Status:** Planned  
**Previous Sprint:** Sprint 13 — Authentication, User-Owned Workspaces & Profiles  
**Current Sprint:** Sprint 14 — Production Readiness & First Cloud Deployment  
**Next Sprint:** Sprint 15 — Route Weather Matrix & Elevation Profiles

**Source alignment:** Refined from the original Sprint 14 scope in `docs/Sprints/Future-Sprints-Roadmap.md` and updated using the independent senior backend/platform review supplied for this sprint.

**Planning principle:** Infrastructure choices must be justified by current application requirements and learning value, not by hypothetical scale.
