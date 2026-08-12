# Sprint 8 – Actual Expense Tracking & Budget vs Actual

**Goal:** Provide actual expense logging and real-time Budget vs Actual financial analysis for RidePlanner trips while keeping planned estimates (`BudgetEstimate`) and actual transactions (`Expense`) strictly independent.

**Status:** Completed  
**Sprint:** 8  
**Theme:** Actual Expense Tracking & Budget vs Actual

---

## Sprint Overview

Sprint 8 introduces actual financial tracking to RidePlanner.

Sprint 6 established target budget management and category-wise planned estimates (`BudgetEstimate`).  
Sprint 7 added accommodation stay planning with automatic cost synchronization into planned `BudgetEstimate` items.

Sprint 8 addresses the next key financial capability:

> **How much money did I actually spend during or for this trip, and how does it compare to what I planned?**

### Core Architectural Principles

1. **Strict Independence of Planned vs. Actual**:
   - `BudgetEstimate` represents planned spending allocations.
   - `Expense` represents real monetary transactions (cash, UPI, card).
   - Logging an expense does **not** mutate or require a `BudgetEstimate`.

2. **Accommodation Safety & No Double-Counting**:
   - Accommodation stays sync **only** to planned `BudgetEstimate` items.
   - Accommodation creation/updates must **never** automatically generate an `Expense`. Actual payments are logged explicitly by the user.

3. **Zero Persisted Derived Redundancy**:
   - Total actual spending (`ActualCost`), category actual sums, and variances are calculated dynamically on query projection. They are **never** stored as redundant database columns.

4. **Consistent Variance Semantics**:
   - `RemainingTargetBuffer` = `TargetBudget - ActualCost`
   - `Variance` = `Actual - Planned`
     - Positive (`+`) → Over planned amount
     - Negative (`-`) → Under planned amount
     - Zero (`0`) → Exactly on budget

---

# Sprint Goals

By the end of Sprint 8, users should be able to:

- Log actual expenses incurred before or during a trip.
- Assign expenses to existing budget categories (`Fuel`, `Accommodation`, `Food`, `TollsAndPermits`, `Miscellaneous`).
- Record transaction metadata (amount, expense date, payment method, notes, optional accommodation/stop link).
- View a dedicated Expense Log with sorting, filtering, and CRUD operations.
- View category-level and trip-level Budget vs Actual comparisons.
- View financial status indicators on the Overview Dashboard.

---

# Milestones

## Milestone 1 – Expense Domain & Persistence (Backend Phase 1)
- `Expense` domain aggregate entity under `TripBudget`.
- `PaymentMethod` enum (`Cash`, `UPI`, `CreditCard`, `DebitCard`, `Other`).
- `TripBudget` aggregate encapsulation (`_expenses` collection, `AddExpense`, `UpdateExpense`, `RemoveExpense`).
- Domain invariants & unit tests.
- EF Core configuration (`ExpenseConfiguration`) and `DbContext` registration.
- `IExpenseRepository` and `ExpenseRepository`.
- EF Core Database Migration `AddActualExpenseTracking`.
- Accommodation safety tests ensuring accommodation creation never generates `Expense` records.

## Milestone 2 – CQRS Application Layer & Reporting Projections (Backend Phase 2)
- Application DTOs (`ExpenseDto`, `CreateExpenseRequest`, `UpdateExpenseRequest`).
- CQRS Commands: `CreateExpenseCommand`, `UpdateExpenseCommand`, `DeleteExpenseCommand`.
- Database-side aggregation projections for Budget vs Actual summaries (`GetTripBudgetQuery`).
- Extended `TripBudgetDto` with `ActualCost`, `ActualVsTargetVariance`, and `ActualVsEstimatedVariance`.

## Milestone 3 – API Controller & Backend Verification (Backend Phase 3)
- `ExpensesController` under `/api/trips/{tripId}/expenses`.
- Endpoints for `GET`, `POST`, `PUT`, `DELETE`.
- Updated `TripBudgetsController` to serve Budget vs Actual payload.
- API integration tests and verification.

## Milestone 4 – Frontend Expense Management & Analytics (Frontend Phase 4)
- TypeScript types and Zod validation schemas for Expenses.
- TanStack Query hooks (`useTripExpenses`, `useCreateExpense`, `useUpdateExpense`, `useDeleteExpense`).
- `ExpenseLogTable` component with category/payment filters.
- `LogExpenseDialog` & `EditExpenseDialog` modal forms.
- `BudgetVsActualBreakdown` table & visual comparison cards in `BudgetSection.tsx`.

## Milestone 5 – Overview Dashboard Integration & End-to-End Polish (Phase 5)
- Update `OverviewBudgetCard.tsx` with Actual Spent metrics.
- End-to-end verification and UI polish pass.

---

# Out of Scope

The following are explicitly **out of scope** for Sprint 8:

- Receipt image upload / OCR scanning
- Bank / Credit card automatic API synchronization
- Multi-currency conversion or live exchange rates
- Expense splitting between multiple riders / reimbursement calculations
- AI automatic categorization of transactions

---

# Success Criteria

- [ ] `Expense` domain aggregate entity implemented with validation invariants.
- [ ] `TripBudget` updated with `Expenses` collection and encapsulated domain methods.
- [ ] Database migration `AddActualExpenseTracking` created and applied.
- [ ] Accommodation stays remain isolated from actual expenses (no double-counting).
- [ ] CQRS commands/queries implemented with database-side projection for actual totals.
- [ ] REST API endpoints created and verified.
- [ ] Frontend Expense Log and Budget vs Actual visual analytics implemented.
- [ ] All unit and integration tests pass cleanly.
