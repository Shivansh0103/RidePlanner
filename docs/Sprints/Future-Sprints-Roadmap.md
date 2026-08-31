# Ride Planner — Future Sprints Roadmap (Sprints 13 – 22)

**Current Baseline:** Version **v0.12.0** (Completed through Sprint 12 — *Obsidian Velocity UI/UX & Telemetry Overhaul*)  
**Architecture:** .NET 10 (Clean Architecture, MediatR CQRS, EF Core) + React 19 / TypeScript / Vite / MUI  

---

## Executive Summary

Having completed 12 foundational and experience sprints, Ride Planner has established a robust core planning experience, complete trip lifecycle support, and an Obsidian Velocity dark adventure cockpit.

This document outlines the strategic execution sequence for **Sprints 13 through 22**, organized across **5 value streams**, with **AI Intelligence accelerated to Phase 3** to maximize user value and reduce onboarding friction.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 STRATEGIC SPRINT PHASES                                 │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  PHASE 1: CLOUD & MULTI-TENANCY FOUNDATION                                              │
│    Sprint 13 ──► Authentication, Multi-Tenancy & User Profiles                          │
│    Sprint 14 ──► DevOps, Docker, CI/CD & Production Cloud Launch                        │
│                                                                                         │
│  PHASE 2: LIVE FIELD COMPANION & OFF-GRID CAPABILITY                                    │
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

## Phase 1: Cloud & Multi-Tenancy Foundation (Sprints 13–14)

### 🎯 Objective
Transform the local, anonymous single-tenant system into a secure, multi-tenant cloud-hosted platform ready for public users.

---

### Sprint 13 — Authentication, Multi-Tenancy & User Profiles
* **Backend**:
  * Implement ASP.NET Core Identity with JWT / OAuth2 (Google Sign-In, Email/Password).
  * Scope all root aggregates (`Trip`, `Expense`, `TripDocument`, `EmergencyContact`, `TripMemory`) to `UserId`.
  * Add user claims enrichment and authorization middleware.
* **Frontend**:
  * Auth screens (Login, Register, Forgot Password, Google OAuth flow).
  * Auth state provider with token refresh interceptor.
  * User settings drawer (Preferred Currency `INR/USD/EUR`, distance unit `km/mi`, default vehicle profile).
* **Value Delivered**: Ensures full privacy and user data isolation.

---

### Sprint 14 — DevOps, Dockerization & Production Cloud Launch
* **Containerization**:
  * Multi-stage `backend/Dockerfile` and `frontend/Dockerfile`.
  * Production `docker-compose.yml` with PostgreSQL and reverse proxy (Caddy/Nginx).
* **CI/CD & Observability**:
  * GitHub Actions workflow: lint, build, test runner (66+ backend tests, vitest), and automated deployment.
  * Health check endpoints (`/healthz`, `/readyz`).
  * Serilog structured JSON logging and OpenTelemetry tracing.
  * Production hosting: Vercel / Cloudflare Pages (Frontend) + Render / Railway / Azure (Backend) + Neon / Supabase (PostgreSQL).
  * Google Maps API Key HTTP referrer and domain restriction.
* **Value Delivered**: Unlocks zero-downtime automated public deployment and reliable cloud infrastructure.

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
* **Next Active Sprint:** Sprint 13 — Authentication, Multi-Tenancy & User Profiles
