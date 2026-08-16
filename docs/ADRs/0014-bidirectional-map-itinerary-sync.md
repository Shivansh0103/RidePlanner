# 14. Bi-Directional Map and Itinerary Selection Synchronization

* Status: Approved
* Date: August 2026

## Context

Sprints 4 and 6 established interactive route management and tabbed workspace navigation.

Riders needed a smooth experience switching between reading itinerary timeline stop cards and viewing stop markers on the Google Maps camera viewport, without losing state during browser back/forward navigation or deep-linking.

## Decision

1. **Bi-Directional Selection Synchronization**:
   - Clicking a Google Maps marker automatically selects the stop in state and smoothly scrolls the Itinerary timeline to bring the stop card into view.
   - Selecting a stop card in the Itinerary timeline automatically pans and zooms the Google Maps camera to center on the selected marker.

2. **URL Search Parameter State Synchronization**:
   - Active tab state (`?tab=overview`, `?tab=itinerary`, `?tab=budget`, `?tab=checklist`, `?tab=documents`, `?tab=contacts`, `?tab=summary`, `?tab=memories`) is managed via React Router `useSearchParams()`.
   - Enables browser back/forward history navigation, deep-linking, and tab persistence across page reloads.

## Consequences

### Positive
- **Intuitive Interaction**: Eliminates friction when cross-referencing itinerary stops against geographic map markers.
- **Deep-Linkable**: Riders can share direct URLs to specific tabs (e.g. `?tab=summary` or `?tab=readiness`).

### Negative
- Component prop drilling or state callbacks required to sync selection across decoupled Map and Itinerary timeline components.
