# ADR-0009: Establish Shared UI Component Library

- Status: Accepted
- Date: July 2026

## Context
Multiple pages began sharing common UI patterns such as loading, errors, page headers and dialogs.

## Decision
Create a shared UI layer.

```
shared/
  components/
  ui/
  utils/
```

Current reusable components include:
- PageHeader
- StatCard
- LoadingSpinner
- ErrorState
- EmptyState
- ConfirmDialog

## Rationale
- Consistent user experience
- Reduced duplication
- Faster feature development

## Alternatives Considered
- Duplicate UI inside each feature
- Premature design system

## Consequences
Future features can focus on business logic while reusing established UI patterns.
