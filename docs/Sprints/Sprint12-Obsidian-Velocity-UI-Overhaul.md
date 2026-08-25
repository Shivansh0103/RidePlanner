# Sprint 12 — Obsidian Velocity UI/UX Overhaul & Frontend Hardening

**Goal:** Transform the RidePlanner web application into a polished, cutting-edge dark **Obsidian Velocity** adventure cockpit based on the validated Google Stitch designs, while preserving 100% existing functionality, API contracts, data flows, and technical correctness.

The sprint prioritizes a **major visual and UX overhaul** rather than incremental styling. The existing React/TypeScript architecture should be improved where necessary, while frontend performance, React Query behavior, backend contracts, validation, and critical application flows are continuously protected against regressions.

**Status:** 📋 Planned & Ready for Execution  
**Sprint:** 12  
**Design Reference:** Google Stitch Project `7606264885670902228` — "Ride Planner - Obsidian Velocity"

---

# 1. Sprint Philosophy

Sprint 12 has three equally important objectives:

### 🎨 1. Visual & UX Transformation

Make RidePlanner look and feel like a polished production application.

This includes:

- New visual identity
- New application shell
- Redesigned navigation
- Redesigned dashboards
- Bento-style information layouts
- Improved typography
- Better information hierarchy
- Better forms
- Better cards
- Better empty/loading/error states
- Responsive layouts
- Micro-interactions and transitions where appropriate

We should **not be afraid to substantially redesign existing screens** where the current UX is weak.

### 🏗️ 2. Frontend Architecture

Use the redesign as an opportunity to improve the React/TypeScript codebase.

Focus on:

- Component boundaries
- Feature organization
- Shared UI primitives
- Type safety
- React Query usage
- Form architecture
- Validation
- Routing
- State management
- Reusable design-system components
- Elimination of unnecessary duplication

### 🛡️ 3. Technical Hardening

The visual overhaul must **not break the application underneath it**.

Protect:

- API contracts
- React Query cache behavior
- Query invalidation
- Mutation flows
- Zod validation
- Backend integration
- Database-backed workflows
- Routing
- Existing business rules
- Existing tests

The principle is:

> **Change the UI aggressively. Protect the behavior aggressively.**

---

# 2. Obsidian Velocity Design System

## 🎨 Color Tokens

### Canvas / Base

- Deep Obsidian Black: `#121416`
- Secondary Obsidian: `#1a1a1e`

### Elevated Surfaces

- Translucent Obsidian: `rgba(31, 31, 36, 0.75)`
- `backdrop-filter: blur(12px)` where performance permits

### Primary Accent

Electric Indigo:

- `#6366f1`
- `#818cf8`

Used for:

- Primary actions
- Active navigation
- Selected states
- Route/path visualizations
- Important interactive elements

### Positive / Telemetry

Acid Green:

- `#bef264`
- `#a3e635`

Used selectively for:

- Active status
- Readiness
- Successful completion
- Positive metrics

### Warning / Emergency

- Amber: `#fbbf24`
- Crimson: `#f87171`

### Technical Outlines

```text
rgba(255, 255, 255, 0.08)
```

Used for subtle borders and separation.

---

# 3. Typography

### Headings

Primary:

- Plus Jakarta Sans / Montserrat
- Weight `700–800`
- Tight letter spacing

### Body

- Inter
- Weight `400–500`
- Approximate line-height `1.6`

### Telemetry / Numerical Data

- JetBrains Mono / equivalent monospace

Used where numerical alignment benefits readability:

- Distance
- Driving time
- Elevation
- Currency
- Coordinates
- Statistics
- Measurements

**Important:** Monospace should be used intentionally rather than forcing every piece of numerical UI into it.

---

# 4. Design System Architecture

The redesign should establish reusable UI primitives before duplicating visual patterns across feature pages.

Target hierarchy:

```text
Design Tokens
      ↓
UI Primitives
      ├── Button
      ├── Input
      ├── Select
      ├── Card
      ├── Badge
      ├── Tabs
      ├── Dialog
      ├── Progress
      ├── Status
      ├── Tooltip
      ├── Empty State
      └── Loading State
            ↓
Feature Components
            ↓
Pages
```

The exact component structure should be determined from the existing frontend audit rather than forcing artificial abstractions.

### Design-system rule

> If multiple features independently implement the same visual/interaction pattern, evaluate whether it should become a shared component.

Do not create abstractions purely for theoretical reuse.

---

# 5. Milestone 0 — Current Frontend Baseline & Audit

**Purpose:** Understand exactly what exists before changing the UI.

Before implementation begins, establish a baseline for:

### Application inventory

- Routes
- Pages
- Feature modules
- Shared components
- Hooks
- API clients
- React Query queries
- React Query mutations
- Forms
- Zod schemas
- Important user flows

### Technical baseline

