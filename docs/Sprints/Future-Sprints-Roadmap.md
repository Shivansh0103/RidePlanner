# Ride Planner — Future Sprints Roadmap (Sprints 13 – 22)

**Current Baseline:** Version **v0.14.0** (Completed through Sprint 14 — *Production Readiness & First Cloud Deployment*)  
**Architecture:** .NET 10 (Clean Architecture, MediatR CQRS, EF Core) + React 19 / TypeScript / Vite / MUI  

---

## Executive Summary

Having completed 14 foundational, experience, security, and cloud deployment sprints, Ride Planner has established a robust core planning experience, complete trip lifecycle support, user-owned multi-tenancy, and a live public production deployment on Vercel, Google Cloud Run, and Neon PostgreSQL.

This document outlines the strategic execution sequence for **Sprints 15 through 22**, organized across remaining value streams, with **AI Intelligence accelerated to Phase 3** to maximize user value and reduce onboarding friction.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 STRATEGIC SPRINT PHASES                                 │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  PHASE 1: CLOUD & MULTI-TENANCY FOUNDATION                                [COMPLETED]   │
│    Sprint 13 ──► Authentication, Multi-Tenancy & User Profiles             [COMPLETED]   │
│    Sprint 14 ──► DevOps, Docker, CI/CD & Production Cloud Launch           [COMPLETED]   │
│                                                                                         │
│  PHASE 2: LIVE FIELD COMPANION & OFF-GRID CAPABILITY                      [NEXT ACTIVE] │
│    Sprint 15 ──► Route Weather Matrix & Elevation Profiles                              │
│    Sprint 16 ──► PWA, Offline Storage & 1-Click GPX/Navigation Handoff                  │
│                                                                                         │
│  PHASE 3: AI TRAVEL CO-PILOT & AUTOMATION (ACCELERATED)                                 │
│    Sprint 17 ──► Prompt-to-Expedition Generator & Range-Aware Fuel Pitstop Curator      │
│    Sprint 18 ──► Receipt OCR Scanner, Auto-Expense Logger & Adaptive Packing Assistant  │
│                                                                                         │
│  PHASE 4: GROUP EXPEDITIONS & COLLABORATIVE PLANNING                                    │
│    Sprint 19 ──► Trip Sharing, Role-Based Access & Real-Time Sync (SignalR)             │
│    Sprint 20 ──► Group Expense Splitting & Debt Minimization                            │
│                                                                                         │
│  PHASE 5: COMMUNITY DISCOVERY & EXPEDITION REPLAY                                       │
│    Sprint 21 ──► Community Routes Showcase & 1-Click Fork/Clone                         │
│    Sprint 22 ──► Expedition Replay & Animated Timeline Storytelling                     │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Cloud & Multi-Tenancy Foundation (Sprints 13–14) [COMPLETED]

### 🎯 Objective
Transform the local, anonymous single-tenant system into a secure, multi-tenant cloud-hosted platform ready for public users.

---

### Sprint 13 — Authentication, Multi-Tenancy & User Profiles [Completed — v0.13.0]
* **Backend**:
  * Implement ASP.NET Core Identity with Guid keys, dual-token JWT + HttpOnly refresh cookies, and session family revocation.
  * Scope all root aggregates (`Trip`, `Expense`, `TripDocument`, `EmergencyContact`, `TripMemory`) to `UserId` with 404 tenancy protection.
  * User profile management with travel preferences (custom currency, distance unit, vehicle profile).
  * Proof-of-control Google OAuth integration and password recovery CQRS pipeline.
  * Built-in authentication rate limiting with Client IP partitioning.
* **Frontend**:
  * Auth screens (Login, Register, Forgot Password, Reset Password, Google OAuth flow).
  * Decoupled dual-client architecture (`rawClient`, `refreshTransport`, `refreshManager`, `apiClient`).
  * Route guards, AuthBootSplash, and User Settings drawer.
* **Value Delivered**: Complete privacy, user data isolation, and resilient session management.

---

### Sprint 14 — DevOps, Dockerization & Production Cloud Launch [Completed — v0.14.0]
* **Containerization**:
  * Multi-stage `backend/Dockerfile` using .NET 10 SDK build and hardened non-root runtime (`USER $APP_UID`) on port 8080.
  * Production-ready `backend/compose.yaml` with PostgreSQL 17 for local reproducibility.
* **Hosting & Topology**:
  * Frontend: Vercel edge CDN with `/api/*` rewrites proxying API traffic to Cloud Run.
  * Backend: Google Cloud Run containerized service (`asia-southeast1`).
  * Database: Neon managed PostgreSQL 18 (`ap-southeast-1`) with connection pooling and SSL.
  * Persistence: ASP.NET Core Data Protection keys persisted durably in PostgreSQL `DataProtectionKeys`.
* **CI/CD & Reliability**:
  * GitHub Actions CI (`backend-ci.yml` and `frontend-ci.yml`) with dependency caching and hermetic validation.
  * GitHub Actions CD via Google Cloud Workload Identity Federation (WIF) keyless OIDC auth.
  * Zero-downtime canary deployment: 0% traffic revision tagged `sha-${SHORT_SHA}`, automated `jq`-based smoke tests against `/health` and `/ready`, and 100% traffic migration on pass.
  * Fast-fail startup configuration validation and structured JSON logging with `X-Correlation-ID`.
