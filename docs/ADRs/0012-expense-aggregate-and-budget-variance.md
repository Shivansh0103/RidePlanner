# 12. Expense Aggregate and Zero-Persisted-Redundancy Financial Analysis

* Status: Approved
* Date: August 2026

## Context

Sprint 8 delivered actual expense tracking and Budget vs Actual visual analytics.

Riders needed a way to log real transactions (Cash, UPI, Credit Card, Debit Card) during or after a trip and compare actual spending against their target budget (`TargetBudget`) and category estimates (`BudgetEstimate`).

A critical design choice was whether to persist actual totals (`ActualCost`), category totals (`CategoryActualTotal`), or variance (`BudgetVariance`) as database columns on `TripBudget` or `Trips` tables.

## Decision

1. **Expense Aggregate Entity**:
   - `Expense` is modeled as a domain aggregate entity owned directly by the `TripBudget` aggregate root.
   - Belongs to a category (`Fuel`, `Accommodation`, `Food`, `Tolls/Permits`, `Miscellaneous`).
   - Supports payment method tagging (`PaymentMethod` enum) and optional references to `Accommodation` or `TripStop`.

2. **Zero Persisted Financial Redundancy**:
   - All financial summary metrics (`ActualCost`, `RemainingTargetBuffer`, `Variance`, and category actual totals) are computed dynamically as derived properties on `TripBudget` and projected in CQRS read models.
   - Zero summary columns or calculated totals are saved in PostgreSQL database tables.

3. **Accommodation Double-Counting Safeguard**:
   - Expenses can be explicitly linked to an `Accommodation` entity.
   - Accommodation cost totals in budget comparisons account for linked expenses to ensure stay costs are never double-counted when logged both as a stay reservation and a cash transaction.

## Consequences

### Positive
- **100% Data Integrity**: Financial variance and actual totals are guaranteed never to become stale when expenses are edited, updated, or removed.
- **Clean Database Schema**: Keeps `Expenses` and `TripBudgets` table definitions simple, decoupled, and audit-friendly.

### Negative
- Query handlers must fetch the `Expenses` collection when loading `TripBudget` for financial calculations. Efficiently handled via EF Core `.Include(b => b.Expenses)`.
