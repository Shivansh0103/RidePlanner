# ADR-0002: Adopt a Modular Monolith Architecture

**Status:** Accepted

---

## Context

One of the earliest architectural decisions for Ride Planner is determining how the backend application should be structured.

Several architectural approaches were considered:

* Traditional Layered Monolith
* Modular Monolith
* Microservices

Ride Planner is currently:

* Developed by a single developer.
* Intended to evolve into a production-quality application.
* Designed as a long-term learning project focused on modern software engineering practices.
* Expected to grow steadily in both features and complexity.

The chosen architecture should support rapid development today while remaining maintainable and adaptable as the application evolves.

---

## Decision

Ride Planner will be implemented as a **Modular Monolith**.

The application will be deployed as a **single executable application**, while being internally organized into independent business modules.

Initial modules are expected to include:

* User
* Trip
* Ride
* Route
* Expense
* Fuel
* Media
* Notification
* Settings

Each module owns its own business logic and exposes well-defined public interfaces.

Modules must not directly depend on the internal implementation details of other modules.

---

## Rationale

### Optimized for the Current Stage

Ride Planner currently has:

* One developer
* One deployment
* One database
* No distributed system requirements
* No need for independent team ownership

Microservices would introduce significant operational complexity without solving any existing problem.

The architecture should solve today's challenges while remaining flexible enough to evolve in the future.

---

### Business-Driven Organization

The application will be organized around **business capabilities**, not technical layers.

Instead of grouping code by framework concepts such as Controllers, Services, and Repositories, functionality will be grouped by domain modules such as Trip, Expense, or Ride.

This improves discoverability and keeps related functionality together.

---

### Strong Module Boundaries

Each module is responsible for its own:

* Business rules
* Domain model
* Application logic
* Public contracts

Other modules should communicate only through those public contracts.

This promotes:

* High cohesion
* Loose coupling
* Clear ownership

---

### Simplicity Without Sacrificing Growth

Compared to a microservice architecture, a modular monolith provides:

* A single deployment pipeline
* Simpler debugging
* Lower infrastructure costs
* Easier local development
* Simpler testing
* Faster feature delivery

These benefits are especially valuable during the early stages of product development.

---

### Evolution Rather Than Premature Distribution

If individual modules eventually require independent deployment or scaling, they can be extracted into separate services with significantly less effort than refactoring a tightly coupled traditional monolith.

This architecture intentionally preserves that migration path.

---

## Guiding Principles

The following principles should guide future development.

### Business Capabilities Define Module Boundaries

Modules represent business domains rather than technical layers.

---

### Modules Own Their Functionality

Each module owns its business rules and internal implementation.

Other modules should not bypass public interfaces.

---

### Shared Code Should Be Minimized

Code should only be shared when it represents genuinely reusable functionality.

Premature creation of shared libraries should be avoided.

---

### Optimize for Simplicity

The simplest architecture that satisfies current requirements should be preferred.

Complexity should be introduced only when justified.

---

### Architecture Should Evolve

Architectural decisions should respond to real operational or business requirements rather than anticipated future scale.

---

## Consequences

### Positive

* Clear ownership of business functionality.
* High cohesion within modules.
* Reduced coupling between modules.
* Easier navigation of the codebase.
* Simpler deployment and operations.
* Easier testing.
* Lower infrastructure costs.
* Excellent foundation for future growth.

### Negative

* Requires discipline to maintain module boundaries.
* Some duplication between modules may be acceptable.
* Cross-module interactions require carefully designed interfaces.

### Risks

If modules begin accessing each other's internal implementation directly, the architecture will gradually degrade into a tightly coupled monolith.

Maintaining clear module boundaries is therefore essential.

---

## Alternatives Considered

### Traditional Layered Monolith

**Advantages**

* Simple to understand.
* Familiar to most developers.
* Fast to implement.

**Disadvantages**

* Business logic becomes scattered across technical layers.
* Difficult to navigate as the application grows.
* Increased coupling over time.

**Decision**

Rejected because it does not scale well from a maintainability perspective.

---

### Microservices

**Advantages**

* Independent deployment.
* Independent scaling.
* Strong service isolation.
* Suitable for large engineering organizations.

**Disadvantages**

* Distributed system complexity.
* Network communication overhead.
* More difficult debugging.
* Increased infrastructure and operational costs.
* Multiple deployment pipelines.

**Decision**

Rejected for the current stage of the project because the additional complexity is not justified.

---

## Future Evolution

The expected architectural evolution is:

```text
Version 1

↓

Modular Monolith

↓

Background Jobs

↓

Domain Events

↓

Asynchronous Messaging

↓

Selective Module Extraction

↓

Microservices (only when justified)
```

Microservices remain a future option, not an immediate objective.

The application should transition only when measurable technical or organizational requirements make the additional complexity worthwhile.

---

## Architect's Notes

A modular monolith is not a compromise between a monolith and microservices.

It is a deliberate architectural choice that emphasizes strong modular boundaries while preserving operational simplicity.

The primary goal is to maximize maintainability, developer productivity, and long-term adaptability.

**Architecture should reduce today's complexity while preserving tomorrow's flexibility.**