* **Value Delivered**: Production engineering competence, automated zero-downtime releases, and a live public platform.

---

## Phase 2: Live Field Companion & Off-Grid Capability (Sprints 15–16)

### 🎯 Objective
Evolve Ride Planner from a desk planning tool into an on-the-road companion that survives remote mountain regions with zero cellular signal.

---

### Sprint 15 — Route Weather Matrix & Elevation Profiles
* **Weather Radar**:
  * Integrate Open-Meteo API for real-time and 7-day forecasts along waypoints and night stays.
  * Weather HUD displaying temperature range, precipitation probability, wind speed, and fog/snow alerts.
* **Elevation Profile**:
  * Interactive elevation graph visualizing mountain passes, climb gradients, and route topography.
* **Value Delivered**: Riders can anticipate extreme mountain weather, freezing passes, or monsoon storms before departing.

---

### Sprint 16 — PWA, Offline Storage & 1-Click Navigation Handoff
* **Progressive Web App (PWA)**:
  * Service worker caching and TanStack Query persistence via IndexedDB.
  * Full offline mode for saved trips: view itineraries, medical notes, documents, and emergency contacts offline.
* **Navigation Handoff**:
  * 1-Click **Export to GPX / KML** for Garmin, Wahoo, and OsmAnd devices.
  * Direct deep-link launcher to Google Maps App and Apple Maps turn-by-turn navigation.
* **Value Delivered**: Full access to critical trip data when stranded in cellular dead zones.

---

## Phase 3: AI Travel Co-Pilot & Automation (Sprints 17–18)

### 🎯 Objective
Leverage LLMs and multimodal vision to eliminate manual trip setup and automate expense tracking.

---

### Sprint 17 — AI Prompt-to-Expedition Generator & Fuel Curator
* **Natural Language Expedition Wizard**:
  * Conversational prompt interface: *"Plan a 5-day scenic motorcycle tour from Bangalore to Munnar with budget homestays, fuel stops every 200 km, and scenic twisties"*.
  * LLM Structured Output with JSON Schema feeding directly into Domain Commands (`Trip`, `TripStop`, `TripBudget`, `Checklist`).
* **Range-Aware Pitstop Insertion**:
  * Automated calculation of route legs. Inserts fuel pitstops automatically when distance exceeds vehicle tank range.
* **Value Delivered**: Cuts multi-day trip planning from hours to 30 seconds.

---

### Sprint 18 — Receipt OCR Scanner & Adaptive Packing Assistant
* **Multimodal Receipt OCR**:
  * Snap or upload photos of fuel receipts, toll tickets, and hotel bills from mobile.
  * Automatic extraction of merchant name, amount, date, and category into the Expense Ledger.
* **Context-Aware Packing Intelligence**:
  * AI analyzes trip destination, altitude, season, and route conditions to recommend missing critical items (puncture repair kits, rain gear, chain lube, thermals).
* **Value Delivered**: Effortless expense logging on the road and zero forgotten essentials.

---

## Phase 4: Group Expeditions & Collaborative Planning (Sprints 19–20)

### 🎯 Objective
Enable riding groups, touring clubs, and families to plan and split expenses together in real-time.

---

### Sprint 19 — Trip Sharing, Role-Based Access & Real-Time Sync
* **Collaborative Workspaces**:
  * Invite companions via unique links or email with roles (`Owner`, `Co-Planner`, `Viewer`).
  * Expedition activity stream tracking who added/edited stops, stays, or notes.
* **Live Sync**:
  * SignalR WebSockets integration for real-time multiplayer updates across active tabs.
* **Value Delivered**: Ends chaotic WhatsApp messages and fragmented planning notes.

---

### Sprint 20 — Group Expense Splitting & Debt Minimization
* **Shared Expense Ledger**:
  * Multi-payer support with equal, percentage, or custom share allocations.
* **Smart Debt Settlement**:
  * Graph-based debt minimization algorithm ("Who owes whom how much in the fewest transactions").
  * Settlement status and UPI/cash payment tracking.
* **Value Delivered**: Frictionless, fair financial settlement at the end of every group ride.

---

## Phase 5: Community Discovery & Expedition Replay (Sprints 21–22)

### 🎯 Objective
Expand Ride Planner into an open ecosystem for discovering epic routes and sharing memories.

---

### Sprint 21 — Community Routes Showcase & 1-Click Fork/Clone
* **Expedition Showcase**:
  * Public curated route directory with filters for terrain, duration, bike/car compatibility, and difficulty.
* **Expedition Forking**:
  * 1-Click **"Fork Expedition"** button allowing users to clone public trips into their personal planner.
* **Value Delivered**: Community growth, inspiration, and organic user acquisition.

---

### Sprint 22 — Expedition Replay & Animated Timeline Storytelling
* **Interactive Story Replay**:
  * Animated 2D/3D route replay showing itinerary progress, photo checkpoints, and odometer milestones.
* **Social Share Cards**:
  * Beautiful exportable trip summary cards and interactive web links for sharing on social platforms.
* **Value Delivered**: Turns completed trips into lasting, shareable memories.

---

## Document Governance
* **Maintainer:** Ride Planner Core Engineering Team
* **Status:** Approved Sprint Strategy
* **Next Active Sprint:** Sprint 15 — Route Weather Matrix & Elevation Profiles
