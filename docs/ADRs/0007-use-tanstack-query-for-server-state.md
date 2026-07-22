# ADR-0007: Use TanStack Query for Server State

- Status: Accepted
- Date: July 2026

## Context
The application communicates extensively with the backend. Managing loading, caching and mutations manually would increase complexity.

## Decision
Use TanStack Query for all server state.

## Rationale
- Built-in caching
- Automatic refetching
- Mutation lifecycle
- Query invalidation
- Excellent TypeScript support

## Responsibilities
- React State → UI state
- TanStack Query → Server state
- React Hook Form → Form state

## Alternatives Considered
- Manual state with useEffect
- Redux Toolkit Query
- SWR

## Consequences
Data-fetching patterns remain consistent across the application.
