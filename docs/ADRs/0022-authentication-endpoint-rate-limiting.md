# 22. Authentication Endpoint Rate Limiting Strategy

* Status: Approved
* Date: September 2026

## Context

Security-sensitive authentication endpoints are prime targets for automated attacks:
- **Brute-force credential attacks** against `/api/auth/login`.
- **Automated bot registrations** against `/api/auth/register`.
- **Email flooding & account enumeration abuse** against `/api/auth/forgot-password`.
- **Token brute-forcing** against `/api/auth/reset-password`.
- **Cryptographic decryption denial-of-service** against `/api/auth/external/link-info` and `/api/auth/external/link`.

Without rate limiting, malicious callers can exhaust server compute (e.g. PBKDF2 password hashing, Data Protection decryption) and abuse third-party services (e.g. SMTP email sending).

## Decision

We decided to implement **in-memory, policy-based Fixed Window rate limiting using ASP.NET Core's built-in `Microsoft.AspNetCore.RateLimiting` framework**:

1. **Independent Named Policies**:
   - `LoginRateLimit`: 10 requests / 60 seconds (accommodates shared NAT gateways while preventing high-speed brute force).
   - `RegisterRateLimit`: 3 requests / 60 seconds (prevents automated bulk account creation).
   - `ForgotPasswordRateLimit`: 5 requests / 900 seconds (allows user resends while blocking email flooding).
   - `ResetPasswordRateLimit`: 5 requests / 900 seconds.
   - `ExternalLinkRateLimit`: 10 requests / 900 seconds (protects link-info ticket decryption and link confirmation).

2. **Exemption of Session Refresh (`/api/auth/refresh`)**:
   - Refresh tokens are long, random cryptographic secrets sealed in HttpOnly cookies, not guessable passwords.
   - The backend already enforces single-use token rotation, family tracking, and active reuse detection (`RefreshTokenService`).
   - The frontend coordinates refresh concurrency via `refreshManager.ts`. Imposing aggressive rate limits on `/refresh` risks breaking legitimate session recovery when multiple tabs resume from sleep.

3. **No Queueing (`QueueLimit = 0`)**:
   - Authentication requests reject immediately when limits are exceeded. Interactive users receive immediate feedback, and attackers cannot consume server thread pool resources by filling queues.

4. **Client IP Partitioning**:
   - All unauthenticated auth endpoints partition exclusively by client IP (`httpContext.Connection.RemoteIpAddress`).
   - Partitioning by email was **explicitly rejected** because an attacker could DoS a victim's account simply by spamming requests with the victim's email.
   - Partitioning by authenticated user on `/external/link` was **explicitly rejected** because callers are unauthenticated at the HTTP transport level; decrypting the link ticket inside the partitioner would introduce a CPU exhaustion vector.

5. **RFC 7807 Response & `Retry-After` Header**:
   - Rejections return HTTP 429 with `Content-Type: application/problem+json`.
   - The response includes standard `Retry-After: <seconds>` header extracted from lease metadata.
   - Response body contains standard `ProblemDetails` with `Title = "Too Many Requests"` and human-readable `Detail`.

6. **Pipeline Ordering**:
   - `app.UseRateLimiter()` is positioned **after `app.UseCors("Frontend")`** so rejected 429 responses retain CORS headers, and **before `app.UseAuthentication()`** so unauthenticated floods are rejected before executing expensive JWT verification.

7. **Zero Sensitive Data Logging**:
   - The `OnRejected` handler logs only `{PolicyName}`, `{Method}`, `{Path}`, `{ClientIP}`, and `{RetryAfterSeconds}`. Zero passwords, tokens, tickets, or email addresses enter the logs.

8. **Test Isolation**:
   - In the `Testing` environment, the partitioner honors the `X-Test-Client-IP` header.
   - Standard integration test factories configure generous limits to prevent test suite cross-talk, while dedicated rate-limiting suites test strict limits deterministically.

## Consequences

### Positive

- **Defense in Depth**: Works alongside ASP.NET Core Identity's account lockout (which limits per-account failed attempts) by limiting per-IP request frequency.
- **Resource Protection**: Shields PBKDF2 hashing, database queries, and email delivery services from volumetric abuse.
- **Standards Compliant**: Emits RFC 6585 status codes, RFC 7231 `Retry-After` headers, and RFC 7807 problem details.
- **Zero External Dependencies**: Built entirely with native .NET 10 primitives without third-party libraries.

### Negative

- In-memory rate limiting is currently single-instance. When scaling to multiple instances in Sprint 14, distributed rate limiting (e.g. Redis) or reverse-proxy/edge rate limiting (Cloudflare/Azure Front Door) will be required.
