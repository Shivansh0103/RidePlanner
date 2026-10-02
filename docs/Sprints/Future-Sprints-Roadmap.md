# Ride Planner — Future Sprints Roadmap (Sprints 15 – 23+)

**Current Baseline:** Version **v0.14.5** (Completed through Sprint 14.5 — *Production Polish, Public Landing, Theme System & OAuth Hardening*)  
**Architecture:** .NET 10 (Clean Architecture, MediatR CQRS, EF Core) + React 19 / TypeScript / Vite / MUI + Google Cloud Run & Neon PostgreSQL  

---

## Executive Summary

Having completed 15 foundational, domain, security, cloud deployment, and production hardening sprints through **Sprint 14.5**, Ride Planner is live in production across Vercel, Google Cloud Run, and Neon PostgreSQL.

Following Sprint 14.5, the application underwent extensive manual production testing and qualitative feedback from real users and riders. Their verdict was unanimous:
1. **The Core Cockpit is Polished & Capable:** Once an expedition is created, the route visualization, 6-category readiness dial, smart fuel calculation, and lodging/expense tools are intuitive and reliable.
2. **First-Time Onboarding Has High Cognitive Friction:** When a new user lands on an empty dashboard, they are confronted with an empty form requiring dozens of manual inputs (trip title, dates, descriptions, waypoint coordinates, arrival sequences, category estimates, and packing items).
3. **The Natural Alternative:** Rather than filling out manual multi-step forms, users instinctively turn to general-purpose LLMs (ChatGPT, Claude, Gemini) and ask: *"Plan me a 5-day motorcycle road trip from Delhi to Ladakh in June with scenic stops and a budget under ₹25,000."*

Without an intelligent bridge, users leave Ride Planner before ever experiencing its rich expedition management capabilities.

To eliminate this friction and deliver immediate time-to-value, **AI Intelligence is accelerated directly into Sprint 15 as the AI Expedition Copilot**.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 STRATEGIC SPRINT PHASES                                 │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  PHASE 1: CLOUD & MULTI-TENANCY FOUNDATION                                              │
│    Sprint 13 ──► Authentication, Multi-Tenancy & User Profiles             [COMPLETED]   │
│    Sprint 14 ──► DevOps, Docker, CI/CD & Production Cloud Launch           [COMPLETED]   │
│    Sprint 14.5 ─► Production Polish, Public Landing, Themes & OAuth Fix    [COMPLETED]   │
│                                                                                         │
│  PHASE 2: AI EXPEDITION COPILOT & ROUTE INTELLIGENCE                                    │
│    Sprint 15 ──► AI Expedition Copilot & Structured Expedition Generation  [NEXT ACTIVE] │
│    Sprint 16 ──► Route Intelligence: Weather Matrix & Elevation Profiles                │
│                                                                                         │
│  PHASE 3: FIELD NAVIGATION & OFF-GRID EXPEDITIONS                                       │
│    Sprint 17 ──► GPX/KML Export & 1-Click Navigation Handoff                            │
│    Sprint 18 ──► Offline Expedition Mode ("Download for Offline Use")                   │
│                                                                                         │
│  PHASE 4: EXPEDITION COLLABORATION & GROUP FINANCES                                     │
│    Sprint 19 ──► Shared Expeditions, Roles & Resource Permissions (HTTP)                │
│    Sprint 20 ──► Real-Time Collaboration (SignalR WebSockets)                           │
│    Sprint 21 ──► Group Expenses & Debt Minimization                                     │
│                                                                                         │
│  PHASE 5: INTELLIGENT AUTOMATION & COMMUNITY ECOSYSTEM                                  │
│    Sprint 22 ──► Receipt OCR Scanner & Adaptive Packing Assistant                       │
│    Sprint 23+ ─► Community Routes Directory, 1-Click Fork & Expedition Replay            │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Strategic Product Loop

Ride Planner is built to support the complete lifecycle of road travel:

```text
 IDEA ──► PLAN ──► ROUTE ──► PREPARE ──► TRAVEL ──► TRACK / EXPENSES ──► COMPLETE ──► REMEMBER / REUSE ──► DISCOVER / FORK
  │        ▲
  └────────┘
(AI Expedition Copilot dramatically shortens the path from IDEA → PLAN)
```

