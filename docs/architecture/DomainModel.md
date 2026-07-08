# Initial Domain Model

## User

Represents a person using the Ride Planner platform.

Business Rules:
- Can exist without rides.
- Can create rides.
- Can participate in rides.

## Ride

Represents a planned journey.

Business Rules:
- Has exactly one owner.
- Has zero or more participants.
- Cannot exist without an owner.

## User

Represents a person interacting with the Ride Planner platform.

Business Rules

- Must always have a unique identity.
- Can exist without owning a ride.
- Can own zero or more rides.
- Can participate in zero or more rides.