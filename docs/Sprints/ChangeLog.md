# Changelog

All notable changes to Ride Planner will be documented in this file.

The project follows an incremental sprint-based development approach.

---

# [v0.8.0] - Sprint 8 Complete

Release Date: August 2026

## Overview

Sprint 8 delivered **Actual Expense Tracking & Budget vs Actual Analysis**, enabling riders to log real cash, UPI, and card transactions incurred for a trip, and compare them against their planned budget estimates (`BudgetEstimate`) and target budget (`TargetBudget`).

Key capabilities delivered include Expense domain aggregate entity, PaymentMethod enum, zero-persisted-redundancy derived financial calculations, accommodation safety safeguards preventing double-counting, CQRS application commands & query handlers, REST API endpoints (`/api/trips/{tripId}/expenses`), dedicated Expense Log Data Table with category/payment filters, Budget vs Actual visual comparison matrix, and trip Overview Dashboard spending metrics.

---

## Added

### Expense Domain & Aggregate (`RidePlanner.Domain.Entities.Budget.Expense`)
- `Expense` domain entity owned by `TripBudget` aggregate root with domain validation invariants (`Amount > 0`, non-empty title max 200, notes max 1000).
- `PaymentMethod` enum (`Cash`, `UPI`, `CreditCard`, `DebitCard`, `Other`).
- Encapsulated domain operations: `AddExpense`, `UpdateExpense`, `RemoveExpense`.
- Dynamic derived calculations (**zero persisted database redundancy**): `ActualCost`, `GetCategoryActualTotal`, `RemainingTargetBuffer` (`TargetBudget - ActualCost`), and `Variance` (`ActualCost - EstimatedCost`).

### EF Core Persistence & Database Migration
- `ExpenseConfiguration` mapping to `"Expenses"` table with precision `numeric(18, 2)`, cascade delete from `TripBudget`, and optional set-null references to `Accommodation` and `TripStop`.
- Database Migration `20260812190048_AddActualExpenseTracking` and `ExpenseRepository` implementation.

### CQRS Application Layer & API Controller (`RidePlanner.Api`)
- `ExpenseDto`, `CreateExpenseRequest`, `UpdateExpenseRequest`, and `ExpenseMappings`.
- CQRS commands (`CreateExpenseCommand`, `UpdateExpenseCommand`, `DeleteExpenseCommand`) and queries (`GetTripExpensesQuery`).
- REST `ExpensesController` under `/api/trips/{tripId}/expenses` (`GET`, `POST`, `PUT`, `DELETE`).

### Frontend Expense Log & Budget vs Actual Visual Analytics (`frontend/src/features/budget`)
- TypeScript types and Zod `expenseSchema` validation.
- TanStack Query hooks (`useTripExpenses`, `useCreateExpense`, `useUpdateExpense`, `useDeleteExpense`).
- **Sub-navigation View Switcher** in `BudgetSection.tsx`: `[ Budget vs Actual Analysis | Planned Estimates | Expense Log ]`.
- `ExpenseLogTable` with category and payment mode filter dropdowns.
- `BudgetVsActualBreakdown` matrix comparing Planned Estimates vs Actual Spent per category with progress bars and color-coded variance chips.
- `LogExpenseDialog` & `DeleteExpenseDialog` modals.
- Updated `OverviewBudgetCard.tsx` displaying Actual Spent and Remaining Target Buffer on the Overview Dashboard.

---

# [v0.7.0] - Sprint 7 Complete

Release Date: August 2026

## Overview

Sprint 7 delivered **Accommodation & Stay Planning**, introducing accommodation as a first-class planning concept while integrating it naturally with existing Itinerary, Map, Budget, and Overview Dashboard features.

Key capabilities delivered include accommodation CRUD, stay dates & derived nights calculation, optional Google Places enrichment, manual location-less stay support ("Address Only"), automatic 1:1 Budget estimate synchronization, canonical Accommodation Dialog in Itinerary, auto-redirect workflow for Hotel category stops, and authoritative chronological sequence reconciliation.

---

## Added

### Accommodation Domain & Aggregate (`features/accommodations`)
- `Accommodation` domain aggregate entity tied 1:1 to `TripStop` with `Nights` calculation (`CheckOutDate - CheckInDate`).
- Support for 6 accommodation types (`Hotel`, `Hostel`, `Homestay`, `Resort`, `Campsite`, `Other`).
- Reservation and contact metadata (`ConfirmationNumber`, `ContactName`, `ContactPhone`, `Website`, `BookingNotes`, `Cost`).

### Google Places Enrichment & Manual Entry
- Optional prefill from Google Places Autocomplete without making Google the source of truth.
- Full manual entry support for stays without Google Places lookup ("Address Only" stays with nullable `Latitude`/`Longitude`).
- Map and route polyline filtering to exclude unlocated stops without distorting route navigation or placing markers at Null Island `(0, 0)`.

### Automatic Budget & Title Synchronization
- Automatic bi-directional synchronization of accommodation costs into the `Accommodation` category of `TripBudget`.
- `BudgetEstimate.Title` automatic sync from `TripStop.Name`.
- Zero-cost rules: `Cost > 0` creates/updates estimate; `Cost == 0` removes estimate; `0 → Cost > 0` creates new estimate.

