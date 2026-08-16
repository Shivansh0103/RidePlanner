# Sprint 10 – Backend Architecture Hardening

**Goal:** Harden and consolidate the RidePlanner backend after completion of Milestone 1 by addressing the majority of findings from the Sprint 10 Backend Refactoring Audit, improving correctness, consistency, performance, testability, and maintainability.

**Status:** Planned  
**Sprint:** 10  
**Theme:** Backend Architecture Hardening

---

# Sprint Overview

Sprint 9 completed the first major product milestone and established RidePlanner as a complete trip lifecycle experience:

```text
Plan
  ↓
Prepare
  ↓
Travel
  ↓
Complete
  ↓
Remember
```

With the core product experience now substantially in place, Sprint 10 intentionally shifts away from adding a major user-facing feature.

Instead, Sprint 10 focuses on strengthening the backend architecture that has grown across the previous sprints.

The sprint is based on the **Sprint 10 Backend Refactoring Audit performed against the current repository state**.

The audit identified issues across:

- CQRS and handler registration
- Controller dependency injection
- Repository and transaction boundaries
- Query performance and read models
- Domain/application boundaries
- API error handling
- EF Core configuration and indexing
- Audit timestamps
- Test architecture
- Configuration and observability

The audit is the primary source for Sprint 10 scope.

---

# Learning Objective

RidePlanner is a personal learning and portfolio project.

Therefore, Sprint 10 is not intended to be a blind cleanup exercise.

For every major refactoring, the implementation process should help establish understanding of:

1. **What problem currently exists?**
2. **Why is the current implementation problematic?**
3. **What architectural concept or pattern addresses the problem?**
4. **How does the new implementation work?**
5. **What advantages and trade-offs does it introduce?**
6. **How does this relate to real-world production systems?**
7. **How could this decision be explained in a software-engineering interview?**

Major refactorings should therefore be reviewed before implementation and verified after implementation.

---

# Architecture Review Baseline

The Sprint 10 Backend Refactoring Audit identified the following major findings.

## CQRS / DI

- Over 45 command/query handlers are manually registered.
- Controllers directly inject multiple concrete handlers.
- Handlers do not use a standardized request/handler abstraction.
- Cross-cutting concerns are not implemented through a pipeline.
- Query handlers can expose tracked domain entities.
- GET queries can currently trigger lifecycle state mutation.

## Persistence

- Every repository exposes `SaveChangesAsync`.
- Repository-level commits create ambiguous transaction boundaries.
- `TripStopRepository.ReorderAsync` commits directly.
- Repository method conventions are inconsistent.
- `IExpenseRepository` is implemented but inconsistently used.

## Query / Performance

- Readiness and Summary execute multiple sequential queries.
- Trip Summary has a correctness issue where expenses can be omitted from the loaded graph.
- Read queries lack `AsNoTracking`.
- Some operations load unnecessarily large aggregate graphs.

## Domain Boundaries

- Lifecycle logic is implemented in an Application service and invoked by GET queries.
- Stop sequence reconciliation is implemented outside the Trip aggregate.

## API

- Missing resources do not consistently map to HTTP 404.
- Error responses use a custom `{ "Error": "..." }` shape instead of standardized ProblemDetails.
- Validation/error handling is not centralized through a consistent application pipeline.

## EF Core / Database

- Some table configurations rely on conventions while others explicitly configure table names.
- Some child entities lack appropriate TripId indexes.
- Audit timestamp handling is inconsistent.
- CORS configuration is hardcoded.
- Startup migration behavior should be reviewed.

## Testing / Observability

- Application tests are currently mixed into Domain.Tests.
- No dedicated API integration-test project exists.
- No meaningful Application test project exists.
- Handler-level logging is absent.
- The default empty UnitTest1.cs should be removed.

---

# Important Scope Decision

Sprint 10 will address **most findings from the audit**.

The following audit finding is intentionally deferred:

### User / Email entities

`User.cs` and `Email.cs` are currently unused.

They will **not be deleted as part of Sprint 10**.

The eventual user/authentication model should be decided alongside future authentication and collaboration work.

---

# Milestone 1 – MediatR & CQRS Standardization

## Objective

Replace the current home-grown command/query dispatching and manual handler registration approach with **MediatR**.

RidePlanner already follows a CQRS-style architecture. MediatR will standardize request dispatching and provide a mature mechanism for pipeline behaviors.

## Scope