### Core Architectural Principle

> **"AI interprets intent; Ride Planner owns truth."**

The AI Expedition Copilot acts as an advisory proposal engine. It translates natural-language travel intent into a versioned, structured `ExpeditionDraft`. Ride Planner's deterministic domain model, authorization policies, validation pipeline, and PostgreSQL database retain 100% ownership of persistence, business rules, route truth, and financial calculations. The LLM never touches the database directly.

---

## Phase 1: Cloud & Multi-Tenancy Foundation (Sprints 13–14.5) [COMPLETED]

### 🎯 Objective
Transform the local, anonymous single-tenant system into a secure, multi-tenant cloud-hosted platform ready for public users, and harden it against real-world production edge cases.

---

### Sprint 13 — Authentication, Multi-Tenancy & User Profiles [Completed — v0.13.0]
* **Backend**:
  * Implemented ASP.NET Core Identity with Guid keys, dual-token JWT + HttpOnly refresh cookies, and session family revocation.
  * Scoped all root aggregates (`Trip`, `Expense`, `TripDocument`, `EmergencyContact`, `TripMemory`) to `UserId` with 404 tenancy protection.
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

### Sprint 14.5 — Production Polish, Public Landing, Theme System & OAuth Hardening [Completed — v0.14.5]
* **[AUDIT-01] Google OAuth Production Stabilization**: Configured production credentials in Cloud Run; enabled `ForwardedHeaders.XForwardedHost` in ASP.NET Core; routed callback via `/api/signin-google` through Vercel edge proxy; registered redirect URIs in Google Cloud Console.
* **[AUDIT-02] Public Unauthenticated Landing Page**: High-impact public landing page at `/` for anonymous visitors, showcasing route mapping, 6-category readiness dials, fuel calculation, and lodging hub with clear CTAs.
* **[AUDIT-03] Multi-Theme Architecture (Dark / Light / System)**: Implemented `ThemeModeProvider` with `localStorage` persistence and OS listener; created high-contrast Obsidian Light palette (slate/titanium tones) for outdoor daylight riding.
* **[AUDIT-04] Google Maps Production Key**: Configured `VITE_GOOGLE_MAPS_API_KEY` on Vercel with HTTP referrer and API scope lockdown in GCP, eliminating missing-key alerts.
* **[AUDIT-05] Serverless Database Connection Resiliency**: Added Npgsql `EnableRetryOnFailure()` in EF Core to handle transient drops during Neon auto-suspend cold starts.
* **[AUDIT-06] Dual Production Transactional Email Integration**: Implemented provider-agnostic email architecture (`IEmailSender`) supporting both Gmail SMTP (active ₹0-cost production provider) and Resend REST API, styled with branded responsive HTML templates.
* **[AUDIT-08] Session Logout LocalStorage Cleanup**: Purged `last_active_trip_id` upon logout to prevent cross-account state leakage.
* **[AUDIT-09] Actionable ErrorState UI**: Upgraded `ErrorState` with retry triggers (`onRetry`) and navigation CTAs.
* **[AUDIT-10] Auth Endpoint Rate Limiting**: Applied rate limit policies to `POST /api/auth/refresh` and `GET /api/auth/external/google/start`.
* **[AUDIT-11] Vitest Windows Compatibility**: Configured `pool: 'threads'` in `vite.config.ts` to eliminate worker timeout errors during local test execution on Windows.
* **[AUDIT-12] Security Headers Hardening**: Attached HSTS and standard defensive HTTP response headers (`nosniff`, `DENY`).
* **[AUDIT-14] Monorepo Selective CI/CD**: Implemented path-filtering in GitHub Actions (`backend-ci.yml` and `frontend-ci.yml`) and aligned with Vercel deployment skipping to eliminate redundant Docker builds and Cloud Run revisions on single-tier changes.
* **Value Delivered**: Complete end-to-end production viability, welcoming public discovery, outdoor daylight riding usability, zero-churn CI/CD, and rock-solid cloud reliability. Verified through real-user production usage.

---

## Phase 2: AI Expedition Copilot & Route Intelligence (Sprints 15–16)

### 🎯 Objective
Eliminate first-time user friction by translating natural-language travel intent into fully structured, editable Ride Planner expeditions, augmented with real-world weather and terrain intelligence.

