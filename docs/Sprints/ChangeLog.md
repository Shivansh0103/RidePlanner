# Changelog

All notable changes to Ride Planner will be documented in this file.

The project follows an incremental sprint-based development approach.

---

# [v0.9.0] - Sprint 9 Complete

Release Date: August 2026

## Overview

Sprint 9 delivered **Core Trip Polish, Readiness & Trip Lifecycle Experience**, evolving RidePlanner from a planning tool into a complete trip companion spanning preparation, travel, trip completion, and post-ride memory logging.

Key capabilities delivered include Persisted Trip Lifecycle (`Planning` ➔ `Active` ➔ `Completed`), Started/Completed actual timestamps, Checklist Required vs Optional classification, Travel Documents registry with 30-day expiry warnings, Emergency Contacts registry with primary contact toggle, Derived 6-Category Trip Readiness Health Score, Printable Post-Ride Trip Summary Report, and Trip Memories & Journal log with odometer readings.

---

## Added

### Trip Lifecycle Management (`RidePlanner.Domain.Entities.Trip`)
- Extended `Trip` entity with `TripStatus` enum (`Planning = 1`, `Active = 2`, `Completed = 3`).
- Added nullable actual lifecycle timestamps: `StartedAt` and `CompletedAt`.
- Domain methods: `Start()`, `Complete()`, and `AutoActivate()` (transitions status to `Active` when `StartDate <= currentDate` without fabricating `StartedAt`).
- Endpoints: `POST /api/trips/{id}/start` and `POST /api/trips/{id}/complete`.
- UI action buttons on `TripDetailsPage.tsx` with status badges and optimistic query invalidation.

### Preparation Checklist Required / Optional Classification (`features/checklist`)
- Added `IsRequired` boolean flag to `ChecklistItem` entity and constructor overload.
- Updated EF property configuration `ChecklistItemConfiguration.cs` and migration `20260815053039_AddChecklistItemIsRequired.cs`.
- UI filter chips and visual badges (`Required` vs `Optional`) in `ChecklistSection.tsx`.

### Travel Documents Registry (`RidePlanner.Domain.Entities.TripDocument`)
- `TripDocument` entity supporting 8 category tags (`Driving License`, `Vehicle RC`, `Insurance`, `PUC`, `Permit`, `Booking Confirmation`, `ID Proof`, `Other`), document numbers, expiry dates, external file URLs, and notes.
- Derived 30-day expiration warnings (`IsExpiringSoon` for `ExpiryDate <= UtcNow + 30d` and `IsExpired`).
- EF mapping `TripDocumentConfiguration.cs` and migration `20260815061611_AddTripDocumentsTable.cs`.
- `TripDocumentsController.cs` REST API endpoints (`GET`, `POST`, `PUT`, `DELETE`).
- Frontend `documents` feature module (`DocumentsSection.tsx`, `DocumentCard.tsx`, `AddEditDocumentDialog.tsx`) with tab integration.

### Emergency Contacts Registry (`RidePlanner.Domain.Entities.EmergencyContact`)
- `EmergencyContact` entity (`Name`, `Relationship`, `Phone`, `AlternatePhone`, `Email`, `IsPrimary`).
- Single-primary contact enforcement logic (marking a contact primary clears primary flag from existing contacts).
- EF mapping `EmergencyContactConfiguration.cs` and migration `20260815065713_AddEmergencyContactsTable.cs`.
- `EmergencyContactsController.cs` REST API endpoints.
- Frontend `contacts` feature module (`EmergencyContactsSection.tsx`, `ContactCard.tsx`, `AddEditContactDialog.tsx`) with tab integration.

### Derived Pre-Ride Trip Readiness Score (`features/readiness`)
- Zero-persisted-redundancy `TripReadiness` value object and `GetTripReadinessQueryHandler` evaluating 6 domain categories:
  1. *Required Checklist* (blocking)
  2. *Required Documents* (blocking)
  3. *Journey Plan* (blocking, requires route OR itinerary stops)
  4. *Accommodation Stays* (informational)
  5. *Emergency Contacts* (informational)
  6. *Budget Target* (informational)
- REST `TripReadinessController.cs` under `/api/trips/{tripId}/readiness`.
- `ReadinessWidget.tsx` hero card on Overview Command Center and itemized `ReadinessSection.tsx` with quick-navigation links.

### Post-Ride Trip Summary & Printable Report (`features/summary`)
- Derived `TripSummary` value object and `GetTripSummaryQueryHandler` calculating trip duration, budget target vs actual spend variance, stay statistics, and packing completion rate.
- REST `TripSummaryController.cs` under `/api/trips/{tripId}/summary`.
- `TripSummarySection.tsx` dashboard cards with browser-native printable summary report generator.

### Trip Memories & Journal Log (`features/memories`)
- `TripMemory` entity supporting title, journal content, photo URLs, odometer readings (`OdometerReadingKm`), memory date, and timestamps.
- EF mapping `TripMemoryConfiguration.cs` and migration `20260815080049_AddTripMemoriesTable.cs`.
- REST `TripMemoriesController.cs` under `/api/trips/{tripId}/memories`.
- Frontend `memories` feature module (`MemoriesSection.tsx`, `MemoryCard.tsx`, `AddEditMemoryDialog.tsx`) with tab integration.

---

# [v0.8.0] - Sprint 8 Complete

Release Date: August 2026

## Overview

Sprint 8 delivered **Actual Expense Tracking & Budget vs Actual Analysis**, enabling riders to log real cash, UPI, and card transactions incurred for a trip, and compare them against their planned budget estimates (`BudgetEstimate`) and target budget (`TargetBudget`).

---

# [v0.7.0] - Sprint 7 Complete

Release Date: August 2026

## Overview

Sprint 7 delivered **Accommodation & Stay Planning**, introducing accommodation as a first-class planning concept while integrating it naturally with existing Itinerary, Map, Budget, and Overview Dashboard features.

---

# [v0.6.0] - Sprint 6 Complete

Release Date: August 2026

---

# [v0.2.0] - Sprint 2 Complete

Release Date: July 2026

---

# [v0.1.0] - Sprint 1 Complete

Release Date: July 2026
