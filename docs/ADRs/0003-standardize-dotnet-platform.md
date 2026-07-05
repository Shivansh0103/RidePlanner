# ADR-0003: Standardize on the .NET Platform for Backend Development

**Status:** Accepted

**Depends on:** ADR-0002 – Adopt a Modular Monolith Architecture

**Influences:**

* ADR-0004 – Select PostgreSQL as the Primary Database
* ADR-0005 – Adopt Clean Architecture
* ADR-0006 – Standardize on Entity Framework Core
* ADR-0008 – Adopt REST API First
* ADR-0012 – Authentication & Authorization Strategy

---

## Context

Ride Planner requires a modern backend platform capable of supporting:

* RESTful APIs
* Authentication and Authorization
* Domain-driven business logic
* Database integration
* Background processing
* Cloud-native deployment
* Automated testing
* Observability
* Long-term maintainability

The backend platform will serve as the foundation for the application throughout its lifecycle. Since Ride Planner is both a production-quality application and a long-term learning project, the chosen platform should balance engineering best practices, ecosystem maturity, developer productivity, and long-term sustainability.

Several mature backend platforms were evaluated, including:

* .NET
* Spring Boot
* Node.js (Express/NestJS)
* Go
* Django

---

## Decision Criteria

The backend platform was evaluated against the following criteria.

### Maintainability

The platform should encourage clean separation of concerns and support well-established architectural patterns.

### Ecosystem Maturity

Libraries for common engineering problems should be stable, well-maintained, and production-ready.

### Performance

The platform should provide strong runtime performance without requiring unnecessary architectural complexity.

### Cloud Readiness

Deployment to containers and major cloud providers should be straightforward.

### Tooling

The ecosystem should provide excellent support for debugging, testing, package management, profiling, and developer productivity.

### Long-Term Support

The platform should provide predictable release cycles and Long-Term Support (LTS) versions suitable for production systems.

### Learning Value

Since Ride Planner is also intended as a learning platform, the selected technology should expose modern backend engineering concepts commonly used in enterprise software development.

---

## Decision

Ride Planner will standardize on the **.NET platform** for backend development.

The backend will be implemented using:

* ASP.NET Core
* Entity Framework Core
* Microsoft.Extensions.* libraries
* Built-in Dependency Injection
* Current .NET Long-Term Support (LTS) release

Framework-specific implementation details should leverage the capabilities provided by the .NET ecosystem while maintaining clean architectural boundaries defined by the application's architecture.

---

## Rationale

### Cohesive Platform

The .NET platform provides many foundational capabilities as part of the framework itself, including:

* Dependency Injection
* Configuration Management
* Logging
* Middleware Pipeline
* Authentication
* Authorization
* Background Services
* Health Checks

This reduces reliance on unrelated third-party packages and promotes consistency throughout the application.

---

### Strong Architectural Support

The .NET ecosystem naturally supports architectural patterns that align with Ride Planner's design goals, including:

* Clean Architecture
* Modular Monoliths
* Domain-Driven Design
* CQRS
* Vertical Slice Architecture

The framework provides infrastructure while allowing the application's architecture to remain independent of framework-specific concerns.

---

### Mature Ecosystem

NuGet provides mature libraries for all anticipated project requirements, including:

* PostgreSQL
* Redis
* AWS SDK
* OpenTelemetry
* Serilog
* Background Job Processing
* Authentication Providers
* Messaging Systems

The platform comfortably supports both current and anticipated future requirements.

---

### Excellent Developer Tooling

The .NET ecosystem offers a mature development experience through:

* Visual Studio
* Visual Studio Code
* JetBrains Rider
* Strong debugging capabilities
* Profiling and diagnostics
* Comprehensive testing frameworks
* Reliable package management

Developer productivity is an important consideration for a long-term project.

---

### Cloud-Native Capabilities

The platform integrates naturally with modern cloud-native practices including:

* Docker
* Kubernetes
* AWS
* Azure
* Google Cloud Platform

This aligns with Ride Planner's long-term deployment and DevOps strategy.

---

### Performance

Modern ASP.NET Core consistently delivers excellent runtime performance.

Although performance is not the primary reason for selecting the platform, it provides confidence that the backend will comfortably support anticipated application growth.

---

## Consequences

### Positive

* Cohesive and consistent development platform.
* Excellent tooling and debugging experience.
* Strong support for modern architectural patterns.
* Mature ecosystem with production-ready libraries.
* Excellent testing capabilities.
* Straightforward cloud deployment.
* Long-Term Support releases provide platform stability.

### Negative

* Smaller ecosystem than Java.
* Smaller package repository than npm.
* Some emerging libraries may appear later than in JavaScript ecosystems.

These limitations are not expected to impact the requirements of Ride Planner.

---

## Alternatives Considered

### Spring Boot

**Advantages**

* Large enterprise ecosystem.
* Mature framework.
* Excellent cloud support.
* Strong community adoption.

**Reasons Not Selected**

* Does not provide significant architectural advantages over the .NET platform for this project.
* Switching ecosystems would increase development effort without providing proportional benefits.
* Project requirements are fully satisfied by the .NET ecosystem.

---

### Node.js (Express / NestJS)

**Advantages**

* Massive package ecosystem.
* Rapid development.
* Strong JavaScript ecosystem.

**Reasons Not Selected**

* Greater reliance on third-party packages for foundational capabilities.
* Package quality varies considerably.
* Less cohesive platform compared to .NET.

---

### Go

**Advantages**

* Excellent runtime performance.
* Simple language.
* Strong concurrency model.

**Reasons Not Selected**

* Smaller ecosystem for enterprise business applications.
* Less aligned with the project's architectural learning objectives.

---

### Django

**Advantages**

* Rapid application development.
* Comprehensive framework.

**Reasons Not Selected**

* Better suited to Python-centric ecosystems.
* Less aligned with the project's long-term technology direction.

---

## Future Evolution

Ride Planner will target the current .NET Long-Term Support (LTS) release.

Framework upgrades should be performed incrementally during regular maintenance.

Replacing the backend platform would represent a major architectural change and must be documented through a new Architecture Decision Record that includes the business justification, migration strategy, risks, and expected impact.

---

## Architect's Notes

Technology choices should be driven by project requirements rather than industry trends or popularity.

A backend platform should provide a stable and maintainable foundation that enables engineers to focus on solving business problems instead of overcoming framework limitations.

The long-term success of Ride Planner will depend more on sound architecture, maintainability, testing, observability, and engineering discipline than on the choice of any individual technology.
