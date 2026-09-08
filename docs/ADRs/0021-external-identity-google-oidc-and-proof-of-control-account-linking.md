# 21. External Identity (Google OIDC) and Proof-of-Control Account Linking

* Status: Approved
* Date: September 2026

## Context

RidePlanner allows users to authenticate using external identity providers (starting with Google via OpenID Connect).

Integrating external authentication into an existing password-based system introduces several security risks:
1. **Pre-Account Takeover / Email Hijacking**: If an attacker creates an external account with a victim's email or an existing user registers via password and later someone signs in with Google using that email, auto-linking without password verification allows account takeover.
2. **Token Exposure via Query Parameters**: Transmitting JWT access tokens or refresh tokens in redirect URLs exposes credentials to browser history, server access logs, and referrer headers.
3. **Open Redirect Vulnerabilities**: Unvalidated `returnUrl` parameters allow phishing attackers to abuse the OAuth callback to redirect users to malicious domains.
4. **Link Ticket Replay Attacks**: If an account-linking continuation token can be reused, an attacker could intercept or replay linking operations.

## Decision

We decided to implement **Google OIDC authentication with mandatory proof-of-control account linking and cookie-bootstrapped token issuance**:

1. **Standard OpenID Connect via ASP.NET Core Identity**:
   - Google authentication runs through ASP.NET Core's `AddGoogle` with `IdentityConstants.ExternalScheme` temporary cookie.
   - User identity is keyed by the immutable provider pair (`Provider = "Google"`, `ProviderKey = subject_id`), not by mutable email.

2. **Atomic Registration for New Users**:
   - If the Google identity has no existing RidePlanner account, the system creates `ApplicationUser`, `UserProfile`, and `AspNetUserLogins` atomically within a database transaction.

3. **Strict Proof-of-Control for Existing Accounts (No Auto-Linking)**:
   - If a Google account matches an existing local email, the server **refuses to auto-link**.
   - The user is redirected to `/auth/link-account` with an encrypted `linkTicket`.
   - The ticket is generated via `IDataProtectionProvider` with a 10-minute expiry and contains `UserId`, `Provider`, `ProviderKey`, and sanitized `ReturnUrl`.
   - The user must enter the password for the existing account. The backend validates it with `CheckPasswordSignInAsync(user, password, lockoutOnFailure: true)` before executing `AddLoginAsync`.

4. **Anti-Replay Protection**:
   - Successfully used link tickets are marked spent in `IMemoryCache` for their remaining lifetime.
   - Redundant calls reject immediately if the external login already exists or the ticket is marked spent.

5. **Cookie-Bootstrapped Session (No Tokens in URLs)**:
   - Upon successful sign-in or account linking, the server writes the standard rotating HttpOnly refresh cookie (`Path=/api/auth`) and redirects the browser to `/auth/callback?status=success&returnUrl=...`.
   - The SPA calls `POST /api/auth/refresh` to bootstrap its in-memory access token. No JWTs or sensitive credentials ever enter URL query strings.

6. **Strict Return URL Validation**:
   - All `returnUrl` inputs are sanitized via `ReturnUrlValidator`, rejecting external protocols, protocol-relative URLs, and unapproved domains.

## Consequences

### Positive

- **Immunity to Pre-Account Takeover**: Existing accounts cannot be hijacked simply by presenting a matching Google email.
- **Zero URL Credential Leakage**: Tokens never appear in browser history or access logs.
- **Anti-Replay Safety**: Protected link tickets cannot be reused.
- **Uniform Session Architecture**: Google users receive the identical dual-token session architecture as password users.

### Negative

- Users with existing accounts must provide their password once when linking Google Sign-In.
- Requires ASP.NET Data Protection configuration and Google OAuth developer credentials.
