# Sprint 7 – Accommodation & Stay Planning

**Goal:** Make accommodation a first-class trip-planning capability while keeping RidePlanner's domain independent of external accommodation providers.

**Status:** Planned  
**Sprint:** 7  
**Theme:** Accommodation & Stay Planning

---

## Sprint Overview

Sprint 7 introduces accommodation as a first-class planning concept in RidePlanner.

Sprint 6 established the core trip-planning intelligence:

- Budget planning
- Preparation checklist
- Itinerary intelligence
- Trip overview
- Tabbed Trip Details experience

The next major missing planning concept is:

> **Where am I staying during the trip?**

A hotel/accommodation currently exists primarily as a `TripStop` category. Sprint 7 should enrich this concept with stay, reservation, location, and cost information while integrating it naturally with the existing Itinerary, Map, Budget, and Overview features.

### Core Architectural Principle

> **Google Maps / Google Places is an optional enrichment provider, never the source of truth for accommodation.**

RidePlanner must support accommodation created entirely manually.

When a Google Places result exists, the user may select it to pre-populate useful information. The user can then edit the imported values before saving. Once saved, RidePlanner's own accommodation data is the source of truth.

---

# Sprint Goals

By the end of Sprint 7, users should be able to:

- Create and manage accommodation associated with a trip.
- Record stay dates and derive the number of nights.
- Store reservation/confirmation information.
- Store optional contact and booking notes.
- Store accommodation location information.
- Optionally enrich accommodation details using Google Places.
- Manually enter accommodation when no Google Place exists.
- Edit Google-enriched information before and after saving.
- Associate accommodation cost with the existing Budget `Accommodation` category.
- View accommodation information naturally within the itinerary.
- Surface relevant accommodation information in the trip overview.

---

# Milestones

## Milestone 1 – Accommodation Domain & Architecture

Before implementation, inspect the existing `TripStop` architecture and decide the cleanest domain representation.

### Architectural decision to make

Evaluate:

### Option A – Extend `TripStop`

```text
TripStop
├── General stop information
├── Category
├── Dates
├── Location
└── Accommodation-specific information
```

### Option B – Separate `Accommodation` entity

```text
TripStop
   │
   └── Accommodation
        ├── Stay information
        ├── Reservation information
        ├── Location enrichment
        └── Cost
```

The decision should be based on:

- Existing Clean Architecture conventions
- Domain ownership
- EF Core relationship complexity
- API complexity
- Frontend complexity
- Future extensibility
- Avoiding unnecessary abstraction

### Stay information

The model should support:

- Check-in
- Check-out
- Number of nights (derived)
- Accommodation type

Potential accommodation types include:

- Hotel
- Hostel
- Homestay
- Resort
- Campsite
- Other

The exact domain model should be finalized after inspecting the existing codebase.

### Reservation information

Potential fields:

- Confirmation / reservation number
- Contact name
- Contact phone
- Website
- Booking notes

All optional unless a domain rule establishes otherwise.

---

# Milestone 2 – Accommodation Backend

Implement the approved domain design using the existing RidePlanner Clean Architecture conventions.

### Backend scope

- Domain entities/value objects as required
- EF Core configuration
- PostgreSQL migration
- Repository abstractions where required
- Application commands
- Application queries
- DTOs
- Mapping
- Validators
- API endpoints
- Dependency injection
- Tests/verification where applicable

### Requirements

- Accommodation must belong to a specific trip.
- Accommodation must remain usable without Google Places.
- Existing TripStop functionality must not be unnecessarily duplicated.
- Existing route/map behavior must continue working.
- Existing itinerary behavior must remain compatible.

---

# Milestone 3 – Google Places Enrichment

Google Places should be treated strictly as an optional enrichment provider.

## User flow

```text
User creates accommodation
        │
        ▼
Search / select Google Place (optional)
        │
        ├── Match found
        │      ↓
        │   Prefill details
        │      ↓
        │   User can edit
        │      ↓
        │   Save to RidePlanner
        │
        └── No match / Skip
               ↓
          Manual entry
               ↓
        Save to RidePlanner
```

### Possible Google-enriched information

Depending on what the existing Places integration provides:

- Place name
- Formatted address
- Latitude
- Longitude
- Google Place ID
- Phone number
- Website
- Other appropriate place metadata

### Important rule

Google-derived values are **prefill/enrichment data**, not authoritative data.

After saving:

```text
Google Places
      ↓
Optional enrichment
      ↓
User edits
      ↓
RidePlanner Accommodation
      ↓
RidePlanner database = source of truth
```

The optional Google Place ID may be retained as an external reference.

The feature must not require a Google Place ID.

---

# Milestone 4 – Budget Integration

Accommodation costs should integrate with the existing Sprint 6 Budget feature.

## Approved direction

Accommodation cost should **automatically synchronize** into the Budget `Accommodation` category.

The relationship must have clear ownership so that an accommodation reservation does not accidentally get counted twice.

Conceptually:

```text
Accommodation
     │
     │ known cost
     ▼
Budget Estimate
     │
     ▼
Accommodation category
```

### Important requirement

The implementation must define what happens when:

- Accommodation cost is created.
- Accommodation cost is edited.
- Accommodation is deleted.
- Accommodation is duplicated/replaced.
- Multiple accommodation stays exist.

The system must avoid:

```text
Hotel = ₹8,500

Budget manually contains:
Accommodation = ₹10,000

Total accidentally becomes:
₹18,500
```

The linked accommodation estimate should have an explicit relationship/ownership model.