---

### Sprint 15 — AI Expedition Copilot & Structured Expedition Generation [NEXT ACTIVE — v0.15.0]

#### User Story & Motivation
A rider visits Ride Planner with an idea: *"I have 5 days in June. I want to ride my Himalayan 450 from Delhi to Ladakh via Manali, stay in budget homestays, keep daily riding under 7 hours, and budget around ₹25,000."* Instead of manually creating an expedition, searching for 8 waypoints, calculating fuel intervals, and building checklists item-by-item, the rider types this prompt. Within seconds, the AI Expedition Copilot presents a structured, editable expedition proposal.

#### Workflow Architecture
```text
User Natural-Language Intent
        ↓
AI Expedition Copilot (LLM Structured Output with JSON Schema)
        ↓
Versioned `ExpeditionDraft` (In-Memory / Ephemeral State)
        ↓
Validation & Enrichment (Domain Rules, Route Bounds, Vehicle Context)
        ↓
Interactive User Review & Refinement ("Make Day 2 shorter", "Reduce budget to ₹20k")
        ↓
Explicit User Approval ("Create Expedition")
        ↓
Standard Domain Command Pipeline (MediatR CQRS Commands)
        ↓
Authoritative PostgreSQL Persistence (`Trip`, `TripStop`, `TripBudget`, `Checklist`)
```

#### Core Capabilities
1. **"Plan with AI" Entry Points:**
   - Prominent hero CTA on the public Landing Page and empty Trips Dashboard.
   - Quick-start inspiration chips: *"5-Day Manali to Leh Adventure"*, *"Goa Coastal Cruise"*, *"Weekend Western Ghats Twisties"*.
2. **Structured `ExpeditionDraft` Generation:**
   - LLM endpoint utilizing strict Structured Outputs (JSON Schema constraint).
   - Generates complete expedition blueprints:
     - **Metadata:** Title, description, suggested start/end dates, travel style.
     - **Itinerary & Stops:** Daily route segments, ordered destinations, estimated distances, scenic stop recommendations.
     - **Budget Allocations:** Category estimates (Fuel, Accommodation, Food, Tolls, Contingency) calculated from vehicle efficiency and trip duration.
     - **Accommodation Recommendations:** Suggested night stays matching rider budget preference.
     - **Curated Preparation Checklist:** Weather- and route-appropriate gear, documents, and medical essentials.
3. **Conversational Refinement Loop:**
   - Riders can refine the draft iteratively before committing:
     - *"Make day 2 shorter—split it into two days."*
     - *"Reduce the overall budget by 20%."*
     - *"Add more scenic viewpoints along the route."*
     - *"Swap the luxury hotel on night 3 for a campsite."*
4. **Architectural Guardrails & Robustness:**
   - **Schema Validation:** Strict validation of LLM output before presentation; rejects malformed payloads with automatic single-retry correction.
   - **Deterministic Boundary:** Route distances, currency formatting, and database persistence are executed by Ride Planner services, not hallucinated by the LLM.
   - **Resilience & Cost Controls:** Configurable timeouts, bounded retries, per-user rate limiting, token usage caps, and structured observability logging for prompt performance.
   - **Graceful Fallback:** If the AI provider is unavailable or times out, the UI presents an actionable error with a 1-click fallback to the standard manual trip creation form.

* **Value Delivered:** Slashes the time and cognitive effort required to go from *"I want to take a trip"* to *"I have a real, editable Ride Planner expedition"* from 45 minutes to 30 seconds.

---

### Sprint 16 — Route Intelligence: Weather Matrix & Elevation Profiles [v0.16.0]

#### Objective
Evolve Ride Planner from a static map into a dynamic route intelligence engine that helps riders anticipate mountain passes, extreme weather, and altitude shifts.

#### Core Capabilities
1. **Route Weather Matrix (Open-Meteo Integration):**
   - Free, high-accuracy forecast integration requiring zero paid API keys.
   - Evaluates real-time and 7-day weather forecasts along route waypoints, high passes, and overnight stays.
   - Weather HUD displaying temperature range, precipitation probability, wind speed, and fog/snow/frost warnings.
