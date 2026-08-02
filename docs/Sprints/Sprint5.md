# Sprint 5 – Maps & Spatial Intelligence

> Goal: Make geography a first-class citizen.

## Sprint Overview

Sprint 5 transforms Ride Planner from a CRUD application into a true trip planning platform by introducing interactive maps and location intelligence.

By the end of this sprint users should be able to:

- View trips on an interactive map
- Search locations using Google Places
- Visualize routes
- Interact with both the map and timeline seamlessly

---

# Objectives

## Primary Goals

- Google Maps integration
- Places Autocomplete
- Interactive stop markers
- Route visualization
- Timeline ↔ Map synchronization
- Automatic map fitting

## Non Goals

These are intentionally excluded from Sprint 5.

- Weather
- Fuel planning
- GPX import/export
- Offline maps
- AI recommendations
- Expense tracking

---

# Architecture Goals

This sprint introduces the application's mapping architecture.

## Principles

- Maps should be provider-agnostic.
- Google-specific APIs should remain isolated.
- Components should be reusable.
- Business logic should not live inside map components.

---

# Milestones

---

## Milestone 1 — Google Maps Foundation

### Goal

Render an interactive Google Map.

### Deliverables

- [ ] Google Maps SDK
- [ ] API key configuration
- [ ] Environment variables
- [ ] MapProvider
- [ ] Reusable Map component
- [ ] Loading state
- [ ] Error state
- [ ] Responsive layout

### Acceptance Criteria

- Map renders successfully.
- No API key is hardcoded.
- Component is reusable.

---

## Milestone 2 — Places Autocomplete

### Goal

Replace manual location entry with Google Places.

### Deliverables

- [ ] Search box
- [ ] Google Places Autocomplete
- [ ] Store Place ID
- [ ] Store formatted address
- [ ] Store latitude
- [ ] Store longitude

### Data Model

TripStop

- PlaceId
- DisplayName
- FormattedAddress
- Latitude
- Longitude

### Acceptance Criteria

User selects a place and all fields populate automatically.

---

## Milestone 3 — Stop Markers

### Goal

Display trip stops visually.

### Deliverables

- [ ] Render markers
- [ ] Marker click support
- [ ] Selected marker highlight
- [ ] Category icons (optional)

### Acceptance Criteria

All trip stops appear on the map.

---

## Milestone 4 — Route Visualization

### Goal

Display the journey.

### Deliverables

- [ ] Polyline connecting stops
- [ ] Ordered route

Future Enhancement

- Google Routes API

### Acceptance Criteria

Users can visually understand travel order.

---

## Milestone 5 — Timeline ↔ Map Synchronization

### Goal

Synchronize map and itinerary.

### Deliverables

- [ ] Clicking marker selects stop
- [ ] Clicking stop centers map
- [ ] Shared selected state

### Acceptance Criteria

Timeline and map remain synchronized.

---

## Milestone 6 — Fit Bounds

### Goal

Automatically frame the entire trip.

### Deliverables

- [ ] Calculate bounds
- [ ] Auto zoom
- [ ] Padding

### Acceptance Criteria

Entire trip is visible immediately after loading.

---

# Technical Decisions

## Mapping Provider

Google Maps

Reason:

- Excellent India coverage
- Places API
- Directions
- Street View
- Affordable pricing for expected usage

Future providers can be introduced through the MapProvider abstraction.

---

# Folder Structure

shared/
maps/
Map.tsx
MapProvider.tsx
types.ts
hooks/

features/
maps/

---

# Risks

- Google API quotas
- API key security
- Places API billing
- Large trips containing hundreds of markers

---

# Sprint Deliverable

Trip

↓

Trip Summary

↓

Interactive Map

↓

Timeline

↓

Connected Route

↓

Map ↔ Timeline Synchronization

---

# Success Criteria

Sprint 5 is complete when:

- [ ] Interactive map is operational
- [ ] Places Autocomplete works
- [ ] Stops render as markers
- [ ] Route is visible
- [ ] Timeline synchronizes with the map
- [ ] Entire trip automatically fits within the viewport

---

# Future Work

Sprint 6

- Expenses
- Budget
- Statistics
- Dashboard
- Version 1.0 Release

Sprint 7

- Design System
- Timeline 2.0
- Product Identity
- Responsive Polish

Sprint 8+

- Weather
- Fuel Planner
- GPX
- Offline Maps
- Sharing
- AI Features