- Add the appropriate current MediatR package/version for the .NET 10 application.
- Convert Commands and Queries to MediatR request types.
- Convert handlers to `IRequestHandler<TRequest, TResponse>`.
- Replace direct handler injection in controllers with `ISender`.
- Remove manual registration of individual handlers.
- Register MediatR handlers through assembly scanning.
- Establish consistent Command/Query conventions.
- Introduce a logging pipeline behavior.
- Introduce a validation pipeline behavior where appropriate.
- Ensure existing API behavior remains unchanged during migration.
- Remove obsolete custom CQRS abstractions if they become redundant.

## Learning Focus

Understand:

- CQRS
- Mediator pattern
- Dependency inversion
- Request/handler dispatching
- Dependency injection
- Pipeline behaviors
- Cross-cutting concerns

## Success Criteria

- Controllers no longer inject multiple concrete handlers.
- Existing handlers are dispatched through MediatR.
- Manual handler registration is removed.
- Logging can be applied centrally through a pipeline behavior.
- Validation can be applied centrally where appropriate.
- Existing endpoint behavior remains correct.

---

# Milestone 2 – Unit of Work & Transaction Boundaries

## Objective

Establish a clear application-level persistence boundary.

## Scope

- Introduce `IUnitOfWork`.
- Implement `SaveChangesAsync(CancellationToken)`.
- Remove `SaveChangesAsync` from repository interfaces.
- Remove direct repository-level commits.
- Remove `_context.SaveChangesAsync()` from `TripStopRepository.ReorderAsync`.
- Review all command handlers for their persistence boundaries.
- Review operations involving multiple repositories.
- Determine where explicit database transactions are actually required.
- Standardize repository mutation methods.
- Standardize asynchronous query methods.
- Resolve the inconsistent `IExpenseRepository` usage.

## Target Concept

```text
Command
   ↓
Handler
   ↓
Domain / Repositories
   ↓
IUnitOfWork
   ↓
SaveChangesAsync()
```

The application operation, rather than an individual repository, determines when changes are committed.

## Learning Focus

Understand:

- Unit of Work
- Repository pattern
- EF Core DbContext as a persistence abstraction
- Transaction boundaries
- Atomicity
- Multi-repository operations
- Why premature commits are dangerous

## Success Criteria

- No repository owns the application's final commit boundary.
- Stop reordering participates correctly in the surrounding operation.
- Multi-repository commands have predictable persistence behavior.
- Repository contracts are consistent.

---

# Milestone 3 – Correctness & Read-Model Improvements

## Objective

Fix identified correctness issues and improve the architecture of read operations.

## 3.1 Trip Summary Expense Bug

Fix the identified issue where `GetTripSummaryQueryHandler` can fail to load/query the Budget navigation required for expense totals.

### Requirements

- Actual expenses must be included in Trip Summary.
- `TotalExpenses` must reflect persisted expense data.
- Add a regression test.
- Verify the frontend summary continues to work.

## 3.2 Remove Lifecycle Mutation from GET Queries

GET requests must not mutate trip state.

### Requirements

- Remove lifecycle synchronization from `GetTripQueryHandler`.
- Remove lifecycle synchronization from `GetTripsQueryHandler`.
- Preserve the approved Sprint 9 lifecycle rules.
- Ensure completed trips never automatically reactivate.
- Ensure automatic activation remains available through an appropriate application/domain mechanism.
- Do not introduce an unnecessary background-job system solely for Sprint 10.

The domain should own lifecycle rules, while the application determines when those rules are evaluated.

## 3.3 Read Models

Review:

- `GetTripQuery`
- `GetTripsQuery`
- `GetTripSummaryQuery`
- `GetTripReadinessQuery`

Where appropriate:

- Project directly into DTO/read models.
- Avoid exposing tracked Domain entities to the API layer.
- Avoid loading data that the endpoint does not require.

## 3.4 Query Performance

- Add `AsNoTracking()` to appropriate read-only queries.
- Review unnecessary `Include`s.
- Review sequential multi-query operations.
- Optimize Readiness and Summary queries.
- Use purpose-built projections/read queries where they improve performance and clarity.
- Avoid forcing every query into one SQL statement when multiple carefully designed queries are more appropriate.
- Refactor Expense update/delete operations to avoid loading unnecessarily large aggregate graphs.

## Learning Focus

Understand:

- CQRS read models
- EF Core tracking
- `AsNoTracking`
- LINQ projections
- N+1 queries
- Query round trips
- Aggregate loading
- Query performance trade-offs

---

# Milestone 4 – Domain Boundary & Aggregate Cleanup

## Objective

Strengthen the separation between Domain rules and Application orchestration.

