# ADR-0008: Standardize on React Hook Form + Zod

- Status: Accepted
- Date: July 2026

## Context
Trip creation and editing required robust validation while avoiding duplicated logic.

## Decision
Use React Hook Form together with Zod for all application forms.

## Rationale
- Type-safe validation
- Reusable schemas
- Excellent performance
- Strong TypeScript integration

## Pattern
```
Schema
   ↓
Form
   ↓
Mutation
```

## Alternatives Considered
- Formik + Yup
- Manual validation

## Consequences
Future forms will reuse the same validation and submission patterns.
