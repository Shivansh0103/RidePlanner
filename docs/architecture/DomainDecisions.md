# User

## Why is User an Entity?

Because identity is more important than current attribute values.

## Why isn't Email just a string?

Because it represents a business concept with its own validation rules.

## Why is CreatedAt immutable?

Because it records the historical creation time of the user.

## User Entity

### Invariants

- Every User has a unique identity.
- Every User has a name.
- Every User has an email.
- Every User records its creation timestamp.

### Design Decisions

- Inherits from Entity.
- Constructor is private.
- Properties expose private setters.
- Object creation will be performed through a factory method.