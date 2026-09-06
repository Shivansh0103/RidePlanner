# 18. Explicit Owner-Scoped Repositories as Primary Isolation Control

* Status: Approved
* Date: September 2026

## Context

Multi-user tenancy requires reliable data isolation so that a user cannot query, modify, or delete another user's trips or associated data.

Two primary patterns exist in EF Core architectures:
1. **Global Query Filters**: Implicitly appending `WHERE OwnerUserId = @CurrentUserId` across all queries on configured entity types.
2. **Explicit Owner-Scoped Repository Methods**: Requiring application CQRS handlers to supply the authenticated owner's `userId` when querying or mutating data (e.g. `GetByIdAndOwnerAsync(tripId, ownerUserId)`).

Global query filters introduce risks: they can be accidentally disabled with `IgnoreQueryFilters()`, fail silently during background processing or multi-step migrations, make integration testing difficult, and conceal security logic from code review.

## Decision

We decided to use **explicit owner-scoped repository methods** as the primary multi-user isolation and authorization control:

1. **Explicit Repository Contracts**:
   - Repositories provide owner-scoped signatures, such as `ITripRepository.GetByIdAndOwnerAsync(Guid id, Guid ownerUserId, CancellationToken ct)`.
   - CQRS command and query handlers obtain the authenticated rider's ID via `ICurrentUserService` and pass it directly into the repository methods.

2. **404 Over 403 for Cross-User Access**:
   - If a user requests a trip ID that exists in the database but belongs to another user, the repository query returns `null`, causing the application layer to throw `NotFoundException` (`404 ProblemDetails`).
   - Returning `404 Not Found` rather than `403 Forbidden` prevents enumeration attacks and information leakage regarding whether a resource ID exists in the system.

3. **Global Query Filters Reserved for Defence-in-Depth**:
   - EF Core global query filters may be added later as secondary defense-in-depth, but the codebase will never rely on them as the primary access boundary.

## Consequences

### Positive

- **Explicit Security Boundary**: Data access filters are clearly visible and auditable in application code and SQL queries without hidden framework magic.
- **Enumeration Protection**: Unauthorized requests cannot confirm the existence of third-party trip IDs.
- **Testability**: Unit and integration tests can easily verify both authorized and unauthorized user scenarios by injecting test user contexts without having to bypass framework filter state.

### Negative

- Repository interface signatures must explicitly accept the owner's `userId`, requiring slightly more verbose repository methods.
