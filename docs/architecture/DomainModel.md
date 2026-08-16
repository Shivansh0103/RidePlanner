# Domain Model Specification

## Core Domain Aggregates & Entities

### 1. Trip Aggregate (`RidePlanner.Domain.Entities.Trip`)
Represents a planned or completed road trip journey.

**Lifecycle & State Rules**:
- `Status`: `Planning = 1`, `Active = 2`, `Completed = 3`.
- `StartedAt` & `CompletedAt`: Optional actual lifecycle event timestamps.
- `AutoActivate()`: Transitions status from `Planning` to `Active` when `StartDate <= currentDate` without fabricating `StartedAt`.
- `Start()` & `Complete()`: Manual user action lifecycle transitions.

**Owned Collections**:
- `Stops`: Collection of `TripStop` entities.
- `Accommodations`: Collection of `Accommodation` entities.
- `ChecklistCategories`: Collection of `ChecklistCategory` entities.
- `Documents`: Collection of `TripDocument` entities.
- `EmergencyContacts`: Collection of `EmergencyContact` entities.
- `Memories`: Collection of `TripMemory` entities.
- `Budget`: `TripBudget` aggregate root.

---

### 2. Budget Aggregate (`RidePlanner.Domain.Entities.Budget`)
Manages financial planning and expense tracking for a trip.

- `TripBudget`: Aggregate root containing `TargetBudget` and collection of `Expenses` and `BudgetEstimates`.
- `BudgetEstimate`: Planned category estimates (Fuel, Accommodation, Food, Tolls/Permits, Miscellaneous).
- `Expense`: Actual financial transaction logging (`Amount`, `PaymentMethod`, `ExpenseCategory`, optional link to `Accommodation` / `TripStop`).

---

### 3. Preparation Checklist (`RidePlanner.Domain.Entities.Checklist`)
Manages gear and preparation tasks.

- `ChecklistCategory`: Logical category grouping (e.g. *Riding Gear*, *Motorcycle*, *Documents*).
- `ChecklistItem`: Individual packing or preparation item with `IsCompleted` and `IsRequired` flags.

---

### 4. Travel Documents (`RidePlanner.Domain.Entities.TripDocument`)
Stores trip-specific travel document metadata.

- `Type`: Document category (`Driving License`, `Vehicle RC`, `Insurance`, `PUC`, `Permit`, `Booking Confirmation`, `ID Proof`, `Other`).
- `ExpiryDate`: Optional expiration date.
- `IsExpiringSoon`: Derived boolean evaluated for `ExpiryDate <= UtcNow + 30 days`.
- `FilePath`: External metadata URL or document link.

---

### 5. Emergency Contacts (`RidePlanner.Domain.Entities.EmergencyContact`)
Stores trip-specific support and emergency contact numbers.

- `Name`, `Relationship`, `Phone`, `AlternatePhone`, `Email`.
- `IsPrimary`: Single-primary contact per trip invariant.

---

### 6. Trip Memories (`RidePlanner.Domain.Entities.TripMemory`)
Captures personal rider logs and post-trip memories.

- `Title`, `Content`, `ImageUrl`, `OdometerReadingKm`, `MemoryDate`.
- Chronological descending order (newest first).

---

## Derived Domain Value Objects (Zero-Persisted-Redundancy Read Models)

### 1. `TripReadiness`
Dynamic pre-ride readiness health score evaluating 6 domain categories:
- Required Checklist (blocking)
- Required Documents (blocking)
- Journey Plan (blocking)
- Accommodation Stays (informational)
- Emergency Contacts (informational)
- Budget Target (informational)

### 2. `TripSummary`
Dynamic post-ride trip report projecting actual duration, budget target vs expense variance, stay totals, and packing completion rate.