# Ride Planner

[![Live Application](https://img.shields.io/badge/Live_App-rideplanner.vercel.app-00df8f?style=for-the-badge&logo=vercel&logoColor=white)](https://rideplanner.vercel.app)
[![API Status](https://img.shields.io/badge/Cloud_Run_API-Healthy-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://rideplanner-api-73286917441.asia-southeast1.run.app/health)
[![Version](https://img.shields.io/badge/Version-v0.14.0-blue?style=for-the-badge)](#current-status)
[![Automated Tests](https://img.shields.io/badge/Tests-247_Passed-brightgreen?style=for-the-badge)](#running-the-platform)

> 🌐 **Live Web Application:** [https://rideplanner.vercel.app](https://rideplanner.vercel.app)  
> 🚀 **Production Cloud Run API:** [https://rideplanner-api-73286917441.asia-southeast1.run.app/health](https://rideplanner-api-73286917441.asia-southeast1.run.app/health)

Ride Planner is a modern road trip planning platform designed to help people plan, organize, and enjoy memorable journeys.

Whether you're travelling by motorcycle, car, bicycle, or campervan, planning a trip often involves juggling multiple applications for navigation, accommodation, budgeting, weather updates, packing lists, and collaboration. Ride Planner brings these experiences together into a single platform, allowing travelers to focus less on logistics and more on the journey itself.

Our goal is simple: **make planning a road trip as enjoyable as taking one.**

---

## The Problem

Planning a road trip today is surprisingly fragmented.

A typical trip might involve:

* Creating routes in one application
* Booking hotels through another
* Tracking expenses in a spreadsheet
* Checking weather across multiple websites
* Sharing plans over messaging apps
* Maintaining packing lists in notes
* Saving important documents in cloud storage

While each tool solves an individual problem, none provide a unified experience for planning and managing an entire journey.

---

## Our Solution

Ride Planner combines the essential aspects of road trip planning into a single platform.

Instead of switching between multiple services, travelers can organize their itinerary, estimate costs, manage accommodations, prepare for their journey, collaborate with companions, and preserve travel memories—all from one place.

The platform is designed to be flexible enough for a weekend getaway while remaining powerful enough for long multi-day expeditions.

---

## Vision

We believe planning should be an enjoyable part of the adventure, not a stressful chore.

Ride Planner aims to become a trusted travel companion that supports users throughout every stage of their journey—from the first destination idea to the final photo and trip summary.

Rather than replacing existing travel services, Ride Planner aims to bring them together into a seamless planning experience.

---

## Core Principles

Every decision in Ride Planner is guided by a few simple principles:

* Simplicity over unnecessary complexity
* A great experience for every traveler, regardless of their mode of transport
* Practical features that solve real travel problems
* Reliable and scalable architecture
* Thoughtful design with a focus on usability
* Continuous improvement driven by real-world travel experiences

---

## Who is Ride Planner for?

Ride Planner is designed for anyone who enjoys road travel, including:

* Solo travelers
* Families
* Friends travelling together
* Motorcycle riders
* Road trip enthusiasts
* Adventure travelers
* Travel communities and clubs

Different journey types may unlock specialized planning tools while maintaining a consistent and intuitive experience for everyone.

---

## Key Features

* ✅ User authentication with email/password & Google OpenID Connect
* ✅ Secure dual-token session architecture (in-memory JWT + rotating HttpOnly refresh cookies)
* ✅ Private user workspaces & strict per-rider trip ownership data isolation
* ✅ Rider profile settings (currency preferences, distance units, default vehicle profile)
* ✅ Intelligent trip planning & lifecycle management (`Planning`, `Active`, `Completed`)
* ✅ Interactive route management & Google Places search
* ✅ Multi-day itinerary planning & accommodation stay reservation tracking
* ✅ Budget planning, smart fuel calculator & actual expense tracking (Budget vs Actual)
* ✅ Preparation checklists with required vs optional item classification
* ✅ Derived pre-ride Trip Readiness health score & 6-category breakdown
* ✅ Travel documents metadata registry with 30-day expiration alerts
* ✅ Trip emergency contacts registry with primary contact management
* ✅ Post-ride Trip Summary dashboard with printable summary report generator
* ✅ Trip memories & journal log registry (photos, notes, odometer readings)
* ✅ Authentication endpoint rate limiting & brute-force defense
* ✅ Containerized microservice architecture (.NET 10 multi-stage Dockerfile running non-root on port 8080)
* ✅ Cloud-native deployment (Google Cloud Run API + Vercel React frontend + Neon PostgreSQL)
* ✅ Keyless CI/CD automation via GitHub Actions Workload Identity Federation (WIF) OIDC
* ✅ Zero-downtime canary traffic migration & automated jq-based health check smoke tests (`/health` & `/ready`)
* ✅ Persistent ASP.NET Core Data Protection in PostgreSQL & Forwarded Headers proxy awareness
* ⏳ Weather integration (Sprint 15)
* ⏳ Offline PWA & GPX export (Sprint 16)
* ⏳ Group collaboration & shared workspaces (Sprint 19)

---

## Current Status

Ride Planner is actively deployed in production (Version **v0.14.0** — *Production Readiness & First Cloud Deployment*).

Completed milestones include:
* **Product Features (Sprints 1–9)**: Trip Lifecycle Management, Google Places Autocomplete, Route Visualization, Itinerary Management, Budget Planning & Smart Fuel Calculator, Actual Expense Log & Budget vs Actual Analysis, Preparation Checklists, Overview Command Center Dashboard, Accommodation & Stay Planning, Travel Documents, Emergency Contacts, Derived Trip Readiness Score, Printable Trip Summary Report, and Trip Memories.
* **Backend Architecture Hardening (Sprint 10)**: MediatR & CQRS Standardization with `ISender`, Application-level `IUnitOfWork` and Transaction Boundaries, Read-Model Projections with `AsNoTracking`, Domain-Driven Design boundary refinement (`Trip.SynchronizeLifecycle`, `TripStopReconciler`), RFC 7807 `ProblemDetails` and `FluentValidation` MediatR pipeline, Explicit EF Core configurations & Foreign Key Indexing, Centralized `IAuditableEntity` timestamps in `DbContext`, Configuration-Driven CORS, and a multi-tier Testing Architecture (`Domain.Tests`, `Application.Tests`, `Api.IntegrationTests`).
* **Frontend Architecture & UX Resilience (Sprint 11)**: TanStack Query cache invalidation policies, standardized Zod validation schemas, accessible component primitives, and resilient error/loading states.
* **Obsidian Velocity UI/UX Overhaul (Sprint 12)**: Dark cockpit adventure telemetry interface inspired by Google Stitch designs, Bento metrics, 6-category readiness dial, and responsive layouts.
* **Authentication, Multi-Tenancy & Profiles (Sprint 13)**: ASP.NET Core Identity with Guid keys, dual-token HttpOnly session lifecycle with reuse detection, private user workspaces (`Trip.OwnerUserId`), user profiles with travel settings, password reset flow, Google OIDC sign-in with proof-of-control account linking, and ASP.NET Core rate limiting middleware.
* **Production Readiness & Cloud Deployment (Sprint 14)**: Multi-stage Docker containerization on port 8080 (`USER $APP_UID`), local PostgreSQL Compose environment, Vercel frontend edge deployment with `/api/*` rewrites, Google Cloud Run serverless backend deployment (`asia-southeast1`), Neon managed PostgreSQL 18 with connection pooling, ASP.NET Core Data Protection key persistence in PostgreSQL, Forwarded Headers for reverse-proxy client IP handling, fast-fail `ProductionConfigurationValidator`, native `/health` and `/ready` health checks, GitHub Actions CI for backend and frontend with dependency caching, and automated CD with Workload Identity Federation (WIF) OIDC keyless authentication, 0% canary traffic tag, automated `jq` smoke tests, and instant revision rollback capabilities.

---

## Local Development & Security Configuration

### 1. Prerequisites
- **.NET 10 SDK**
- **Node.js 24** and `npm`
- **PostgreSQL 17+** (or use local in-memory database fallback or Docker Compose)
- **Docker & Docker Compose** (optional, for containerized local execution)

### 2. Backend Configuration (`appsettings.Development.json` / User Secrets)
Run user secrets or configure `appsettings.Development.json`:
```bash
cd backend/RidePlanner/RidePlanner.Api
dotnet user-secrets set "Jwt:Secret" "your_development_secret_key_at_least_32_chars!"
dotnet user-secrets set "Authentication:Google:ClientId" "your-google-client-id"
dotnet user-secrets set "Authentication:Google:ClientSecret" "your-google-client-secret"
```

### 3. Database Migrations
Apply PostgreSQL database migrations:
```bash
dotnet ef database update --project ../RidePlanner.Infrastructure --startup-project .
```
*(If no PostgreSQL connection string is provided, RidePlanner automatically falls back to an in-memory database for rapid local development).*

### 4. Running the Platform
- **Backend API**: `dotnet run --project backend/RidePlanner/RidePlanner.Api` (Listens on `http://localhost:5084`)
- **Frontend SPA**: `cd frontend && npm install && npm run dev` (Listens on `http://localhost:5173`)
- **Local Docker Compose (API + PostgreSQL)**: `docker compose -f backend/compose.yaml up -d` (Listens on `http://localhost:8080`)
- **Run Backend Tests**: `dotnet test backend/RidePlanner/RidePlanner.slnx` (247 automated tests across Domain, Application, and API Integration)
- **Run Frontend Tests**: `cd frontend && npm test -- --pool=threads` (91 automated tests across 17 suites)

---

## About This Project

Ride Planner began as a personal initiative to solve a real problem experienced while planning road trips. It is being developed with a product-first mindset, balancing practical value for travelers with modern software engineering practices.

The project serves two purposes:

* To build a platform that people would genuinely enjoy using
* To explore and demonstrate scalable software design, clean architecture, and modern development practices through a real-world application

---

## Looking Ahead

This repository will evolve alongside the product. As development progresses, additional documentation covering architecture, APIs, database design, development setup, and future milestones will be added.

The long-term ambition is to grow Ride Planner into a reliable platform that simplifies road trip planning for travelers everywhere.

---

## License

This project is currently under active development.

License information will be added before the first public release.
