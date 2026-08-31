# Sprint 13 — Authentication, User-Owned Workspaces & Profiles

**Status:** Planned  
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

---

## 9. Frontend implementation plan

### Auth state and API integration

- Create an `auth` feature with typed contracts, API client, query keys, hooks, and UI components.
- Hold the access token in memory only.
- Attach `Authorization: Bearer <token>` through Axios request interception.
- On a single eligible `401`, attempt token renewal; retry the original request once; otherwise clear session state and navigate to login.
- Bootstrap identity with refresh/current-user recovery at app start.
- Clear TanStack Query caches on logout or user change.
- Prevent protected application queries from running until auth bootstrap completes.

### Pages and routes

- `/login`: email/password sign-in, Google option, error and loading states.
- `/register`: display name, email, password, password-strength guidance, accepted terms UI where applicable.
- `/forgot-password` and `/reset-password`: only enabled when the email sender workflow is operational.
- Route protection for all application pages containing user data.
- Explicit authenticated redirect behavior so deep links return to the intended page after sign-in.

### Settings experience

Extend the existing Obsidian Velocity shell with:

- user avatar/name menu;
- profile settings drawer/dialog;
- preferred currency and distance unit controls;
- default vehicle fields;
- sign-out action;
- form validation and useful success/failure feedback.

---

## 10. Security checklist

- [ ] Every existing business endpoint requires authenticated access.
- [ ] Every trip read/write resolves ownership with the current user.
- [ ] Cross-user access returns 404 and makes no data change.
- [ ] Passwords are handled exclusively by Identity APIs; passwords never enter logs.
- [ ] Refresh tokens are random, hashed at rest, time-limited, rotated, and revocable.
- [ ] Refresh cookies use `HttpOnly`, `Secure`, and an intentionally selected `SameSite`/path policy.
- [ ] Access token validation checks issuer, audience, signing key, and lifetime.
- [ ] Google sign-in uses registered redirect URIs and trusted provider validation.
- [ ] Sensitive auth endpoints are rate-limited.
- [ ] CORS and cookie behavior are documented for the Sprint 14 hosting topology.
- [ ] Secrets are loaded from local secret/configuration providers, never committed to source control.
- [ ] Logs redact `Authorization`, cookies, passwords, reset tokens, and refresh tokens.

---

## 11. Testing and verification

### Backend tests

- Registration validates input and creates an identity/profile correctly.
- Login succeeds only with valid credentials.
- Invalid credentials return a non-enumerating response.
- JWT validation rejects expired, incorrect-issuer, incorrect-audience, and invalid-signature tokens.
- Refresh rotation invalidates the old token and revocation prevents reuse.
- Google identity linking/creation is tested at the appropriate abstraction boundary.
- Trip creation assigns the authenticated user as owner.
- User A can perform allowed operations on their own trip.
- User B receives 404 for User A’s trip, stop, accommodation, budget/expense, checklist, document, contact, and memory routes.
- Existing domain/application/API behavior remains covered after ownership changes.

### Frontend tests

- Auth form Zod validation.
- Protected-route redirect and return navigation.
- API client attaches access token.
- Single 401 refresh/retry behavior, including failure fallback.
- Logout clears cached user-scoped data.
- Settings validation and preference save behavior.

### Manual verification matrix

| Scenario | Expected result |
| --- | --- |
| Anonymous visit to `/trips` | Redirect to sign-in; API request is not allowed |
| New account registration | User can enter a private empty workspace |
| User A creates a trip | Trip is visible only to User A |
| User B opens User A’s known trip URL | UI cannot load it; API returns 404 |
| Access token expires | Session renews once without losing current work |
| Refresh token is revoked/expired | Session ends safely and returns to sign-in |
| Profile vehicle defaults update | New planning/fuel flows inherit allowed defaults |
| Logout then sign in as another user | No prior user trip data remains visible |

---

## 12. Learning plan and evidence

For every major implementation milestone, record the following in a Sprint 13 learning log or ADR:

1. **Problem:** What limitation or risk existed before the change?
2. **Options:** What alternatives were evaluated?
3. **Decision:** What was selected and why?
4. **Mechanics:** How does it work in this codebase?
5. **Trade-offs:** What complexity or future constraint was accepted?
6. **Security:** What attack/risk does it reduce, and what risk remains?
7. **Verification:** Which test or manual proof demonstrates the behavior?
8. **Interview explanation:** A concise explanation of the decision and its trade-off.

### Suggested learning checkpoints

| Checkpoint | Demonstrate understanding by explaining |
| --- | --- |
| Identity setup | Why a password hash is not encryption and why framework identity is preferred |
| JWT setup | JWT header/payload/signature and why decoding is not verification |
| Refresh flow | Why a 15-minute access token can coexist with a long-lived session |
| Ownership | Authentication versus authorization and why owner checks belong in server code |
| Migration | How anonymous rows become owned without leaving a null-owner loophole |
| Browser security | Why refresh tokens are not placed in local storage |
| Tests | Why an ownership integration test protects more than a unit test alone |

---

## 13. Documentation deliverables

- [ ] ADR: ASP.NET Core Identity boundary and placement.
- [ ] ADR: Trip aggregate ownership model.
- [ ] ADR: Access/refresh token session strategy.
- [ ] ADR: Currency, unit, and vehicle-default semantics.
- [ ] Local setup guide for Identity, JWT, Google, and email environment configuration.
- [ ] Production configuration handoff for Sprint 14.
- [ ] Updated architecture/domain/data-model documentation.
- [ ] Updated API documentation with authentication requirements and problem-response behavior.
- [ ] Updated changelog/version/readme after completion.
- [ ] Sprint learning log with decision evidence and verification results.

---

## 14. Definition of done

Sprint 13 is complete only when all of the following are true:

### Functional

- [ ] A user can register, sign in, sign out, recover/reset a password, and sign in through Google where configured.
- [ ] A signed-in user has a private workspace and can use all existing RidePlanner feature flows.
- [ ] Existing user-facing trip and child-resource API endpoints are authenticated.
- [ ] Profile preferences and one default vehicle profile persist and influence intended defaults.

### Security

- [ ] No anonymous caller can access planning data.
- [ ] No user can read, infer, update, or delete another user’s data.
- [ ] Tokens, secrets, and credentials follow the security checklist.
- [ ] Legacy development data is safely assigned or intentionally reset, with no orphaned owned records.

### Engineering quality

- [ ] Domain remains independent of ASP.NET Identity and HTTP infrastructure.
- [ ] Existing tests remain green and new identity/isolation tests are added.
- [ ] Frontend build, lint, and test suite pass.
- [ ] API integration tests include at least two distinct authenticated users.
- [ ] Database migration succeeds from a clean database and an approved legacy-development scenario.
- [ ] Documentation and ADRs describe the final—not merely planned—implementation.

### Learning

- [ ] Each ADR includes rationale and trade-offs.
- [ ] Each major technical decision has a verification exercise.
- [ ] The developer can explain the authentication, session, ownership, and browser-security model without relying on generated code.

---

## 15. Key decisions to confirm before implementation

1. Begin with both email/password and Google sign-in, or make Google sign-in a later Sprint 13 milestone?
2. Which approved development account should receive existing anonymous local trips during the one-time legacy-data migration?
3. Is the selected initial default vehicle profile sufficient, with a multiple-vehicle garage intentionally deferred?
4. What frontend/API hosting topology will Sprint 14 target: same-site reverse proxy or separately hosted frontend/API origins? This determines final refresh-cookie and CORS policy.
5. Which transactional-email provider will be used for production password-reset delivery in Sprint 14?

---

## 16. Sprint success statement

Sprint 13 succeeds when RidePlanner stops being a shared anonymous local application and becomes a secure, user-owned planning platform—while its implementation leaves the developer with a practical understanding of identity, sessions, authorization, data isolation, migrations, and security testing.

