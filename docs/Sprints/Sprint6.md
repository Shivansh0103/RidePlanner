# Sprint 6 -- Trip Planning Intelligence

**Status:** Completed  
**Estimated Duration:** 2 Weeks  
**Version:** 0.6.0  

------------------------------------------------------------------------

# Goal

Transform Ride Planner from a **route planning application** into a
**complete road trip planning platform**.

After planning **where** to go, users should be able to answer:

-   How long will the trip take?
-   How much will the trip cost?
-   Am I prepared for the journey?

Sprint 6 introduces the first layer of **Trip Intelligence**, helping
users make informed decisions before they leave while reducing the need
for spreadsheets and note-taking applications.

------------------------------------------------------------------------

# Why This Sprint?

The current application already allows users to:

-   ✅ Create and manage trips
-   ✅ Build itineraries with ordered stops
-   ✅ Search places using Google Places
-   ✅ Visualize routes on an interactive map
-   ✅ View estimated travel distance and duration

However, major planning questions still remain unanswered:

-   ❌ What will this trip cost?
-   ❌ Have I packed everything?
-   ❌ Is the itinerary realistic at a glance?

This sprint fills those gaps and moves Ride Planner closer to its
Version 1.0 vision.

------------------------------------------------------------------------

# Sprint Overview

Sprint 5 answered:

> **"Where am I going?"**

Sprint 6 answers:

-   **How long will it take?**
-   **How much will it cost?**
-   **Am I ready?**

The application evolves from route visualization into practical trip
planning.

------------------------------------------------------------------------

# Features

## 1. Budget Planning (Primary Feature)

Allow users to estimate the expected cost of a trip before departure.

Budget categories:

-   Fuel
-   Accommodation
-   Food
-   Tolls / Permits
-   Miscellaneous

Users should be able to:

-   Set an overall estimated budget
-   Allocate expected costs by category
-   View remaining budget
-   Update estimates as plans evolve
-   **Smart Fuel Cost Calculator**: Quickly auto-calculate estimated fuel cost using route distance (`Total Distance (km) / Vehicle Mileage (km/L) * Fuel Price (₹/L)`) derived from Sprint 5 route data.

Example:

``` text
Estimated Budget

Fuel            ₹9,500
Hotels         ₹14,000
Food            ₹6,000
Permits         ₹2,000
Misc            ₹3,000

------------------------

Total          ₹34,500
```

------------------------------------------------------------------------

## 2. Budget Dashboard

Provide meaningful financial insights.

Display:

-   Total estimated cost
-   Category-wise breakdown
-   Percentage allocation
-   Cost per day
-   Cost per stop

Future versions can extend this dashboard with actual expenses and
cost-per-kilometer metrics.

------------------------------------------------------------------------

## 3. Trip Readiness Checklist

Help users prepare for their journey using reusable checklists.

Suggested sections:

### Riding Gear

-   Helmet
-   Riding Jacket
-   Gloves
-   Rain Gear

### Motorcycle

-   Engine Oil
-   Chain Lubrication
-   Brake Pads
-   Tyre Pressure

### Documents

-   Driving License
-   RC
-   Insurance
-   PUC

Users can mark checklist items complete before the trip.

Key capabilities:

-   **Default Template Auto-seeding**: Auto-populate standard categories (*Riding Gear*, *Motorcycle*, *Documents*) when a trip is initialized so users never start with a blank list.
-   **Custom Items & Categories**: Allow users to add, edit, or remove custom items and categories to tailor checklists for specific trips.

------------------------------------------------------------------------

## 4. Itinerary Enhancements

Enhance the existing itinerary without redesigning the underlying model.

Improvements:

-   Display travel duration between consecutive stops
-   Display distance between consecutive stops
-   Show daily travel summaries
-   Improve visual hierarchy

Continue deriving travel days from stop metadata rather than introducing
a dedicated TravelDay entity.

------------------------------------------------------------------------

## 5. Trip Overview Dashboard

Provide a high-level summary at the top of the Trip Details page.

Example:

``` text
Delhi → Leh

10 Stops

2,350 km

42 Hours Driving

₹34,500 Estimated Budget

83% Checklist Complete
```

This becomes the primary health summary for a trip.

------------------------------------------------------------------------

# Backend Goals

Extend the existing domain with support for:

-   Budget
-   Budget Categories
-   Checklist
-   Checklist Items

Avoid unnecessary domain complexity.

Travel days should continue to be derived from stop metadata rather than
persisted as separate entities.

------------------------------------------------------------------------

# Frontend Goals

Introduce new feature modules:

``` text
features/
├── budget/
├── checklist/
├── overview/
└── itinerary/
```

Layout Architecture:

-   **Tabbed Layout Navigation**: Organize `TripDetailsPage` into clean tabs (*Overview & Map*, *Itinerary & Stops*, *Budget & Expenses*, *Checklist & Readiness*) to maintain visual clarity and prevent endless vertical scrolling as planning features grow.

Maintain the existing architecture:

-   Presentation Components
-   Hooks
-   Services
-   API Layer
-   Utilities

Business logic should remain outside React components.

------------------------------------------------------------------------

# Technical Goals

Continue reinforcing:

-   Feature-based architecture
-   React Query
-   React Hook Form
-   Zod validation
-   Derived state with useMemo
-   Component composition
-   Reusable dashboard components

------------------------------------------------------------------------

# Success Criteria

Sprint 6 is complete when users can:

-   Estimate the total cost of a trip
-   Auto-calculate estimated fuel costs using route distance, mileage, and fuel rate
-   Allocate costs across categories
-   View a budget summary dashboard
-   Track trip preparation with auto-seeded & customizable checklists
-   Navigate organized trip details seamlessly via Tabbed Layout (*Overview*, *Itinerary*, *Budget*, *Checklists*)
-   View travel distance and duration between stops
-   See daily itinerary summaries
-   Understand the overall health of a trip from a single dashboard

------------------------------------------------------------------------

# Out of Scope

The following features are intentionally postponed:

-   Actual expense tracking
-   Fuel price APIs
-   Weather integration
-   Hotel recommendations
-   AI itinerary generation
-   Route optimization
-   GPX import/export
-   Offline support

These belong to future sprints.

------------------------------------------------------------------------

# Expected Outcome

By the end of Sprint 6, Ride Planner should evolve beyond a route
planning application into a practical trip planning companion.

The application should answer not only:

> **"Where am I going?"**

but also:

-   How long will it take?
-   How much will it cost?
-   Am I ready for the trip?

This sprint strengthens Ride Planner's vision of replacing Google Maps,
spreadsheets, and personal notes with a single, focused planning
experience.
