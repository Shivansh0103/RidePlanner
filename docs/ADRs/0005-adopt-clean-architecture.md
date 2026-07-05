# ADR-0005: Adopt Clean Architecture

**Status:** Accepted

**Depends on:**

* ADR-0002 – Adopt a Modular Monolith Architecture
* ADR-0003 – Standardize on the .NET Platform for Backend Development

**Influences:**

* ADR-0006 – Standardize on Entity Framework Core
* ADR-0007 – REST API First
* ADR-0010 – Testing Strategy
* ADR-0012 – Authentication & Authorization
* ADR-0015 – Background Processing

---

## Context

Ride Planner is expected to evolve into a long-lived application with increasing business complexity.

As new features are added, the codebase should remain:

* Easy to understand
* Easy to test
* Easy to maintain
* Independent of infrastructure technologies
* Adaptable to future architectural evolution

Without clear dependency rules, business logic gradually becomes scattered across controllers, repositories, and framework-specific code. This leads to tight coupling, reduced testability, and increased maintenance costs.

An architectural approach is required to preserve clear separation of concerns as the application grows.

---

## Decision Criteria

The application's internal architecture should satisfy the following principles:

### Separation of Concerns

Business rules should remain separate from infrastructure and presentation concerns.

### Testability

Core business logic should be testable without requiring databases, web servers, or external services.

### Maintainability

Changes to infrastructure should have minimal impact on business logic.

### Framework Independence

Business rules should not depend directly on web frameworks, ORMs, or cloud providers.

### Long-Term Evolution

The architecture should support future growth without requiring major restructuring.

---

## Decision

Each business module within the Modular Monolith will follow the principles of **Clean Architecture**.

Each module will be organized into logical layers with clearly defined responsibilities and dependency rules.

A typical module structure will resemble:

```text
Trip

├── API
├── Application
├── Domain
└── Infrastructure
```

The exact project structure may evolve, but the dependency rules defined by this ADR must remain consistent.

---

## Rationale

### Business Logic Should Be Independent

Business rules represent the core value of the application.

Examples include:

* A trip must have an origin.
* A ride cannot end before it starts.
* Expense amounts cannot be negative.

These rules should remain valid regardless of:

* Database technology
* Cloud provider
* Web framework
* API protocol

Business rules should therefore remain independent of technical implementation details.

---

### Clear Separation of Responsibilities

Each architectural layer has a distinct responsibility.

#### API

Responsible for:

* HTTP endpoints
* Request/response models
* Authentication
* Validation
* Routing

The API layer should not contain business logic.

---

#### Application

Responsible for:

* Coordinating use cases
* Executing application workflows
* Invoking domain behavior
* Managing interactions between components

This layer defines **what** the application should do.

---

#### Domain

The heart of the application.

Responsible for:

* Entities
* Value Objects
* Business Rules
* Domain Services
* Domain Events

The Domain layer should have no knowledge of databases, web frameworks, or external services.

---

#### Infrastructure

Responsible for technical implementation details including:

* Database access
* Entity Framework Core
* File storage
* Email providers
* External APIs
* Caching
* Cloud services

Infrastructure defines **how** technical work is performed.

---

### Dependency Rule

Dependencies must always point toward the core business logic.

Business rules must never depend directly on infrastructure technologies.

This ensures that infrastructure can evolve without requiring changes to the Domain layer.

---

### Technology Independence

Infrastructure technologies are implementation details.

Examples include:

* PostgreSQL
* Redis
* AWS
* Azure
* S3
* SMTP
* External APIs

These technologies may change over time.

Business rules should remain unaffected by such changes.

---

## What Clean Architecture Does Not Mean

Adopting Clean Architecture does **not** require:

* A specific folder structure
* The Repository pattern
* CQRS
* MediatR
* Entity Framework Core
* Any particular dependency injection framework

Clean Architecture defines dependency direction and separation of responsibilities, not implementation details.

Future ADRs will address specific architectural patterns and technologies independently.

---

## Consequences

### Positive

* Clear separation of responsibilities.
* Highly testable business logic.
* Reduced coupling between application layers.
* Easier maintenance.
* Infrastructure technologies remain replaceable.
* Improved long-term maintainability.
* Supports future architectural evolution.

### Negative

* Increased number of classes and projects.
* Higher learning curve for new developers.
* Additional architectural discipline is required.

These trade-offs are considered acceptable for a long-lived production application.

---

## Alternatives Considered

### Traditional Layered Architecture

**Advantages**

* Familiar to most developers.
* Simple initial implementation.
* Suitable for smaller applications.

**Reasons Not Selected**

Business logic often becomes distributed across controllers, services, repositories, and infrastructure code as the application grows.

This increases coupling and reduces maintainability.

---

### Controller-Centric Architecture

**Advantages**

* Very rapid initial development.
* Minimal project structure.

**Reasons Not Selected**

Business logic becomes tightly coupled to the presentation layer, making testing, maintenance, and future evolution significantly more difficult.

---

## Future Evolution

Clean Architecture establishes dependency rules rather than prescribing specific implementation patterns.

As Ride Planner evolves, additional architectural patterns may be introduced, including:

* CQRS
* Domain Events
* Background Processing
* Event-Driven Communication
* Message Brokers

These additions should complement the architectural principles established by this ADR rather than replace them.

---

## Architect's Notes

Clean Architecture is fundamentally about protecting the application's business rules from changes in technology.

Frameworks, databases, cloud providers, and external services should support the business—not define it.

The value of the application lies in its domain knowledge. Technologies will evolve over time, but business rules should remain stable and portable.

The objective is not to create additional layers or abstractions for their own sake, but to establish clear boundaries that improve maintainability, testability, and long-term adaptability.