## Scope

### Trip Lifecycle

- Review `TripLifecycleService`.
- Move lifecycle business rules toward the `Trip` aggregate where appropriate.
- Keep orchestration/evaluation timing outside the Domain.
- Ensure GET queries remain side-effect free.

### Trip Stop Ordering

- Review `TripStopSequenceReconciler`.
- Move stop-order invariants into the Trip aggregate where appropriate.
- Ensure the Application layer orchestrates rather than owns core Trip invariants.

## Learning Focus

Understand:

- Domain-Driven Design
- Aggregate roots
- Invariants
- Domain behavior vs application orchestration
- Separation of concerns

## Success Criteria

Core Trip rules are expressed in the Domain where appropriate, while Application services coordinate use cases rather than becoming repositories for business rules.

---

# Milestone 5 – API Error Handling & Validation

## Objective

Provide a consistent and predictable API contract.

## Scope

- Introduce standardized RFC 7807 `ProblemDetails`.
- Replace the custom `{ "Error": "message" }` response shape where appropriate.
- Standardize missing-resource handling as HTTP 404.
- Introduce a suitable `NotFoundException` or equivalent mechanism.
- Review exception-to-HTTP-status mappings.
- Standardize validation failures.
- Integrate validation with the MediatR pipeline where appropriate.
- Preserve existing frontend compatibility or update the frontend contract only where necessary.

## Target Behavior

```text
400 → Invalid request / validation failure
404 → Resource not found
409 → Resource/state conflict where applicable
500 → Unexpected server error
```

The exact mapping should follow the actual application's domain and API needs rather than introducing statuses solely for theoretical completeness.

## Learning Focus

Understand:

- HTTP semantics
- API contracts
- RFC 7807 ProblemDetails
- Exception mapping
- Validation pipelines
- Client/server contract consistency

---

# Milestone 6 – EF Core & Database Hardening

## Objective

Improve persistence consistency and database reliability.

## Scope

### Indexes

Review and add appropriate indexes for:

- `Accommodation.TripId`
- `TripDocument.TripId`
- `TripMemory.TripId`
- Other frequently filtered foreign keys identified during implementation

Do not add indexes blindly; verify their query usefulness.

### EF Core Configuration

Review explicit table configuration for:

- `Trips`
- `TripStops`

Standardize configuration where appropriate.

### Audit Timestamps

Review current timestamp requirements.

Where appropriate:

- Introduce a shared auditing contract.
- Centralize timestamp population through EF Core infrastructure.
- Avoid forcing audit fields onto entities that do not require them.
- Preserve existing historical data semantics.

### Configuration

Move hardcoded CORS origins into application configuration.

Review startup database migration behavior and improve it where appropriate for deployment safety without unnecessarily complicating local development.

## Learning Focus

Understand:

- Database indexes
- PostgreSQL query performance
- EF Core configuration
- Change tracking
- SaveChanges interception
- Configuration management
- Deployment considerations

---

# Milestone 7 – Test Architecture & Regression Coverage

## Objective

Create a sustainable test structure for the growing backend.

## Target Structure

```text
tests/
├── RidePlanner.Domain.Tests
├── RidePlanner.Application.Tests
└── RidePlanner.Api.IntegrationTests
```

## Scope

- Move Application tests out of Domain.Tests.
- Remove empty `UnitTest1.cs`.
- Create `RidePlanner.Application.Tests`.
- Create `RidePlanner.Api.IntegrationTests`.
- Add regression tests for the Trip Summary expense bug.
- Add lifecycle tests.
- Add tests around Unit of Work / persistence behavior where valuable.
- Add tests for refactored application handlers.
- Add API integration tests for important endpoints and error responses.
- Preserve and improve existing Domain tests.

A separate Infrastructure test project is **not required for Sprint 10** unless implementation reveals a clear need.

## Learning Focus

Understand:

- Unit vs application-level testing
- Integration testing
- API contract testing
- Regression tests
- Test project organization
- Testing architectural boundaries

---

# Milestone 8 – Opportunistic Cleanup

These items should be completed when naturally encountered during related work rather than becoming independent workstreams.

- Standardize repository naming.
- Remove obsolete custom CQRS abstractions after MediatR migration.
- Add explicit `.ToTable(...)` configuration where appropriate.
- Remove empty/default test files.
- Clean up redundant using directives and registrations.
- Improve minor EF Core configuration inconsistencies.
- Clean up CORS/configuration after introducing centralized configuration.

---

# Explicitly Deferred

The following are not Sprint 10 scope:

- Deleting `User.cs` / `Email.cs`.
- Authentication implementation.
- User account system.
- Collaboration.
- Group trips.
- Shared expenses.
- Weather integration.
- Smart reminders.
- Trip templates.
- AI trip planning.
- Push notification infrastructure.
- Offline support.
- Major frontend architecture work.

Sprint 11 is planned as the **frontend-focused sprint** following Sprint 10.

---

# Development Workflow

Sprint 10 follows this learning-oriented implementation workflow:

```text
Audit Finding
      ↓
Understand the Problem
      ↓
Understand the Pattern / Alternative
      ↓
Decide the RidePlanner Approach
      ↓
Implement
      ↓
Run Tests / Verify Behavior
      ↓
Review Architecture
      ↓
Document the Learning
```

For significant architectural changes, implementation should not begin until the approach is understood and agreed.

Antigravity should explain architectural changes before implementing them and should explicitly identify:

- What is changing.
- Why it is changing.
- How the new design works.
- Advantages.
- Trade-offs.
- Impact on existing code.
- Relevant interview/software-engineering concepts.

---

# Definition of Done

Sprint 10 is complete when:

## MediatR / CQRS

- [ ] MediatR is integrated using the appropriate current package/version.
- [ ] Commands and Queries use MediatR request abstractions.
- [ ] Handlers implement MediatR handler interfaces.
- [ ] Controllers use `ISender` rather than injecting multiple concrete handlers.
- [ ] Manual handler registration is removed.
- [ ] Logging pipeline behavior is implemented.
- [ ] Validation pipeline behavior is implemented where appropriate.

## Persistence

- [ ] `IUnitOfWork` exists and is used consistently.
- [ ] Repository `SaveChangesAsync` methods are removed.
- [ ] Repository-level commits are removed.
- [ ] Stop reordering uses the surrounding persistence boundary.
- [ ] Repository mutation/query conventions are standardized.
- [ ] Expense persistence responsibility is clarified.

## Correctness / Queries

- [ ] Trip Summary correctly calculates actual expenses.
- [ ] Regression test exists for the expense-summary bug.
- [ ] GET queries are side-effect free.
- [ ] Lifecycle behavior remains correct.
- [ ] Appropriate read models/DTO projections are used.
- [ ] Read-only queries use `AsNoTracking` where appropriate.
- [ ] Major unnecessary aggregate loading is removed.
- [ ] Readiness/Summary query performance is improved without blindly forcing single-query implementations.

## Domain

- [ ] Lifecycle business rules have an appropriate Domain boundary.
- [ ] Trip stop ordering invariants have an appropriate Domain boundary.
- [ ] Application services coordinate use cases rather than owning core invariants.

## API

- [ ] API errors use standardized ProblemDetails.
- [ ] Missing resources consistently return 404.
- [ ] Validation behavior is standardized.
- [ ] Existing frontend API compatibility is verified.

## Database / Infrastructure

- [ ] Relevant missing indexes are added.
- [ ] EF Core table configuration is consistent where appropriate.
- [ ] Audit timestamp strategy is reviewed and implemented where justified.
- [ ] CORS origins are configuration-driven.
- [ ] Startup migration behavior is reviewed.

## Testing

- [ ] Domain.Tests contains Domain tests.
- [ ] Application.Tests contains Application tests.
- [ ] API integration tests exist.
- [ ] Critical Sprint 10 regression scenarios are covered.
- [ ] Backend build succeeds.
- [ ] Relevant automated tests pass.

## Final Verification

- [ ] Existing Sprint 9 functionality remains intact.
- [ ] No Sprint 9 lifecycle/readiness/summary/memory regressions are introduced.
- [ ] Backend API behavior is verified.
- [ ] Database migrations are verified where applicable.
- [ ] Documentation is updated.
- [ ] Sprint 10 changes are committed.

---

# Expected Outcome

Sprint 10 should leave RidePlanner with a backend that is:

- More consistent.
- More testable.
- More observable.
- More performant.
- More predictable at the API boundary.
- Clearer about domain responsibilities.
- Safer around transaction boundaries.
- Easier to extend with future features.
- Easier for a developer to understand and maintain.

More importantly, the sprint should leave the project owner with a deeper practical understanding of modern backend architecture rather than simply a collection of refactored files.

The target progression is:

```text
Sprint 1–9
Build the Product
      ↓
Sprint 10
Harden the Architecture
      ↓
Sprint 11
Harden / Improve the Frontend
      ↓
Future Sprints
Build Milestone 2 Features
```