2. **Interactive Route Elevation Profile:**
   - Elevation graph visualizing route topography, total climb/descent, gradients, and mountain pass altitudes.
   - Highlights high-altitude zones (>3,000m) to alert riders for Acute Mountain Sickness (AMS) preparation.
3. **Reusable Intelligence Model:**
   - Designed with clear provider abstractions, caching, and graceful degradation.
   - Data model structured to be consumed downstream by the AI Copilot (adaptive packing), Offline Mode, and GPX exports.

* **Value Delivered:** Riders can anticipate extreme mountain weather, freezing passes, or monsoon storms before departing, turning route planning into proactive expedition safety.

---

## Phase 3: Field Navigation & Off-Grid Expeditions (Sprints 17–18)

### 🎯 Objective
Bridge the gap between desk planning and on-the-road execution by enabling seamless navigation handoff and off-grid survivability in cellular dead zones.

---

### Sprint 17 — GPX/KML Export & 1-Click Navigation Handoff [v0.17.0]

#### Strategic Rationale
**Plan → Understand the Route → Navigate It → Then Make It Off-Grid Resilient.**  
Exporting GPX files and generating 1-click turn-by-turn navigation links requires zero external infrastructure cost, immediately bridges the gap from the laptop to the bike handlebar, and should not wait for complex offline storage.

#### Core Capabilities
1. **1-Click Turn-by-Turn Navigation Launch:**
   - Deep-link launchers for native Google Maps and Apple Maps mobile apps directly from the active expedition cockpit.
   - Automatically populates origin, destinations, and intermediate waypoints for instant navigation start.
2. **Universal GPX & KML Export:**
   - 1-click download of standardized `.gpx` (GPS Exchange Format) and `.kml` route files.
   - Compatible with dedicated GPS navigation units (Garmin, Wahoo, TomTom) and mobile navigation apps (OsmAnd, Gaia GPS, Rever).
   - Validates route integrity to ensure clean waypoint sequencing and track metadata.
3. **Vision Alignment:**
   - *Ride Planner plans and organizes the expedition; specialized navigation apps handle turn-by-turn cockpit guidance.*

* **Value Delivered:** Riders can instantly transfer their carefully crafted route into their preferred vehicle cockpit navigation device with one tap.

---

### Sprint 18 — Offline Expedition Mode ("Download for Offline Use") [v0.18.0]

#### Strategic Rationale
Road trips frequently cross remote valleys, national parks, and mountain passes with zero cellular connectivity. Rather than attempting to make the entire web application arbitrarily offline, Ride Planner adopts an explicit, dependable model: **"Download Expedition for Offline Use."**

#### Core Capabilities
1. **Progressive Web App (PWA) Foundation:**
   - Web App Manifest and Service Worker caching for instant asset loading and installability on mobile home screens.
2. **Offline Expedition Snapshot Engine:**
   - Explicit *"Download for Offline Use"* action on any planned or active expedition.
   - Serializes complete expedition data into browser IndexedDB storage:
     - Itinerary, stops, and ordered waypoints.
     - Accommodation details and confirmation codes.
     - Emergency contacts (ICE) with direct tap-to-call support.
     - Critical travel documents metadata and policy numbers.
     - Preparation checklists and notes.
     - Cached route polyline and latest weather/elevation snapshot.
3. **Offline UX & Visual Status Indicator:**
   - Unambiguous visual badge indicating offline state and snapshot timestamp.
   - Graceful disablement of features requiring live connectivity (e.g. live currency conversion, new Google Places searches).
   - Safe local reconciliation when connectivity is restored.

* **Value Delivered:** Zero panic when cellular signal vanishes in remote mountain terrain—riders retain complete access to itineraries, hotel bookings, and emergency safety contacts.

---

## Phase 4: Expedition Collaboration & Group Finances (Sprints 19–21)

### 🎯 Objective
Enable riding groups, touring clubs, and families to plan journeys together with secure permissions and fair financial settlement.

---

### Sprint 19 — Shared Expeditions, Roles & Resource Permissions [v0.19.0]

#### Strategic Rationale
Build the authorization and collaboration model correctly over standard HTTP first. Establish rock-solid resource permissions, member lifecycles, and security boundaries before introducing real-time WebSocket complexity.

#### Core Capabilities
1. **Expedition Membership & Invitation System:**
   - Secure invitation links with time-bounded tokens and optional email invites.
   - Member management drawer displaying active collaborators and pending invites.
