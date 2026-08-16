# 13. Accommodation 1:1 TripStop Binding and Automatic Budget Sync

* Status: Approved
* Date: August 2026

## Context

Sprint 7 introduced accommodation stay planning as a first-class concept.

We needed to decide how `Accommodation` entities relate to `TripStop` itinerary items, how accommodation costs integrate with `TripBudget`, and how stays without geographic coordinates should be handled.

## Decision

1. **1:1 TripStop Binding**:
   - `Accommodation` is bound 1:1 to a `TripStop` entity.
   - Stay duration (`Nights`) is calculated automatically as `CheckOutDate - CheckInDate`.
   - Chronological re-indexing of all trip stops occurs automatically based on `CheckInDate`.

2. **Automatic Budget Estimate Synchronization**:
   - Creating or updating an accommodation cost automatically synchronizes an estimate in the `Accommodation` category of `TripBudget`.
   - Title synchronization is maintained automatically from `TripStop.Name`.

3. **Support for Address-Only Stays**:
   - Stays without Google Places coordinates (`Latitude == null`, `Longitude == null`) are fully supported for booking and itinerary management.
   - Map route polyline generation ignores unlocated stops without placing markers at origin coordinates `(0, 0)`.

## Consequences

### Positive
- **Seamless UX**: Selecting "Hotel" when adding a trip stop automatically offers accommodation reservation details in a unified workflow.
- **Automated Financial Tracking**: Riders do not need to manually enter accommodation cost estimates into the budget tool separately.

### Negative
- Deleting an accommodation-linked trip stop cascades and removes the associated accommodation reservation and synchronized budget estimate.
