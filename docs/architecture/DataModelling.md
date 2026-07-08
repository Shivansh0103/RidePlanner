# Domain Modeling Principles

## Entities

Objects with identity.

Examples:
- User
- Ride
- Vehicle

## Value Objects

Objects defined by value.

Examples:
- Email
- Coordinates
- Distance
- PhoneNumber

## Guideline

Prefer Value Objects when identity is unnecessary.
Use Entities when lifecycle and identity matter.

## Modelling Principles

- Model the business before the database.
- Prefer Value Objects when identity is unnecessary.
- Generate entity identifiers in the application.
- Keep domain entities valid by design.

## Domain Evolution

The project intentionally starts with a simple technical folder structure.

Aggregate-based organization will be introduced only when domain complexity justifies it.

Reason:

Avoid premature abstraction.

Follow YAGNI.