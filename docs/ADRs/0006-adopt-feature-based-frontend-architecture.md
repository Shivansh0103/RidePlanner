# ADR-0006: Adopt Feature-Based Frontend Architecture

- Status: Accepted
- Date: July 2026

## Context
As the frontend grew beyond a single Trips page, organizing files by technical type (components/, hooks/, pages/) would make features difficult to navigate and maintain.

## Decision
Organize the frontend by feature.

```
features/
  trips/
    api/
    components/
    hooks/
    pages/
    schemas/
    types/
```

Shared functionality remains under `shared/`.

## Rationale
- High cohesion
- Clear ownership
- Easier scaling
- Reduced cross-feature coupling

## Alternatives Considered
- Layer-first organization
- Domain folders mixed with shared code

## Consequences
Future modules (Hotels, Expenses, Fuel Stops, Itinerary, Documents) can follow the same structure with minimal friction.
