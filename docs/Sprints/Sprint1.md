# Sprint 1 – Trip Management MVP

**Status:** In Progress  
**Sprint:** 1  
**Estimated Duration:** 2–3 Weeks  
**Version:** 1.1

---

# Objective

Build the first end-to-end version of Ride Planner by implementing complete Trip Management while establishing a scalable Clean Architecture.

This sprint intentionally prioritizes backend architecture before frontend integration so future modules (Hotels, Expenses, Fuel Stops, Itinerary, etc.) follow the same architecture.

---

# Sprint Goal

Deliver:

- ASP.NET Core Web API
- PostgreSQL database
- Entity Framework Core
- Complete Trip CRUD
- Global Exception Handling
- DTO Mapping
- Application Service Layer
- React Frontend
- End-to-end CRUD

---

# User Stories

### US-1 — Create Trip

**As a** user

**I want** to create a trip

**So that** I can start planning my journey.

---

### US-2 — View Trips

**As a** user

**I want** to see all my trips

**So that** I can manage them.

---

### US-3 — View Trip Details

**As a** user

**I want** to view details of a trip

**So that** I can review my travel plans.

---

### US-4 — Edit Trip

**As a** user

**I want** to modify an existing trip

**So that** I can keep my itinerary up to date.

---

### US-5 — Delete Trip

**As a** user

**I want** to remove a trip

**So that** I can keep my trip list clean.

---

# Sprint Structure

## Sprint 1.1 — Backend Foundation ✅

### Completed

- Create Trip entity
- Configure Entity Framework Core
- Configure PostgreSQL
- Create RidePlannerDbContext
- Register Infrastructure
- Create Initial Migration
- Apply Database Migration
- Configure User Secrets

---

## Sprint 1.2 — Backend CRUD ✅

### Completed

- Create TripController
- Implement Create endpoint
- Implement Read endpoints
- Implement Update endpoint
- Implement Delete endpoint
- Global Exception Middleware
- DTO Request / Response Models
- Trip Mapping Extensions
- Tested using Scalar API Reference

---

## Sprint 1.3 — Backend Architecture 🚧

### Goal

Refactor the backend into the intended Clean Architecture.

### Tasks

#### Application Layer

- Create `ITripService`
- Create `TripService`
- Register services using Dependency Injection
- Move business workflows from controllers into services

#### Controller Refactoring

Controllers should only handle:

- HTTP Requests
- HTTP Responses
- Status Codes

No direct EF Core interaction should remain inside controllers.

#### Validation

Prepare validation strategy.

Topics:

- API Validation
- Domain Validation
- FluentValidation (Sprint 2)

#### Learning Objectives

Understand:

- Application Layer
- Service Layer
- Separation of Concerns
- Dependency Injection

---

## Sprint 1.4 — Frontend Foundation

### React

- Create Vite project
- Configure TypeScript
- Configure React Router
- Create folder structure
- Create shared layout

---

## Sprint 1.5 — Frontend Integration

### Pages

- Trip List
- Trip Details
- Create Trip
- Edit Trip

### Integration

- API Client
- CRUD Operations
- Loading States
- Error Handling

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

# Current Progress

## ✅ Completed

### Infrastructure

- PostgreSQL Integration
- Entity Framework Core
- User Secrets
- Dependency Injection
- Initial Migration

### Domain

- Trip Entity
- User Entity
- Factory Methods
- Domain Validation
- Entity Update Behaviour

### API

- POST /api/trips
- GET /api/trips
- GET /api/trips/{id}
- PUT /api/trips/{id}
- DELETE /api/trips/{id}

### Architecture

- Global Exception Middleware
- DTOs
- Mapping Extensions

---

## 🚧 In Progress

- Application Service Layer

---

## ⏳ Pending

- React Frontend
- Frontend Integration

---

# Definition of Done

Sprint 1 is complete when:

## Backend

- Complete CRUD implemented
- Application Services introduced
- Controllers no longer depend directly on DbContext
- Global Exception Middleware working
- Mapping centralized

## Frontend

- React application created
- CRUD integrated with backend

## Quality

- Migrations execute successfully
- Application builds successfully
- No secrets committed
- Code committed
- Documentation updated

---

# Learning Objectives

By the end of Sprint 1 you will understand:

## ASP.NET Core

- Controllers
- Routing
- Middleware
- Dependency Injection
- Model Binding
- REST APIs

## Entity Framework Core

- DbContext
- DbSet
- CRUD Operations
- Change Tracking
- Migrations

## Clean Architecture

- Domain Layer
- Application Layer
- Infrastructure Layer
- DTOs
- Mapping
- Services

## Frontend

- React
- TypeScript
- React Router
- API Integration

---

# Out of Scope

The following remain outside Sprint 1:

- Authentication
- Authorization
- Maps
- Route Planning
- Weather
- Fuel Calculations
- Hotels
- AI Features
- Notifications
- Mobile Application
- Docker
- CI/CD

---

# Notes

During implementation it became clear that introducing the Application Layer after implementing CRUD provides a better learning progression than introducing it immediately.

The project intentionally follows this order:

Backend Foundation

↓

CRUD

↓

Application Layer

↓

Frontend

↓

Future Features

This keeps the learning curve gradual while ensuring future modules follow a scalable architecture.