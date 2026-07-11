# Sprint 1 – Trip Management MVP

**Status:** Planned  
**Sprint:** 1  
**Estimated Duration:** 1–2 Weeks  
**Version:** 1.0

---

# Objective

Build the first end-to-end working version of Ride Planner by implementing Trip Management.

By the end of this sprint, users should be able to create, view, update and delete trips through a React frontend connected to an ASP.NET Core Web API backed by PostgreSQL.

This sprint focuses on establishing a clean, maintainable architecture that future features can build upon.

---

# Sprint Goal

Deliver a functioning MVP with:

- ASP.NET Core Web API
- React + TypeScript frontend
- PostgreSQL database
- Entity Framework Core
- End-to-end CRUD functionality
- Clean Architecture foundation

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

# Acceptance Criteria

The sprint is considered complete when:

- Users can create trips.
- Users can retrieve all trips.
- Users can retrieve a single trip.
- Users can edit trips.
- Users can delete trips.
- Trip data is stored in PostgreSQL.
- Swagger successfully tests every endpoint.
- React frontend successfully communicates with the backend.
- Application builds without errors.

---

# Technical Scope

## Backend

- ASP.NET Core Web API
- Clean Architecture
- Entity Framework Core
- PostgreSQL
- Dependency Injection
- REST APIs
- Database Migrations

### APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/trips | Get all trips |
| GET | /api/trips/{id} | Get trip by ID |
| POST | /api/trips | Create trip |
| PUT | /api/trips/{id} | Update trip |
| DELETE | /api/trips/{id} | Delete trip |

---

## Frontend

- React
- TypeScript
- Vite
- React Router
- API Integration using Fetch or Axios
- Basic responsive UI

Pages:

- Trip List
- Create Trip
- Edit Trip
- Trip Details

---

# Database

Initial database schema:

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

# Sprint Tasks

## Sprint 1.1 — Backend Foundation

- Create Trip entity
- Configure Entity Framework Core
- Configure PostgreSQL
- Create RidePlannerDbContext
- Register services
- Create initial migration
- Update database

---

## Sprint 1.2 — Backend CRUD

- Create TripController
- Implement Create endpoint
- Implement Read endpoints
- Implement Update endpoint
- Implement Delete endpoint
- Test using Swagger

---

## Sprint 1.3 — Frontend Foundation

- Create React application
- Configure TypeScript
- Configure React Router
- Create folder structure
- Create shared layout

---

## Sprint 1.4 — Frontend Integration

- Create Trip List page
- Create Trip Details page
- Create Trip Form
- Connect frontend to backend
- Implement CRUD operations

---

# Definition of Done

Sprint 1 is complete when:

- All acceptance criteria are satisfied.
- Database migrations execute successfully.
- CRUD operations function correctly.
- Application builds without warnings or errors.
- Code is committed to Git.
- README is updated if necessary.

---

# Out of Scope

The following features are intentionally excluded from Sprint 1:

- User Authentication
- Authorization
- Maps
- Route Planning
- Weather
- Fuel Calculations
- Hotel Recommendations
- AI Features
- File Uploads
- Notifications
- Mobile Application
- Docker Deployment
- CI/CD Pipeline

These features will be implemented in future sprints.

---

# Learning Objectives

This sprint introduces:

- ASP.NET Core Web API
- Clean Architecture
- Entity Framework Core
- PostgreSQL Integration
- Database Migrations
- Dependency Injection
- REST API Design
- React with TypeScript
- React Router
- Frontend–Backend Communication

---

# Deliverables

At the end of Sprint 1, the project will include:

- Functional ASP.NET Core backend
- PostgreSQL database
- React frontend
- End-to-end CRUD workflow
- Swagger documentation
- Git commits for completed tasks

---

# Success Criteria

A user should be able to:

1. Open the application.
2. Create a trip.
3. View all trips.
4. Open a trip.
5. Edit the trip.
6. Delete the trip.

If all of the above are possible without directly modifying the database, Sprint 1 is considered successfully completed.

---

# Notes

Sprint 1 establishes the technical foundation for the Ride Planner application.

Future sprints will extend this foundation by introducing authentication, mapping, route planning, itinerary management, weather integration, AI-assisted trip planning, and additional advanced features while preserving the architecture established during this sprint.

## Sprint 1 Progress

### ✅ Completed

- Created `Trip` domain entity
- Configured Entity Framework Core
- Configured PostgreSQL provider
- Created `RidePlannerDbContext`
- Registered Infrastructure using Dependency Injection
- Externalized connection string configuration
- Configured ASP.NET Core User Secrets for local development
- Generated initial EF Core migration
- Created PostgreSQL database
- Applied initial migration successfully

### 📦 Deliverables

- `Trips` table created
- `__EFMigrationsHistory` table created
- Database connectivity verified

### Notes

- Local secrets are managed using ASP.NET Core User Secrets.
- `appsettings.json` no longer contains sensitive credentials.