2. **Role-Based Access Control (RBAC):**
   - **`Owner`**: Full administrative control (delete trip, transfer ownership, manage members).
   - **`Co-Planner`**: Can add/edit stops, update accommodations, manage checklist items, and log expenses.
   - **`Viewer`**: Read-only access to itineraries, route maps, and documents (ideal for family tracking the ride).
3. **Expedition Activity Audit Stream:**
   - Chronological change log tracking who added, modified, or removed stops, stays, and budget items.

* **Value Delivered:** Replaces chaotic WhatsApp groups with a single source of truth for group expeditions, protected by enterprise-grade authorization.

---

### Sprint 20 — Real-Time Collaboration (SignalR WebSockets) [v0.20.0]

#### Core Capabilities
1. **Live Multiplayer Sync:**
   - ASP.NET Core SignalR hub broadcasting expedition mutations in real time.
   - Instant synchronization of stop reordering, checklist toggles, and expense additions across active browser tabs.
2. **Presence & Concurrency Handling:**
   - Live presence avatars indicating which co-planners are currently viewing the expedition.
   - Optimistic UI updates with graceful conflict resolution (HTTP API remains the authoritative source of truth).
   - Reconnection resilience and stale-client notification on network reconnection.

* **Value Delivered:** Frictionless group planning sessions where friends see live itinerary updates simultaneously on desktop and mobile.

---

### Sprint 21 — Group Expenses & Debt Minimization [v0.21.0]

#### Core Capabilities
1. **Multi-Payer Shared Expense Ledger:**
   - Expenses can be logged by any co-planner with flexible split rules:
     - Equal split among all participants.
     - Percentage-based allocation.
     - Exact custom amount shares.
     - Specific participant exclusions (e.g. non-drinkers excluded from bar tabs).
2. **Smart Debt Minimization Algorithm:**
   - Graph-based settlement algorithm calculating the minimum number of transactions required to balance group debts.
   - Replaces convoluted multi-party IOUs with simple, clear settlement instructions: *"Amit owes Priya ₹1,400; Rahul owes Priya ₹600"*.
3. **Settlement Tracking:**
   - Settlement status tracking with direct UPI / cash payment confirmation.

* **Value Delivered:** Completely eliminates post-trip financial awkwardness and ends the need for third-party bill-splitting apps.

---

## Phase 5: Intelligent Automation & Community Ecosystem (Sprints 22–23+)

### 🎯 Objective
Automate tedious on-the-road administrative tasks and expand Ride Planner into an inspiring community for discovering and replaying epic journeys.

---

### Sprint 22 — Receipt OCR Scanner & Adaptive Packing Assistant [v0.22.0]

#### Strategic Rationale
Receipt OCR is valuable automation, but rightly placed after the core planning, field navigation, and expense models are mature and proven.

#### Core Capabilities
1. **Multimodal Receipt OCR Scanner:**
   - Mobile-first photo upload of fuel bills, toll slips, restaurant receipts, and hotel invoices.
   - Multimodal LLM / vision extraction of merchant, date, total amount, currency, and category.
   - Human-in-the-loop review: user confirms extracted values before saving into the Expense Ledger.
2. **Context-Aware Adaptive Packing Assistant:**
   - AI assistant analyzes expedition parameters: destination altitude (>3,000m), travel season (monsoon, winter), duration, and route terrain.
   - Advisory checklist recommendations: puncture kits, rain gear, chain lube, thermal liners, altitude sickness medicine, permit photocopies.
   - One-click addition to personal or group preparation checklists.

* **Value Delivered:** Effortless expense logging at fuel stops in 5 seconds and zero forgotten riding essentials.

---

### Sprint 23+ — Community Routes Directory, 1-Click Fork & Expedition Replay [v0.23.0+]

#### Core Capabilities
1. **Curated Community Routes Directory:**
   - Public directory of verified, epic road trips submitted by community riders.
   - Filters for vehicle type (motorcycle, 4x4, family car), terrain (paved, gravel, mountain passes), duration, and difficulty.
   - Privacy controls: riders can keep expeditions strictly private, unlisted, or submit to the public showcase.
