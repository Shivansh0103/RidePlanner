# ADR-0004: Select PostgreSQL as the Primary Database

**Status:** Accepted

**Depends on:**

* ADR-0002 – Adopt a Modular Monolith Architecture
* ADR-0003 – Standardize on the .NET Platform for Backend Development

**Influences:**

* ADR-0006 – Standardize on Entity Framework Core
* ADR-0014 – Caching Strategy
* ADR-0018 – Media Storage Strategy
* ADR-0022 – Search Strategy
* ADR-0025 – Data Migration Strategy

---

## Context

Ride Planner requires a reliable primary data store for managing operational data including:

* Users
* Trips
* Routes
* Ride sessions
* Expenses
* Fuel records
* Participants
* Permissions
* Notifications
* Application settings

These entities are highly interconnected and require strong consistency, transactional integrity, and efficient querying.

The selected database should support current application requirements while providing a foundation for future growth.

Candidate databases considered include:

* PostgreSQL
* MySQL
* SQL Server
* MongoDB
* SQLite

---

## Decision Criteria

The primary database was evaluated using the following criteria.

### Data Integrity

The system should guarantee consistency for critical business operations.

### Relational Modeling

The database should naturally model interconnected entities and relationships.

### Query Capabilities

Complex filtering, reporting, aggregations, and analytical queries should be well supported.

### Performance

The database should comfortably support anticipated workloads without requiring specialized infrastructure.

### Extensibility

The platform should support future capabilities without requiring fundamental architectural changes.

### Cloud Readiness

The database should be well supported across major cloud providers and managed database services.

### Community and Ecosystem

The platform should have a mature ecosystem, excellent documentation, and broad industry adoption.

---

## Decision

Ride Planner will use **PostgreSQL** as its primary operational database and system of record.

All core business entities and transactional data will be stored in PostgreSQL.

Future specialized storage technologies (such as Redis, object storage, or search engines) will complement PostgreSQL rather than replace it.

---

## Rationale

### Natural Fit for Relational Data

Ride Planner's domain is highly relational.

Examples include:

* A user owns multiple trips.
* A trip contains multiple rides.
* A ride contains fuel stops, expenses, media, and route information.
* Participants, permissions, and notifications are linked to trips and users.

A relational database models these relationships naturally and efficiently.

---

### Strong Transactional Consistency

Business operations frequently involve multiple related updates.

Examples include:

* Creating a trip and its itinerary.
* Recording ride expenses.
* Updating trip participants.
* Completing ride sessions.

These operations should either complete successfully as a whole or be rolled back entirely.

PostgreSQL provides full ACID transaction support, making it well suited for these requirements.

---

### Rich SQL Capabilities

Ride Planner will eventually require reporting and analytical queries, including:

* Fuel expenditure summaries
* Trip statistics
* Monthly expense reports
* Distance travelled
* Ride history
* User activity metrics

PostgreSQL provides mature SQL capabilities, advanced indexing, window functions, Common Table Expressions (CTEs), and strong standards compliance, making these queries straightforward to implement.

---

### Extensibility

One of PostgreSQL's greatest strengths is its extensibility.

As Ride Planner evolves, PostgreSQL can support additional capabilities through extensions without requiring a database migration.

Notable examples include:

* PostGIS for geospatial data
* Full-text search enhancements
* Additional indexing strategies
* Vector search extensions
* Time-series extensions

This provides significant long-term flexibility.

---

### Future Geospatial Capabilities

Ride Planner is fundamentally a location-aware application.

Future features may include:

* Nearby fuel stations
* Scenic route discovery
* Spatial search
* Heat maps
* Route analysis
* Geographic reporting

PostGIS, PostgreSQL's spatial extension, provides industry-leading GIS capabilities should these features become necessary.

While these capabilities are not required for the initial release, selecting PostgreSQL preserves this option without requiring future database migration.

---

### Open Source and Cloud Native

PostgreSQL is:

* Open source
* Widely supported
* Cloud-native
* Available as a managed service across major cloud providers

This aligns with Ride Planner's long-term deployment strategy.

---

## System of Record

PostgreSQL serves as the authoritative source of business data.

Not all data must be stored within PostgreSQL.

As the application evolves, additional storage technologies may be introduced for specialized workloads.

Examples include:

| Storage Technology      | Purpose                     |
| ----------------------- | --------------------------- |
| PostgreSQL              | Transactional business data |
| Redis                   | Caching and transient data  |
| Object Storage (AWS S3) | Images and media            |
| Search Engine           | Full-text search            |
| Analytics Database      | Reporting and analytics     |

Each technology solves a specific problem while PostgreSQL remains the authoritative source of truth.

---

## Consequences

### Positive

* Excellent relational modeling.
* Strong transactional guarantees.
* Mature SQL capabilities.
* Rich indexing and query optimization.
* Excellent extensibility.
* Industry-proven reliability.
* Strong cloud support.
* Open-source licensing.

### Negative

* Schema evolution requires migration planning.
* Advanced SQL features require additional learning.
* Some operational complexity compared to lightweight embedded databases.

These trade-offs are appropriate for a long-lived production application.

---

## Alternatives Considered

### MySQL

**Advantages**

* Mature relational database.
* Large community.
* Excellent performance.
* Broad hosting support.

**Reasons Not Selected**

* PostgreSQL provides stronger extensibility.
* More comprehensive SQL feature set.
* Richer ecosystem for advanced geospatial capabilities through PostGIS.
* Better alignment with anticipated long-term analytical and mapping requirements.

MySQL remains an excellent relational database and would have been a viable choice for this project.

---

### SQL Server

**Advantages**

* Enterprise-grade platform.
* Excellent tooling.
* Strong performance.

**Reasons Not Selected**

* Greater emphasis on Microsoft-centric deployments.
* Licensing considerations for some deployment models.
* PostgreSQL provides greater flexibility for an open-source personal project.

---

### MongoDB

**Advantages**

* Flexible document model.
* Rapid schema evolution.
* Good horizontal scalability.

**Reasons Not Selected**

* Ride Planner's domain is highly relational.
* Transactional consistency is an important requirement.
* Complex relationships and reporting are more naturally expressed in a relational database.

---

### SQLite

**Advantages**

* Extremely simple deployment.
* Lightweight.
* Excellent for local development and prototyping.

**Reasons Not Selected**

* Not intended as the primary database for a production web application.
* Limited concurrency for multi-user workloads.

---

## Future Evolution

PostgreSQL will remain the primary operational database.

As the platform evolves, specialized storage technologies may be introduced where appropriate, including:

* Redis for caching
* Object storage for media
* Search engines for full-text search
* Analytics databases for reporting
* PostGIS for advanced geospatial functionality

These technologies will complement PostgreSQL rather than replace it.

---

## Architect's Notes

The primary database should model the application's domain as naturally as possible.

Technology selection should be driven by the characteristics of the data rather than by popularity or trends.

Ride Planner's domain is overwhelmingly relational, making PostgreSQL the most appropriate long-term foundation.

Choosing PostgreSQL does not exclude the future adoption of specialized data stores; it establishes a reliable and extensible system of record upon which the rest of the platform can evolve.