---

# Milestone 5 – Itinerary Integration

Accommodation should become a natural part of the existing itinerary.

For an accommodation stop, users should be able to see:

```text
🏨 The Grand Manali

Aug 15 → Aug 17
🌙 2 nights

Confirmation: ABC123

📞 Contact
🌐 Website
📝 Booking notes

₹8,500
```

Integration should work with the existing:

- List View
- Timeline View
- Route connectors
- Stay duration indicators
- Map markers
- Stop selection synchronization

Accommodation location should continue to participate in the existing route/map model.

---

# Milestone 6 – Overview Integration

The Overview Dashboard should expose useful accommodation information without duplicating the full accommodation UI.

Potential information:

- Next/upcoming accommodation
- Upcoming check-in
- Number of nights
- Accommodation cost snapshot

The Overview should remain a compact command center.

---

# Milestone 7 – Frontend Polish & Verification

Follow the established RidePlanner workflow:

1. Implement backend/domain first.
2. Verify API and database behavior.
3. Freeze the backend contract.
4. Implement frontend.
5. Verify end-to-end flows.
6. Perform a focused UI polish pass.
7. Run final build/lint checks.
8. Commit the sprint.

---

# Google Places Boundary

This principle is mandatory for Sprint 7.

```text
                 User
                  │
          ┌───────┴────────┐
          │                │
   Google Places        Manual Entry
   (optional)           (always valid)
          │                │
          └───────┬────────┘
                  ▼
          RidePlanner
        Accommodation
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
    Itinerary    Map      Budget
```

### Google Places is NOT:

- The accommodation database.
- Required to create accommodation.
- Required to edit accommodation.
- Required for existing accommodation to remain valid.
- The authoritative source after the user saves data.

### RidePlanner IS:

- The source of truth.
- Responsible for saved accommodation data.
- Responsible for user edits.
- Independent of Google Places availability.

This boundary should be reflected in both the domain model and frontend UX.

---

# Out of Scope

The following are explicitly **not part of Sprint 7**:

- Booking.com integration
- Airbnb integration
- MakeMyTrip or other booking-provider integrations
- Direct hotel booking
- Payment processing
- Hotel availability checking
- Hotel recommendation engine
- Accommodation search/recommendation platform
- Actual expense tracking
- Receipt management
- Weather integration
- GPX/export functionality
- Offline trip packs
- Public trip sharing
- Major Trip Details visual redesign

These may be considered in later sprints.

---

# Open Architectural Decisions

These should be resolved before implementation:

1. **TripStop extension vs dedicated Accommodation entity**
   - Determine based on the existing domain model and future extensibility.

2. **Check-in / check-out representation**
   - Evaluate `DateOnly`
   - Evaluate date + time
   - Evaluate `DateTimeOffset`
   - Choose the model that fits the current domain and timezone requirements.

3. **Accommodation type representation**
   - Enum/value object/string approach based on existing RidePlanner conventions.

4. **Google Place enrichment model**
   - Which fields should be persisted.
   - How optional `GooglePlaceId` is represented.
   - How user overrides are stored.

5. **Budget ownership**
   - Define the relationship between an accommodation reservation cost and its automatically synchronized Budget estimate.
   - Define update/delete behavior.

6. **Multiple stays**
   - Ensure multiple accommodation stays can exist within a trip without ambiguity or duplicate budget totals.

---

# Suggested Product Flow

```text
Trip
 │
 ├── Overview
 │     └── Upcoming stay snapshot
 │
 ├── Itinerary & Route
 │     └── Accommodation stop
 │           ├── Location
 │           ├── Check-in/out
 │           ├── Nights
 │           ├── Reservation
 │           └── Cost
 │
 ├── Budget & Costs
 │     └── Accommodation estimate
 │
 └── Checklist & Gear
       └── Existing preparation checklist
```

---

# Success Criteria

Sprint 7 is complete when:

- [ ] Accommodation architecture is finalized.
- [ ] Accommodation can be created manually.
- [ ] Accommodation can optionally be enriched from Google Places.
- [ ] Google Place data can be edited by the user.
- [ ] Accommodation remains valid without Google Places.
- [ ] Stay duration/nights are correctly derived.
- [ ] Reservation metadata is persisted.
- [ ] Accommodation location works with the existing map/route system.
- [ ] Accommodation cost automatically synchronizes with Budget.
- [ ] Budget synchronization does not double-count costs.
- [ ] Accommodation is visible in the itinerary.
- [ ] Relevant accommodation information appears in Overview.
- [ ] Existing TripStop, Route, Budget, Checklist, and Overview functionality remains intact.
- [ ] Frontend build succeeds.
- [ ] Backend build succeeds.
- [ ] Final manual end-to-end verification succeeds.

---

# Sprint 7 Completion Definition

At the end of Sprint 7, RidePlanner should answer:

> **Where am I staying, when am I staying there, how do I find/contact the place, what is my reservation information, where is it on the map, and how much will it cost?**

while remaining fully functional when no Google Places result exists.

---

# Development Workflow

RidePlanner will continue using the established implementation workflow:

```text
Architecture
    ↓
Domain
    ↓
Backend
    ↓
Database / Migration
    ↓
API Verification
    ↓
Frontend
    ↓
Integration
    ↓
UI Polish
    ↓
Sprint Verification
    ↓
Commit
```

Antigravity should inspect the existing codebase before implementation and propose architectural changes where necessary. Implementation should begin only after the domain/API design is reviewed and approved.