2. **1-Click "Fork Expedition":**
   - Clone any public expedition blueprint into your personal workspace with one tap.
   - Automatically adapts dates and vehicle defaults while preserving verified stops, stay recommendations, and waypoints.
3. **Interactive Animated Expedition Replay:**
   - Animated 2D/3D map replay tracing route progress, checkpoint photos, and odometer milestones.
   - Beautiful exportable social summary cards and shareable web links for celebrating completed adventures.

* **Value Delivered:** Turns completed journeys into lasting digital trophies and drives powerful organic community growth and trip inspiration.

---

## Cross-Cutting Engineering Priorities

These engineering capabilities are executed continuously alongside feature sprints rather than siloed into standalone releases:

### 1. Multi-Tier Testing Strategy
* **Unit Tests:** Domain invariants, value objects, and deterministic business rules.
* **Integration Tests:** CQRS MediatR pipelines, database migrations, EF Core queries, and security policies.
* **API Tests:** Endpoint contracts, ProblemDetails RFC 7807 payloads, rate limiting, and auth cookie handling.
* **End-to-End (E2E) Tests:** Core user journey: Landing Page → AI Plan → Draft Review → Expedition Creation → Navigation Handoff.
* **Production Smoke Tests:** Automated `jq`-based canary probes against `/health` and `/ready` during zero-downtime deployments.

### 2. Lightweight Product Telemetry
* Focused, privacy-respecting telemetry to understand user behavior and onboarding friction without heavy observability overhead:
  - `ai_planning_started` / `ai_planning_completed` / `ai_planning_failed`
  - `ai_draft_accepted` / `ai_draft_refined` / `ai_draft_rejected`
  - `expedition_created` / `trip_started` / `trip_completed`
  - `route_navigation_launched` / `gpx_exported`
  - `offline_snapshot_downloaded`
  - `expense_logged` / `checklist_progress_updated`

### 3. External Integration Resilience
* All external providers (Google Maps, Open-Meteo, Gmail SMTP, Resend, AI LLMs, OCR vision) must implement:
  - Strict timeouts (never block the web thread).
  - Bounded exponential retries with jitter.
  - In-memory / cache-aside policies for static or slowly changing data.
  - Graceful degradation: if an external service fails, the core cockpit remains fully functional.
  - Actionable user-facing error notifications.

### 4. Infrastructure as Code (IaC)
* Once cloud architecture stabilizes across Phase 2, capture Google Cloud Run, Artifact Registry, Workload Identity Federation (WIF), and IAM bindings in reproducible Terraform configurations. Terraform is an operational refinement and is explicitly non-blocking for Sprint 15.

### 5. Proportional Architecture (Rejecting Premature Complexity)
* The current **.NET 10 Modular Monolith + Cloud Run + Neon PostgreSQL** architecture is perfectly suited for Ride Planner's scale and developer velocity.
* Do not introduce Kubernetes, microservices, Kafka, Redis clusters, or multi-region data meshes without concrete product scale requirements. Simple, reliable, and cost-effective software wins.

---

## Roadmap Philosophy & Principles

1. **Reduce Time-to-Value:** A new user should experience the magic of Ride Planner within 30 seconds of landing on the site.
2. **AI Assists; the Domain Owns Truth:** LLMs propose drafts; deterministic domain rules, route geometry, and persistent databases govern reality.
3. **Depth Over Breadth:** Finish core capabilities thoroughly rather than building dozens of half-baked features.
4. **Integrate Rather Than Replace:** Complement specialized navigation (Google/Apple Maps) and hardware (Garmin) instead of attempting to rebuild them.
5. **Design for the Real World & Degraded Connectivity:** Road trips encounter weather, dead zones, and remote terrain; build software that survives off-grid.
6. **Build Learning Value Into Each Sprint:** Every sprint delivers demonstrable user value and advances clean architecture practices.
7. **Validate with Real Riders:** Real-world feedback from actual road trips trumps theoretical feature speculation.
8. **Keep Architecture Proportional to Actual Scale:** Choose boring, reliable, cost-effective infrastructure over resume-driven complexity.

---

## Document Governance
* **Maintainer:** Ride Planner Core Engineering Team
* **Status:** Active Strategic Roadmap
* **Next Active Sprint:** **Sprint 15 — AI Expedition Copilot & Structured Expedition Generation**
