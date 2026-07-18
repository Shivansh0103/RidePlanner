# Sprint 1 – Backend MVP

**Status:** ✅ Completed  
**Sprint:** 1  
**Estimated Duration:** 2–3 Weeks  
**Version:** 2.0

---

# Objective

Build the first production-ready backend for Ride Planner by implementing complete Trip Management using ASP.NET Core, PostgreSQL, Entity Framework Core, and Clean Architecture.

This sprint focused on learning backend fundamentals first before introducing the frontend.

---

# Sprint Goal

Deliver:

- ASP.NET Core Web API
- PostgreSQL Database
- Entity Framework Core
- Complete Trip CRUD
- Clean Architecture
- CQRS (Commands & Queries)
- Repository Pattern
- Global Exception Handling
- DTO Mapping
- Production-ready backend structure

---

# User Stories

### US-1 — Create Trip

**As a** user

**I want** to create a trip

**So that** I can begin planning my ride.

---

### US-2 — View Trips

**As a** user

**I want** to see all my trips

**So that** I can manage my rides.

---

### US-3 — View Trip Details

**As a** user

**I want** to view a trip

**So that** I can review its details.

---

### US-4 — Update Trip

**As a** user

**I want** to edit my trip

**So that** I can keep my itinerary up to date.

---

### US-5 — Delete Trip

**As a** user

**I want** to remove a trip

**So that** I can keep my trip list organized.

---

# Sprint Structure

## Sprint 1.1 — Backend Foundation ✅

### Completed

- Create Domain project
- Create Trip Entity
- Configure PostgreSQL
- Configure Entity Framework Core
- Create RidePlannerDbContext
- Dependency Injection
- Initial Migration
- User Secrets

---

## Sprint 1.2 — CRUD API ✅

### Completed

- Create TripsController
- Create Trip
- Get Trip
- Get Trips
- Update Trip
- Delete Trip
- DTO Request / Response Models
- Mapping Extensions
- Scalar API Testing

---

## Sprint 1.3 — Backend Architecture ✅

### Completed

#### Clean Architecture

- Domain Layer
- Application Layer
- Infrastructure Layer
- API Layer

#### CQRS

- Commands
- Queries
- Handlers

#### Repository Pattern

- ITripRepository
- TripRepository

#### Dependency Injection

- Infrastructure Registration
- Application Registration

#### Controller Refactoring

Controllers now:

- Receive HTTP Requests
- Create Commands / Queries
- Invoke Handlers
- Return HTTP Responses

No direct DbContext usage remains.

---

## Sprint 1.4 — Backend Polish ✅

### Completed

- Global Exception Middleware
- Repository Cleanup
- Nullable Reference Fixes
- CreatedAtAction responses
- Async/Await improvements
- Logging improvements
- Code Review & Refactoring

---

# API Endpoints

| Method | Endpoint | Status |
|---------|----------|--------|
| GET | /api/trips | ✅ |
| GET | /api/trips/{id} | ✅ |
| POST | /api/trips | ✅ |
| PUT | /api/trips/{id} | ✅ |
| DELETE | /api/trips/{id} | ✅ |

---

# Database

## Trips

| Column | Type |
|----------|------|
| Id | UUID |
| Name | Text |
| Description | Text |
| StartDate | Date |
| EndDate | Date |
| CreatedAt | Timestamp |
| UpdatedAt | Timestamp |

---

# Architecture

```text
API
│
├── Controllers
│
Application
│
├── Commands
├── Queries
├── Handlers
├── Repository Abstractions
│
Infrastructure
│
├── EF Core
├── PostgreSQL
├── Repository Implementations
│
Domain
│
├── Entities
├── Business Rules
```

---

# Completed Deliverables

## Domain

- Trip Entity
- User Entity
- Factory Methods
- Domain Validation
- Entity Update Behaviour

## Infrastructure

- PostgreSQL
- EF Core
- DbContext
- Repository Implementations
- Dependency Injection

## Application

- Commands
- Queries
- Handlers
- Repository Abstractions

## API

- CRUD Endpoints
- DTOs
- Mapping Extensions
- Global Exception Middleware

---

# Definition of Done

Sprint 1 is complete when:

- Complete Trip CRUD implemented
- Clean Architecture established
- CQRS introduced
- Repository Pattern implemented
- Controllers independent of DbContext
- Backend builds successfully
- Database migrations execute successfully
- Code reviewed and cleaned up
- Documentation updated

---

# Learning Outcomes

By completing Sprint 1 you will understand:

## ASP.NET Core

- Controllers
- Routing
- Middleware
- Dependency Injection
- REST APIs

## Entity Framework Core

- DbContext
- DbSet
- CRUD
- Migrations
- Change Tracking

## Clean Architecture

- Domain Layer
- Application Layer
- Infrastructure Layer
- API Layer

## Architectural Patterns

- CQRS
- Repository Pattern
- DTO Mapping
- Separation of Concerns

---

# Out of Scope

- Frontend
- Authentication
- Authorization
- Maps
- Weather
- Hotels
- Fuel Planning
- Expenses
- Notifications
- Mobile App
- Docker
- CI/CD
- Deployment

---

# Retrospective

Originally, Sprint 1 was planned to include both backend and frontend development.

During implementation, the backend evolved significantly beyond the initial estimate as additional architectural concepts were introduced, including CQRS, Repository Pattern, layered architecture, and production-oriented refactoring.

Rather than rushing the frontend, the sprint was intentionally closed after delivering a complete, well-structured backend.

Frontend development begins in **Sprint 2**.