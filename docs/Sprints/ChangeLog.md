# Changelog

All notable changes to Ride Planner will be documented in this file.

The project follows an incremental sprint-based development approach.

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