Record:

- Frontend test count/status
- Backend test count/status
- Production build status
- Existing TypeScript/build warnings
- Existing console errors
- Current bundle size
- Important network/API requests
- Existing performance issues where observable

### Feature parity inventory

Explicitly identify:

```text
Existing feature
        ↓
Current UI
        ↓
Underlying API
        ↓
Query / Mutation
        ↓
Validation
        ↓
Expected behavior
```

This becomes the **Sprint 12 regression baseline**.

### Stitch mapping

For every major Stitch screen, identify:

- Existing RidePlanner functionality represented by the design
- Existing functionality that is not represented
- Visual elements that are purely presentation
- Potentially new functionality implied by the design

**No functionality should be accidentally invented just to reproduce a mockup.**

---

# 6. Milestone 1 — Obsidian Theme Engine & Application Shell

### Objectives

Build the visual foundation.

### Tasks

- Update MUI theme tokens
- Establish Obsidian color system
- Typography system
- Global spacing
- Border/radius system
- Surface/elevation system
- Global background
- Scroll behavior
- Focus states
- Dark-mode foundations
- Global transitions where appropriate
- Glass effects where performance permits

### Application shell

Redesign:

- Top navigation
- Logo/branding
- Active trip/status indicator
- Quick actions
- Profile area
- Navigation behavior
- Mobile navigation drawer

### Quality gates

- Existing routes remain accessible
- SPA navigation works
- No full-page reloads introduced
- No broken authentication/application providers
- Existing React Query provider remains intact
- Existing theme-dependent functionality works
- Production build succeeds

---

# 7. Milestone 2 — Tactical Home Dashboard

Redesign `HomePage.tsx` around the Stitch concept.

### Potential sections

- Tactical hero
- Lifetime trip statistics
- Active ride spotlight
- Planning shortcuts
- Recent/upcoming trips
- Relevant readiness information

### Important constraint

Only display data that is actually available from the application.

If a Stitch design contains a metric that RidePlanner does not currently calculate, we should either:

1. derive it safely from existing data, or
2. explicitly scope the metric as new functionality.

We should **not fake telemetry** merely to match the design.

### Quality gates

- Dashboard loads correctly with real backend data
- Loading state
- Empty state
- API failure state
- No unnecessary duplicate requests
- Navigation verified

---

# 8. Milestone 3 — My Expeditions / Trips Explorer

Redesign the trip listing experience.

### UI

- Status filter pills
- Dynamic counts
- Search
- Debounced input
- High-contrast trip cards
- Improved empty state
- Loading skeleton
- Error state
- Responsive grid

### Technical requirements

- Preserve existing query behavior
- Preserve filtering semantics
- Preserve pagination if present
- Avoid unnecessary API requests
- Debounce search appropriately
- Maintain React Query caching
- Ensure filter changes don't cause stale UI

### Quality gate

Real backend data must work across:

```text
All
Active
Planning
Completed
```

where those states exist in the current domain.

---

# 9. Milestone 4 — Master Trip Cockpit

This is the major visual centerpiece of the sprint.

### Desktop

Target Stitch-inspired Bento layout.

Potential structure:

```text
┌──────────────────────────────────────────────┐
│                Trip Header                   │
├───────────────────────────┬──────────────────┤
│                           │                  │
│       Map / Route         │   Readiness      │
│                           │   / Status       │
│                           │                  │
├───────────────────────────┤                  │
│ Timeline / Stops          │ Next Stay        │
│                           │ Gear / Tasks      │
└───────────────────────────┴──────────────────┘
```

The exact proportions should remain responsive rather than hardcoded.

### Map

Add the Stitch-inspired visual treatment around the existing Google Maps functionality.

**Do not rewrite working map/autocomplete logic solely for visual reasons.**

### Timeline

Improve:

- Stop hierarchy
- Current stop
- Completed stops
- Upcoming stops
- Dates/times
- Route relationships

### Readiness

Use existing readiness data where available.

### Quality gate

The complete Trip Details flow must continue to support:

- Loading
- Existing data
- Navigation
- Existing mutations
- Route/map behavior
- Existing business rules
- Error handling

---

# 10. Milestone 5 — Feature Experience Overhaul

Redesign existing feature sections while preserving their functionality.

## Budget

- Budget overview
- Target vs actual
- Expense ledger
- Fuel information where supported
- Better visual hierarchy
- Improved expense form
- Better empty states

Preserve:

- Expense mutations
- Validation
- Query invalidation
- Calculations

---

## Accommodations / Stays

Improve:

- Stay cards
- Confirmation/status badges
- Check-in/check-out information
- Contact actions
- Empty states
- Responsive layout

Preserve existing accommodation APIs and mutations.

---

## Checklist / Preparation

Improve:

- Category organization
- Progress indicators
- Completion states
- Empty states
- Interaction feedback

