# 15. Use ASP.NET Core Identity for Application Identity

* Status: Approved
* Date: September 2026

## Context

RidePlanner transitioned from an anonymous planning prototype to an authenticated multi-user application in Sprint 13.

The application required secure user authentication, password hashing, account lifecycle management, claims management, and future external sign-in extensibility. Building these security primitives by hand is error-prone, vulnerable to subtle cryptographic and authentication flaws, and adds maintenance overhead.

## Decision

We decided to adopt **ASP.NET Core Identity** for identity and credential management:

1. **Layer Separation (Clean Architecture)**:
   - `ApplicationUser : IdentityUser<Guid>` resides strictly within the `RidePlanner.Infrastructure` project.
   - ASP.NET Core Identity framework dependencies and types are strictly forbidden from leaking into the `RidePlanner.Domain` or `RidePlanner.Application` layers.
   - Application use cases interact with identity exclusively through application abstractions (e.g., `IIdentityService`, `ICurrentUserService`).

2. **Decoupled User Profile Entity**:
   - Application-specific rider preferences and travel settings are modeled in an encapsulated `UserProfile` domain entity (`RidePlanner.Domain.Entities.UserProfile`).
   - A strict 1:1 relationship is established between `ApplicationUser` and `UserProfile` using `UserId` as both primary key and foreign key with cascade deletion.
   - Creation of `ApplicationUser` and `UserProfile` is atomic within a database transaction during registration.

## Consequences

### Positive

- **Battle-Tested Security**: Uses ASP.NET Core Identity's reviewed password hashing (PBKDF2/HMAC-SHA512), security stamp invalidation, lockout mechanisms, and normalized username/email indexes.
- **Architecture Purity**: The Domain layer remains pure C# POCOs without any dependency on Microsoft Identity or EF Core packages.
- **Extensibility**: Provides direct integration points for OAuth/OIDC external logins (Google, Apple, GitHub) in subsequent milestones.

### Negative

- Introduces ASP.NET Core Identity database tables (`AspNetUsers`, `AspNetUserRoles`, `AspNetUserClaims`, etc.) and EF Core IdentityDbContext conventions into the database schema.
