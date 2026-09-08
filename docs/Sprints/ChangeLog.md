# Changelog

All notable changes to Ride Planner will be documented in this file.

The project follows an incremental sprint-based development approach.

---

# [v0.13.0] - Sprint 13 Complete

Release Date: September 2026

## Overview

Sprint 13 delivered **Authentication, User-Owned Workspaces, Multi-Tenancy & Rider Profiles**, converting RidePlanner from an anonymous local development application into a secure, user-owned multi-tenant adventure platform. Every trip, waypoint, accommodation, expense, document, checklist, and memory is strictly owned and isolated per authenticated user, while preserving the full Obsidian Velocity cockpit experience.

### Key Highlights Delivered:
1. **Identity & Persistence Foundation:** ASP.NET Core Identity with Guid keys; `ApplicationUser` in Infrastructure; `UserProfile` entity; atomic registration transactions; database migrations (`AddIdentityFoundation`, `AddUserProfileTableAndBackfill`); zero Identity framework leakage into Domain POCOs.
2. **Dual-Token Session Strategy:** In-memory short-lived JWT access tokens (15m) + rotating HttpOnly refresh cookies (7d) scoped to `Path=/api/auth`; SHA-256 token hashing at rest; backend session family tracking with active reuse detection and family revocation (`RefreshTokenService`).
3. **Trip Aggregate Ownership & Multi-Tenancy Isolation:** Required `Trip.OwnerUserId` foreign key; owner-scoped repository queries (`GetTripForOwnerAsync`); `[Authorize]` attributes protecting all trip controllers; cross-user access returns `404 Not Found` to prevent resource existence disclosure.
4. **User Profile & Travel Preferences:** Domain `UserProfile` entity; custom currency (`INR`, `USD`, `EUR`, `GBP`), distance units (`Kilometers`, `Miles`), and default vehicle profile (`DefaultVehicleName`, `DefaultTankCapacityLitres`, `DefaultFuelEfficiencyKmPerLitre`); seamless integration into new trip defaults and fuel calculation dialogs; `SettingsPage.tsx` and `ProfileSettingsForm.tsx`.
5. **Password Reset Workflow:** Secure password recovery CQRS pipeline (`POST /api/auth/forgot-password`, `POST /api/auth/reset-password`); non-enumerating generic responses for unknown accounts; `IEmailSender` notification abstraction; user GUID + reset token validation; automatic session revocation upon password reset; `ForgotPasswordPage.tsx` and `ResetPasswordPage.tsx`.
6. **Google Sign-In & Proof-of-Control Account Linking:** Google OpenID Connect integration via `AddGoogle`; atomic account creation for new external users; strict anti-takeover policy (zero automatic linking by email); proof-of-control password prompt before `AddLoginAsync`; protected, anti-replay link ticket (`IDataProtectionProvider`, 10m expiry); zero tokens in URL query strings (bootstrapped via HttpOnly cookie and `/refresh`); `GoogleSignInButton.tsx`, `AuthCallbackPage.tsx`, `LinkAccountPage.tsx`.
7. **Authentication Rate Limiting (Sprint 13.1):** Built-in ASP.NET Core rate limiting middleware; 5 independent fixed-window policies (`LoginRateLimit`, `RegisterRateLimit`, `ForgotPasswordRateLimit`, `ResetPasswordRateLimit`, `ExternalLinkRateLimit`); Client IP partitioning; immediate rejection (`QueueLimit = 0`); RFC 7807 429 response with `Retry-After` header; test environment isolation via `X-Test-Client-IP`.
8. **Decoupled Dual-Client Frontend Architecture:** Directed Acyclic Graph (Level 0 `rawClient` ➔ Level 1 `refreshTransport` ➔ Level 2 `refreshManager` ➔ Level 3 `apiClient`); eliminates circular interceptor dependencies; singleton promise coordinator deduplicates concurrent 401s; in-memory `tokenStore` closure; discriminated union `AuthState` (`bootstrapping | authenticated | unauthenticated`); `AuthBootSplash.tsx`; route guards with deep-link preservation; dynamic `UserMenu.tsx` with live telemetry indicator; guaranteed cache purge (`queryClient.clear()`) on session termination.
9. **Testing & Quality Assurance:** Comprehensive test coverage with **206 backend tests** passing (76 Domain, 59 Application, 71 API Integration) and **91 frontend Vitest tests** passing across 17 test suites; production bundle verified.

---

# [v0.12.0] - Sprint 12 Complete

Release Date: August 2026

## Overview

Sprint 12 delivered the complete **Obsidian Velocity UI/UX Overhaul & Telemetry Redesign**, converting the entire RidePlanner web platform into a cutting-edge dark cockpit adventure interface inspired by Google Stitch designs, backed by 100% resilient React 19 / TypeScript / MUI architecture and verified against live backend APIs.

### Key Highlights Delivered:
1. **Design Tokens & Theme Foundation:** Deep Obsidian canvas (`#121416`, `#1a1a1e`), glassmorphic translucent panels (`rgba(31, 31, 36, 0.75)`), Electric Indigo (`#6366f1`) and Acid Green (`#bef264`) telemetry highlights, Outfit and JetBrains Mono typography.
2. **Dashboard & Trips Hub:** Bento metrics grid, high-contrast status chips, dynamic lifecycle sorting, and interactive elevation & route tags.
3. **Overview Command Center & Readiness Health:** 6-category readiness dial with instant issue navigation, sticky action header with trip lifecycle triggers (`Start Expedition`, `Complete Trip`).
4. **Waypoints & Smart Stop Roles:** Side-by-side sticky map viewport, multi-role categorizer (`Waypoint`, `Fuel / Pitstop`, `Scenic Overlook`, `Meal / Food`, `Night Stay / Camp`), and interactive drag reordering.
5. **Lodging Matrix & Booking Dossier:** Responsive 3-column accommodation bento cards with uniform height and rich detail modal.
6. **Financial Telemetry & Master-Detail Explorer:** 4-card telemetry HUD (Ceiling, Planned Estimates with Unallocated buffer, Spent, Runway), variance status pills, and 2-pane Category Explorer (Navigator + Estimates ledger).
7. **Preparation Checklist & Smart Presets:** 3-column category bento grid, 1-click tailored suggestions (`Govt ID`, `Toolkit`, `Riding Gear`), and fixed item persistence.
8. **Permits & Identity Documents:** Uniform document pass cards with type badges and 1-click clipboard copy.
9. **Emergency ICE & Safety Network:** Strict phone number regex validation, glowing primary ICE badges, and instant `CALL NOW` action.
10. **Debrief Summary & Memories Journal:** Printable expedition report and journal highlight cards with clean input label docking.

---

# [v0.11.0] - Sprint 11 Complete

Release Date: August 2026

## Overview

Sprint 11 delivered **Frontend Architecture Hardening & UX Resilience**, establishing robust React Query cache invalidation policies, standardized Zod validation schemas across all forms, accessible component primitives, and resilient error/loading states.

---

# [v0.10.0] - Sprint 10 Complete

Release Date: August 2026

## Overview

Sprint 10 delivered **Backend Architecture Hardening & Performance Optimizations**, establishing MediatR pipeline behaviors (FluentValidation, logging, performance monitoring), EF Core query optimizations with split queries and read-only no-tracking, and domain invariant protections.

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
