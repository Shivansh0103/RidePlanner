# 16. Scope User Ownership at the Trip Aggregate Root

* Status: Approved
* Date: September 2026

## Context

Prior to Sprint 13, trip planning data was stored without user association. Transitioning to a multi-tenant platform required establishing a clear ownership and data partitioning model.

We needed to decide at which entity levels to apply user ownership foreign keys (`OwnerUserId`). The choices were:
1. Denormalize `OwnerUserId` across all domain entities (`Trip`, `TripStop`, `TripBudget`, `Expense`, `Accommodation`, `TripDocument`, `EmergencyContact`, `TripMemory`, `TripChecklist`).
2. Scope ownership exclusively at the `Trip` aggregate root and infer ownership of child entities through their relationship to the parent trip.

## Decision

We decided to scope user ownership **exclusively at the `Trip` aggregate root**:

1. **Foreign Key on `Trip`**:
   - Add a required, non-nullable foreign key `OwnerUserId: Guid` on the `Trip` entity, constrained to `AspNetUsers.Id` with `ON DELETE CASCADE`.
   - Existing anonymous trips in legacy environments are assigned to an initial seeded owner via database migration.

2. **Implicit Child Ownership**:
   - Descendant entities (`TripStop`, `TripBudget`, `Expense`, `Accommodation`, `TripDocument`, `EmergencyContact`, `TripMemory`, `TripChecklist`) do not carry an `OwnerUserId` column.
   - Access control and authorization for any descendant resource is verified by checking the ownership of its parent `Trip`.
   - Deleting a `Trip` automatically cascades and deletes all associated descendant data.

## Consequences

### Positive

- **Single Source of Truth**: Eliminates redundant ownership columns across 8+ database tables, preventing data anomalies where a child entity might inadvertently point to a different owner than its parent trip.
- **Simplified Domain Models**: Domain entities beneath the `Trip` aggregate remain focused purely on travel and itinerary logic without repetitive tenancy plumbing.
- **Clear Aggregate Boundaries**: Fully aligns with Domain-Driven Design principles where `Trip` is the aggregate root boundary governing lifecycle and consistency.

### Negative

- Direct queries or mutations on child entities (e.g. updating a single `Expense` or `TripDocument`) require traversing the parent `Trip` or joining to `Trips` to verify `OwnerUserId`.