### Itinerary ↔ Accommodation Integration & Auto-Refresh
- Dedicated **"Add Stay"** button in Itinerary header.
- Canonical `AccommodationDialog` integrated directly into Itinerary tab.
- **Hotel Category Auto-Redirect**: Selecting `Hotel` in generic "Add Trip Stop" dialog seamlessly redirects to `AccommodationDialog` prefilling name, location, stay dates, and notes.
- Instant query cache auto-refresh across Itinerary, Map, and Budget tabs on stay creation, modification, or deletion.

### Authoritative Chronological Sequence Reconciliation
- Automatic `DisplayOrder` re-indexing across all trip stops based on `ArrivalDate` / `CheckInDate` ascending with deterministic tie-breaking.
- Removed manual `DisplayOrder` numeric text inputs from UI forms.

---

# [v0.6.0] - Sprint 6 Complete

Release Date: August 2026

## Overview

Sprint 6 introduced **Trip Planning Intelligence**, transforming RidePlanner from a route visualization tool into a complete road trip planning platform.

Key capabilities delivered include Budget Planning & Smart Fuel Calculator, Preparation Checklists with auto-seeding, Trip Overview Command Center Dashboard, and Tabbed Layout Navigation with bi-directional Map ↔ Itinerary selection synchronization.

---

## Added

### Budget & Financial Intelligence (`features/budget`)
- Overall target budget management and remaining buffer calculation.
- Category-wise expense estimates (Fuel, Accommodation, Food, Tolls/Permits, Miscellaneous).
- Smart Fuel Cost Calculator using route distance (`km / mileage * rate`).
- Financial overview cards and category breakdown.

### Trip Preparation Checklist (`features/checklist`)
- Auto-seeded default categories (*Riding Gear*, *Motorcycle*, *Documents*).
- Custom categories and checklist item CRUD.
- Completion percentage tracking and interactive item toggling.

### Trip Overview Command Center (`features/trips/components/overview`)
- Command header with date ranges, status/countdown badge, and quick metric chips (Days, Stops, Distance, Driving Time).
- Conservative smart alert banners (Target budget exceeded, unfinished preparation, itinerary attention).
- Transparent planning progress breakdown (Checklist %, Budget %, Route %).
- Deterministic Next Stop snapshot (for Upcoming, Ongoing, and Completed trips).
- Compact preparation snapshot with interactive quick check-off checkboxes.

### Tabbed Layout Navigation & Map Sync (`TripDetailsPage`)
- Responsive 4-tab layout (*Overview*, *Itinerary & Route*, *Budget & Costs*, *Checklist & Gear*).
- URL search parameter state synchronization (`?tab=`) supporting deep-linking and browser history navigation.
- Bi-directional Map ↔ Itinerary selection synchronization:
  - Map marker click auto-scrolls to the stop card in Timeline/List view.
  - Timeline stop card selection pans Map camera to center marker.

---

# [v0.2.0] - Sprint 2 Complete

Release Date: July 2026

## Overview

Sprint 2 established the frontend architecture for Ride Planner and delivered the first complete end-to-end feature through Trip Management.

This release introduces a production-ready React application built on scalable architectural principles while maintaining consistency with the existing backend architecture.

---

## Added

### Frontend Foundation

- React 19
- TypeScript
- Vite
- Material UI
- React Router
- TanStack Query
- Axios
- React Hook Form
- Zod Validation
- Sonner notifications

---

### Trip Management

Implemented complete Trip CRUD.

- View Trips
- Create Trip
- Edit Trip
- Delete Trip

---

### Shared UI Components

Added reusable components including:

- PageHeader
- StatCard
- LoadingSpinner
- ErrorState
- EmptyState
- ConfirmDialog

---

### User Experience

Added:

- Loading indicators
- Error handling
- Empty state pages
- Toast notifications
- Confirmation dialogs
- Responsive layouts

---

### Forms

Implemented:

- Shared TripForm
- Schema validation
- Form reuse
- Client-side validation
- Strong typing

---

## Improved

### Architecture

- Feature-based frontend organization
- Shared component library
- Shared utility layer
- API abstraction
- Query key organization

---

### Developer Experience

- Strong TypeScript typing
- Cleaner component responsibilities
- Consistent React Query patterns
- Improved project organization

---

### Accessibility

- Improved responsive layouts
- Better component consistency
- UI polish
- Material Design improvements

---

## Technical Highlights

Frontend architecture now follows:

```text
Page

↓

Components

↓

Hooks

↓

API Layer

↓

Axios Client

↓

Backend
```

Backend architecture:

```text
Controller

↓

Application

↓

Repository

↓

Database
```

Both layers now follow similar responsibility boundaries.

---

## Breaking Changes

None.

---

## Migration Notes

Not applicable.

---

# [v0.1.0] - Sprint 1 Complete

Release Date: July 2026

## Overview

Initial backend implementation.

---

## Added

- ASP.NET Core Web API
- PostgreSQL
- Entity Framework Core
- Clean Architecture
- Repository Pattern
- CQRS-inspired Application Layer
- Global Exception Handling
- Trip CRUD API
- Dependency Injection
- OpenAPI Documentation

---

## Technical Highlights

Established the backend architecture that serves as the foundation for all future modules.

---

# Future Releases

Planned releases include:

- v0.3.0 — Trip Workspace
- v0.4.0 — Itinerary & Destinations
- v0.5.0 — Hotels & Expenses
- v0.6.0 — Fuel Planning
- v0.7.0 — Documents & Maps
