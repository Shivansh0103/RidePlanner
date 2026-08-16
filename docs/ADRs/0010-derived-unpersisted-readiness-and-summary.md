# 10. Derived Unpersisted Readiness and Summary Read Models

* Status: Approved
* Date: August 2026

## Context

In Sprint 9, RidePlanner introduced **Pre-Ride Trip Readiness** and **Post-Ride Trip Summary Report** features to support the rider's trip lifecycle.

A key design choice was deciding whether readiness scores (`ScorePercentage`, `IsReady`) and summary metrics (`TotalDurationDays`, `BudgetVariance`, `ChecklistCompletionPercentage`, `TotalAccommodationCost`) should be persisted as database columns or table snapshots.

Persisting aggregate metrics creates stale data risks whenever underlying trip items (stops, checklist items, expenses, accommodations, documents) are updated or deleted post-completion.

## Decision

We decided to keep `TripReadiness` and `TripSummary` as **zero-persisted-redundancy derived domain value objects** computed dynamically on demand:

1. **TripReadiness**:
   - Evaluated dynamically in `GetTripReadinessQueryHandler`.
   - Evaluates 6 domain categories:
     - *Required Checklist* (blocking)
     - *Required Documents* (blocking)
     - *Journey Plan* (blocking, requires route OR itinerary stops)
     - *Accommodation Stays* (informational)
     - *Emergency Contacts* (informational)
     - *Budget Target* (informational)
   - Zero database columns or readiness snapshot tables.

2. **TripSummary**:
   - Calculated dynamically in `GetTripSummaryQueryHandler`.
   - Projects live statistics from existing trip aggregates without storing redundant summary columns on the `Trips` table.

## Consequences

### Positive
- **Guaranteed Consistency**: Summary reports and readiness health scores never become stale or out-of-sync when trip data is modified.
- **Clean Schema**: Avoids polluting the database schema with redundant, denormalized columns.
- **Flexible Rules**: Business rules for readiness calculation can be updated without requiring database migrations to recalculate historic rows.

### Negative
- Query handlers must fetch supporting collections (stops, checklist items, documents, contacts, accommodations, expenses) to compute derived models. Mitigated efficiently through targeted EF Core query projections.