Preserve existing checklist behavior and validation.

---

## Safety / Emergency

Improve:

- Emergency contact presentation
- Priority hierarchy
- Contact actions
- Status/badges where supported
- Mobile accessibility

**Do not introduce sensitive information or medical functionality that does not already exist simply because it appears visually useful in the Stitch concept.**

---

# 11. Milestone 6 — Responsive & Accessibility Overhaul

The new design must work across:

### Desktop

Primary cockpit experience.

### Tablet

Adaptive Bento/grid layouts.

### Mobile

Reflowed layouts and navigation drawer.

Potential transformation:

```text
Desktop
65 / 35 Bento
     ↓
Tablet
Stacked / adaptive grid
     ↓
Mobile
Single-column prioritized experience
```

### Accessibility

Verify:

- Semantic HTML
- Keyboard navigation
- Focus states
- Accessible labels
- Dialog accessibility
- Form error announcements
- Sufficient contrast
- Touch target sizes
- Reduced-motion consideration

---

# 12. Frontend Performance Guardrails

The redesign should **not be blocked by premature optimization**, but we must actively detect regressions.

### Protect against

- Duplicate API requests
- Duplicate React Query queries
- Incorrect cache invalidation
- Refetch loops
- Excessive re-renders
- Unnecessary state
- Huge component trees
- Unnecessarily heavy dependencies
- Large images/assets
- Excessive animations
- Expensive visual effects
- Unnecessary synchronous work

### Performance techniques where justified

- React Query caching
- Debounced search
- Lazy loading
- Code splitting
- Memoization where profiling justifies it
- Efficient list rendering
- Optimized assets
- Appropriate image sizing

### Important rule

> **Measure before optimizing.**

Do not introduce `useMemo`, `useCallback`, lazy loading, virtualization, or other complexity simply because they sound performant.

---

# 13. Backend & API Regression Protection

Sprint 12 is frontend-focused, but the backend remains a protected dependency.

For every affected feature, verify:

```text
UI
 ↓
React Query
 ↓
API Client
 ↓
HTTP Endpoint
 ↓
Application Layer
 ↓
Domain
 ↓
EF Core / Database
 ↓
Response
 ↓
Query Cache
 ↓
UI
```

### Non-negotiable

Do not silently change:

- API contracts
- DTO expectations
- Request payloads
- Response shapes
- Validation contracts
- Query keys
- Mutation behavior
- Domain business rules

If a backend change becomes genuinely necessary, it must be treated as an **explicit technical change**, not hidden inside a UI redesign task.

---

# 14. Technical Flow Protection

Every mutation flow should preserve:

```text
User Action
    ↓
Form Validation
    ↓
Mutation
    ↓
Backend
    ↓
Success / Failure
    ↓
Query Invalidation
    ↓
Updated UI
```

Verify this for critical flows such as:

- Create trip
- Edit trip
- Delete trip
- Add/edit/delete expense
- Add/edit/delete accommodation
- Checklist updates
- Emergency contact mutations
- Itinerary changes

where applicable to the existing application.

---

# 15. Testing Strategy

Testing should focus on **behavior**, not superficial visual implementation.

### Frontend

Maintain or improve existing coverage across:

- Components
- Hooks
- Forms
- Query/mutation behavior
- Critical user flows

### Backend

Existing backend suite must remain green.

Current baseline:

> **67/67 backend tests passing**

That number should not regress.

### Integration / E2E

Prioritize critical flows:

```text
Login / application entry
        ↓
Trips
        ↓
Trip Details
        ↓
Itinerary
        ↓
Budget
        ↓
Accommodation
        ↓
Checklist
        ↓
Emergency Contacts
```

The exact flows should be finalized during Milestone 0 based on the current application.

---

# 16. Network & API Audit

As screens are redesigned, inspect browser network behavior.

Look for:

- Duplicate GET requests
- Requests triggered unnecessarily by rendering
- Mutations followed by excessive refetches
- Incorrect query invalidation
- Failed requests hidden by the UI
- Requests occurring after component unmount
- Stale data remaining visible after mutations

The objective isn't zero requests.

The objective is:

> **Every network request should have a reason.**

---

# 17. Production Build & Bundle Verification

At appropriate milestones:

```bash
npm run test
npm run build
```

Additionally inspect:

- Bundle size
- Chunk structure
- Unexpected dependency growth
- Build warnings
- TypeScript errors
- CSS warnings
- Console errors

### Bundle target

Do **not** enforce an arbitrary `<200 KB` target.

Instead:

> **No unexplained or significant bundle-size regression compared with the Milestone 0 baseline.**

If bundle size increases materially, investigate why before accepting it.

---

# 18. Incremental Development & Git Discipline

Each milestone should be independently verifiable.

Preferred flow:

```text
Implement
   ↓
Run tests
   ↓
Run build
   ↓
Manual verification
   ↓
Network/API verification where relevant
   ↓
Commit
```

Use conventional atomic commits.

Examples:

```text
feat(ui): introduce obsidian theme system
feat(ui): redesign application shell
feat(trips): redesign trip explorer
feat(trips): overhaul trip cockpit
refactor(ui): extract shared design primitives
test(ui): add trip explorer interaction coverage
perf(ui): optimize trip dashboard rendering
```

Avoid giant:

```text
feat: completely redesign frontend
```

commits.

---

# 19. Regression Matrix

Maintain a simple Sprint 12 verification matrix.

| Area | Baseline | Sprint 12 Requirement |
|---|---|---|
| Backend tests | 67/67 | ✅ No regression |
| Frontend tests | Milestone 0 baseline | ✅ Maintain/improve |
| Production build | ✅ | ✅ |
| TypeScript | Baseline | No new errors |
| Routes | Baseline | 100% functional |
| API contracts | Baseline | No accidental breaking changes |
| Query behavior | Baseline | No unexplained duplicate requests |
| Mutations | Baseline | All critical flows functional |
| Validation | Baseline | Existing Zod behavior preserved |
| Responsive UI | Existing | Desktop + tablet + mobile |
| Accessibility | Baseline | Improved |
| Bundle size | Baseline | No unexplained significant regression |
| Console errors | Baseline | No new unexplained errors |
| Visual design | Existing | Obsidian Velocity |
| Feature parity | Existing | 100% |

---

# 20. Non-Negotiable Engineering Constraints

### 1. Zero intentional feature regressions

Existing functionality must remain available unless explicitly redesigned/replaced.

### 2. UI freedom

The visual overhaul is **not** constrained by the current UI.

We are allowed to:

- restructure pages
- replace layouts
- redesign navigation
- change component composition
- introduce new reusable UI primitives
- substantially change visual hierarchy

### 3. Architecture protection

Do not sacrifice:

- React Query architecture
- Type safety
- Zod validation
- API contracts
- routing
- domain rules
- testing

for visual fidelity.

### 4. Stitch is a design reference

Stitch defines the visual direction.

It does **not** dictate:

- backend architecture
- API contracts
- state management
- data modeling
- unnecessary functionality

### 5. Real data only

Do not fabricate metrics or telemetry merely to reproduce a design.

### 6. Measure before optimizing

Performance optimizations should be justified by measurement or a clear architectural reason.

### 7. Every critical flow must be verified

A beautiful UI that breaks a mutation is a failed implementation.

### 8. Backend remains green

The frontend sprint must not leave the backend in a degraded state.

### 9. Accessibility is part of quality

Accessibility is not a final cosmetic pass.

### 10. Pedagogical implementation

For significant architectural/refactoring decisions document:

**What changed → How it works → Why → Advantages → Trade-offs**

---

# 21. Final Sprint Verification

## Visual

- [ ] Obsidian Velocity design consistently applied
- [ ] All major Stitch screens implemented
- [ ] Navigation visually consistent
- [ ] Typography consistent
- [ ] Cards/surfaces consistent
- [ ] Forms redesigned
- [ ] Loading states redesigned
- [ ] Empty states redesigned
- [ ] Error states redesigned
- [ ] Responsive layouts verified

## Functional

- [ ] All existing routes work
- [ ] All critical flows work
- [ ] All forms submit correctly
- [ ] Validation works
- [ ] Mutations work
- [ ] Query invalidation works
- [ ] Navigation works without full-page reloads
- [ ] Google Maps functionality remains operational

## Engineering

- [ ] Frontend tests pass
- [ ] Backend tests pass
- [ ] Production build passes
- [ ] No new TypeScript errors
- [ ] No unexplained console errors
- [ ] No unexplained API requests
- [ ] No significant unexplained bundle regression
- [ ] Accessibility checks completed
- [ ] Mobile/tablet/desktop verified

## Documentation

- [ ] Architecture changes documented
- [ ] Design system documented
- [ ] Significant trade-offs documented
- [ ] Sprint version updated
- [ ] README/project documentation updated
- [ ] Conventional commits pushed to GitHub

---

# Sprint 12 Success Criteria

Sprint 12 is successful when we can honestly say:

> **RidePlanner looks substantially better than the previous version, while its underlying engineering quality has not regressed.**

More specifically:

```text
                    SPRINT 12
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
       🎨 UI/UX       🏗️ Code       🛡️ Reliability
          │             │             │
       Stitch        React/TS       API flows
       Design        Architecture   React Query
       System        Components     Validation
       Responsive    Reuse          Backend
       Accessibility Types          Tests
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                POLISHED RIDEPLANNER
```

### Guiding Rule

> ## **Make it beautiful. Make it better. Don't break what already works.**
