# 17. Access JWTs and Rotating HttpOnly Refresh Tokens

* Status: Approved
* Date: September 2026

## Context

A single-page React application (SPA) communicating with an ASP.NET Core REST API needs a secure, seamless authentication mechanism that:
- Protects credentials against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).
- Avoids forcing users to re-enter passwords frequently.
- Supports stateless, scalable API authorization.
- Allows server-side revocation in case of compromised devices or session reuse.

## Decision

We decided to implement a dual-token authentication pattern: **short-lived in-memory JWT access tokens combined with rotating, HttpOnly refresh tokens**:

1. **Short-Lived In-Memory Access JWT**:
   - Access token lifetime is set to **15 minutes**.
   - Contains standard identity claims (`sub`, `email`, `jti`).
   - Stored **strictly in JavaScript memory** (module-level closure in `tokenStore.ts`). It is never stored in `localStorage` or `sessionStorage`, rendering it inaccessible to malicious scripts running via XSS.

2. **Rotating HttpOnly Refresh Tokens**:
   - Refresh token lifetime is set to **7 days**.
   - Transported exclusively via a `Secure`, `HttpOnly`, `SameSite=Lax/Strict` cookie path-scoped to `/api/auth`.
   - Never accessible to client-side JavaScript.
   - Every refresh request rotates the token: the old token is revoked, and a newly generated refresh token is set in the response cookie.
   - Only a cryptographic SHA-256 hash of the refresh token and session family metadata is persisted in the database.

3. **Reuse Detection & Token Family Revocation**:
   - If a previously revoked refresh token is presented (indicating a potential token theft / replay attack), the entire session family for that user is immediately revoked.

4. **Concurrency Deduplication in Frontend**:
   - The frontend transport layer incorporates an in-flight refresh promise singleton (`refreshManager.ts`). Multiple concurrent 401 API responses share the same refresh request to prevent race conditions or false-positive reuse detection triggers.

## Consequences

### Positive

- **Strong XSS Mitigation**: Durable credentials cannot be exfiltrated via client script injection since the refresh token is sealed in an HttpOnly cookie and the access token exists only in memory.
- **Immediate Invalidation**: Server-side session tracking allows immediate revocation of user sessions via logout or automatic invalidation upon reuse detection.
- **Client Flexibility**: The API remains standard Bearer JWT compliant, allowing future native mobile clients to utilize the same backend endpoints.

### Negative

- Requires careful CORS configuration with `.AllowCredentials()` on the API.
- Added complexity in frontend HTTP interceptors to handle concurrency deduplication and background token restoration cleanly.
