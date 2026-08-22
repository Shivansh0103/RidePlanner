# Sprint 11 – Frontend Architecture, Hardening & UX

**Goal:** Transform the RidePlanner frontend into a clean, resilient, production-ready, and beautifully crafted adventure-grade React 19 application across two targeted phases.

**Status:** In Progress  
**Sprint:** 11  
**Phases:**  
- **Part 1:** Frontend Architecture, Hardening, Bug Fixes & Testing Suite  
- **Part 2:** UI/UX Overhaul, Aesthetics, High-Performance Motion & Responsive Polish  

---

# Sprint Overview

With Sprint 10 having consolidated and hardened the backend architecture (CQRS, MediatR, Domain Boundaries, Repository Pattern, Integration Tests, EF Core optimizations), Sprint 11 directs full focus toward the frontend.

Sprint 11 is structured around **three equal pillars**, executed across **two distinct phases**:

| Pillar | Goal | Phase |
|---|---|---|
| 🏗️ **Architecture** | Make the React/TypeScript codebase clean, scalable, decoupled, and maintainable | **Part 1** |
| 🛡️ **Hardening** | Improve correctness, resilience, error handling, contract safety, and automated testing | **Part 1** |
| 🎨 **UX / UI** | Make RidePlanner look and feel like a modern, responsive, high-aesthetic adventure application | **Part 2** |

```text
┌─────────────────────────────────────────────────────────────────────────┐
│              PART 1: ARCHITECTURE, HARDENING & QUALITY BASE             │
│  • Standardized RFC 7807 API Layer    • Query Key Factories & Caching   │
│  • Vitest + RTL + MSW Test Harness     • Multi-tier Error Boundaries     │
│  • Dialog & Form Normalization        • Maps Resilience & Debouncing    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Stable foundation & safety net
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              PART 2: UI/UX OVERHAUL, AESTHETICS & MOTION                │
│  • Adventure Design System & Tokens   • Modern Shell & Navigation Bar   │
│  • Dynamic Adventure Dashboard (Home) • Trip Lifecycle Hero & Tab Badges│
│  • Content Skeleton Loaders           • Smooth 60fps Micro-interactions │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# Learning & Execution Methodology

RidePlanner is an active learning and portfolio project. Therefore, Sprint 11 is executed through **incremental, pedagogical steps**:

1. **Step-by-Step Delivery:** We work in focused, small increments rather than monolithic rewrites.
2. **Pedagogical Explanation:** For every refactoring step, we examine:
   - **What** was changed?
   - **Why & How** was it implemented?
   - **Advantages & Disadvantages / Trade-offs** of the chosen pattern vs alternatives.
3. **Clean Git Commit History:** Meaningful, atomic git commits at logical milestones (following Conventional Commits: `feat:`, `refactor:`, `test:`, `fix:`, `docs:`).

---

# Part 1 Step-by-Step Breakdown

### Step 1.1: Standardized API Error Handling & Axios Interceptor Layer
- Create a strongly-typed `ApiError` domain model.
- Configure Axios interceptors to parse RFC 7807 `ProblemDetails` and validation errors (`Record<string, string[]>`).
- Add helper response extractors and support for request cancellation (`AbortSignal`).

### Step 1.2: Directory & Schema Consistency Normalization
- Consolidate all validation folders (`accommodations/validation`, `tripStops/validation`) into standard `schemas/`.
- Prune empty placeholder directories (`services/`, `styles/`, `shared/hooks/`).
- Standardize internal import paths.

### Step 1.3: TanStack Query Key Factories & Mutation Hardening
- Implement a Query Key Factory across all 10 domain features.
- Eliminate all `error: any` usages in mutation hooks and replace them with strongly-typed `ApiError`.
- Standardize cache invalidation strategies and optimistic update error rollbacks.

### Step 1.4: Dialog Normalization & Resilience Quick-Wins
- Replace legacy `window.confirm()` in `DocumentsSection`, `MemoriesSection`, and `EmergencyContactsSection` with `<ConfirmDialog />`.
- Add debouncing (300ms) to Google Places Autocomplete (`usePlacesAutocomplete`).
- Add memory cleanup on unmount for Google Maps listeners.

### Step 1.5: Frontend Automated Testing Setup (Vitest + RTL)
- Configure `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`.
- Write unit tests for domain utilities (`calculateTripSummary`, `groupStopsByDay`, `formatters`, budget calculations).
- Write schema tests for Zod validation contracts.
- Write component & hook tests for critical flows.

### Step 1.6: Multi-Tier Error Boundaries & Map Graceful Degradation
- Build reusable `ErrorBoundary` components (Global App Level, Route Level, and Feature Section Level).
- Implement a graceful fallback for Google Maps when offline or when an API key is missing.

### Step 1.7: Route Architecture, Lazy Loading & Code-Splitting
- Migrate route definitions to `React.lazy()` with `Suspense` fallbacks.
- Configure Vite manual chunks for vendor splitting.

---

# Part 2 Step-by-Step Breakdown

### Step 2.1: Adventure Design System & MUI Theme Overhaul
- Adventure dark slate palette, high-contrast amber/emerald accents, custom typography tokens.
- Card, button, and surface component style overrides.

### Step 2.2: Modern Application Shell, Header & Navigation
- Branding bar with motorcycle badge, active link indicators, quick CTA, mobile drawer, and breadcrumbs.

### Step 2.3: Adventure Dashboard (Home Page Redesign)
- Hero adventure banner, rider lifetime stats, active ride spotlight, and recent trips grid.

### Step 2.4: Trip Details Page Experience & Lifecycle Header
- Trip lifecycle hero header with status transitions (Planning ➔ Active ➔ Completed).
- Live count badges on tab navigation (`Checklist (8/12)`, `Docs (3)`, etc.).
- Content-matching skeleton loaders replacing generic spinners.

### Step 2.5: Interactive Map & Itinerary Polish
- Two-way sync between map markers and itinerary day cards.
- Fluid, hardware-accelerated micro-animations (card hovers, tab switches, drag-and-drop feedback).

---

# Sprint 11 Task Tracking Matrix

| # | Task | Area | Status |
|---|---|---|---|
| **11.1** | API Client & RFC 7807 Error Interceptor | 🏗️ Architecture | Pending |
| **11.2** | Directory & Schema Normalization | 🏗️ Architecture | Pending |
| **11.3** | Query Key Factories & Mutation Hardening | 🏗️ Architecture | Pending |
| **11.4** | Dialog Normalization & Maps Debouncing | 🛡️ Hardening | Pending |
| **11.5** | Vitest + RTL Automated Testing Suite | 🛡️ Hardening | Pending |
| **11.6** | Multi-Tier Error Boundaries & Map Fallback | 🛡️ Hardening | Pending |
| **11.7** | Route Lazy Loading & Code-Splitting | 🏗️ Architecture | Pending |
| **11.8** | Adventure Design System & Theme | 🎨 UX / UI | Pending |
| **11.9** | App Shell, Navigation & Breadcrumbs | 🎨 UX / UI | Pending |
| **11.10**| Adventure Dashboard (Home Page) | 🎨 UX / UI | Pending |
| **11.11**| Trip Details Lifecycle Header & Badged Tabs | 🎨 UX / UI | Pending |
| **11.12**| Map + Itinerary Sync & Micro-Interactions | 🎨 UX / UI | Pending |
