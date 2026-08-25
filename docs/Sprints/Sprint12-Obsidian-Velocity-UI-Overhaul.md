# Sprint 12 – Obsidian Velocity UI/UX Overhaul & Precision Cockpit Architecture

**Goal:** Transform the RidePlanner web application into a cutting-edge, high-performance, dark obsidian & electric indigo adventure cockpit based on the validated Stitch design system ("Obsidian Velocity"), ensuring 100% feature parity, flawless responsiveness, zero broken flows, and atomic verification across every step.

**Status:** 📋 **Planned & Ready for Execution**  
**Sprint:** 12  
**Design Reference:** Google Stitch Project `7606264885670902228` ("Ride Planner - Obsidian Velocity")  

---

# Design System Specifications (Obsidian Velocity)

### 🎨 Color Tokens & Palette
* **Canvas / Base:** Deep Obsidian Black (`#121416` / `#1a1a1e`)
* **Elevated Panels / Glass Cards:** Translucent Obsidian (`rgba(31, 31, 36, 0.75)` with `backdrop-filter: blur(12px)`)
* **Primary Accent:** Electric Indigo (`#6366f1` / `#818cf8`) — used for active tabs, primary action triggers, and route paths
* **High-Visibility Status / Telemetry Accent:** Acid Green (`#bef264` / `#a3e635`) — used for Active status pulse, readiness 100%, and peak metrics
* **Warning / Alert Accent:** Amber Warmth (`#fbbf24`) & Crimson Emergency (`#f87171`)
* **Technical Outlines:** 1px subtle white stroke (`rgba(255, 255, 255, 0.08)`)

### ✍️ Typography & Telemetry System
* **Headings & Badges:** Plus Jakarta Sans / Montserrat (`700`, `800`) with tight letter spacing (`-0.02em`)
* **Body Text & Descriptions:** Inter (`400`, `500`) with high readability line-height (`1.6`)
* **Telemetry Data & Measurements:** **JetBrains Mono / Monospace** (`500`) for all numerical distances (`km`), driving times (`h/m`), elevation (`m`), currencies (`$`), and coordinates (tabular, zero layout shift)

---

# Sprint 12 Step-by-Step Implementation Roadmap

To ensure **zero regression, maximum performance, and clean code**, Sprint 12 is broken into 6 isolated, incremental milestones:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│        MILESTONE 1: Obsidian Theme Engine & App Shell (Foundation)       │
│ • Update MUI Theme Tokens (Obsidian, Electric Indigo, Acid Green, Mono) │
│ • Top Nav Header (Logo, Active Status Pill, Quick Actions, Profile)     │
│ • Glassmorphic Backdrop & Custom Sleek Dark Scrollbars                  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Verified with zero layout shift
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│        MILESTONE 2: Home Page & Tactical Dashboard (HomePage.tsx)       │
│ • Dark Tactical Hero Banner with Lifetime Telemetry Stats Ribbon        │
│ • Featured Active Ride Spotlight & Modular Expedition Planning Tools    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Verified with SPA navigation
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│       MILESTONE 3: My Expeditions / Trips Explorer (TripsPage.tsx)      │
│ • Status Filter Pills with dynamic counts ([All], [Active], [Planning]) │
│ • Real-time Debounced Search Box & High-Contrast 3-Column Cards Grid    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Verified with real backend data
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│      MILESTONE 4: Master Trip Cockpit Overview (TripDetailsPage.tsx)     │
│ • Bento Grid (65% Left / 35% Right Split)                               │
│ • Left: Google Map with Floating Glass Telemetry HUD + Node Timeline    │
│ • Right: Radial Readiness Gauge, Fuel Meter, Next Stay, Gear Checklists │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Verified with route recalculation
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│     MILESTONE 5: Dedicated Deep-Dive Tabs (Budget, Stays, Safety, Gear) │
│ • Budget & Fuel Telemetry: Fuel calculator gauge, Target vs Actual      │
│ • Stays & Lodging: Confirmation badges, check-in timelines, host dials  │
│ • Safety & Emergency Hub: Blood group badges, ICE dials, permits        │
│ • Logistics Checklists: Interactive category toggles & progress bars    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Verified with mutation hooks
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│     MILESTONE 6: End-to-End Responsive Verification & Test Hardening    │
│ • Mobile / Tablet Responsive Breakpoints (Drawer + Collapsing Bento)    │
│ • Vitest Unit Test Suite Execution (All tests passing)                  │
│ • Production Bundle Verification & Documentation Update                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# Milestone Details & Tasks Matrix

| Milestone | Task Description | Target Files | Quality Gate |
|---|---|---|---|
| **12.1** | **Theme Engine & Typography Tokens** | `frontend/src/app/theme/theme.ts`, `index.css`, `index.html` | Dark mode palette, JetBrains Mono font loaded, 0 CSS warnings |
| **12.2** | **Obsidian App Shell & Top Nav** | `frontend/src/layouts/MainLayout.tsx` | Sticky glassmorphic header, mobile drawer, SPA routing verified |
| **12.3** | **Tactical Home Dashboard** | `frontend/src/shared/pages/HomePage.tsx` | Lifetime stats ribbon, spotlight card, quick actions |
| **12.4** | **My Expeditions (Trips Explorer)** | `frontend/src/features/trips/pages/TripsPage.tsx`, `TripCard.tsx` | Status filter pills, debounced search, clean card hover elevation |
| **12.5** | **Trip Details Bento Cockpit** | `frontend/src/features/trips/pages/TripDetailsPage.tsx`, `TripOverview.tsx` | 65/35 Bento grid, floating Map HUD, node timeline |
| **12.6** | **Budget & Fuel Ledger Polish** | `frontend/src/features/budget/components/BudgetSection.tsx` | Dual-value meter, quick fuel button, expense log |
| **12.7** | **Accommodations & Stays View** | `frontend/src/features/accommodations/components/AccommodationsSection.tsx` | Confirmation tags, check-in timestamps, phone link actions |
| **12.8** | **Checklist & Safety Hub Polish** | `frontend/src/features/checklist/components/ChecklistSection.tsx`, `EmergencyContactsSection.tsx` | Categorized checkboxes, ICE medical badges |
| **12.9** | **Mobile Responsiveness & Testing** | All pages & `npm run test` + `npm run build` | 31+ unit tests passing, production build < 200 KB chunk load |

---

# Non-Negotiable Engineering Constraints
1. **Zero Flow Regressions:** Existing API endpoints, React Query mutation keys, Zod validation schemas, and Google Maps autocomplete hooks must remain 100% operational.
2. **Single-Page Architecture (`useNavigate`):** No anchor tag reloading or invalid button nesting.
3. **Incremental Commits:** Verify `npm run test` and `npm run build` at every single milestone before creating conventional atomic git commits.
4. **Pedagogical Breakdown:** For every refactored component, explain What was changed, How it was built, and the Advantages / Trade-offs.
