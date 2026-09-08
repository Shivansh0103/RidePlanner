# Data Modeling & Persistence Principles

## Database Architecture

RidePlanner uses **PostgreSQL** as its primary relational database via **Entity Framework Core**.

---

## Core Entities & Relational Mappings

### 1. `AspNetUsers` (ApplicationUser)
ASP.NET Core Identity table managing rider credentials and security lifecycle.
- `Id`: `uuid` (Primary Key)
- `Email`, `NormalizedEmail`: `varchar(256)`
- `PasswordHash`: `text`
- `SecurityStamp`: `text`
- Associated Identity tables: `AspNetUserLogins` (OAuth/OIDC external logins), `AspNetUserTokens`, `AspNetUserClaims`, `AspNetUserRoles`.

### 2. `UserProfiles`
Rider preference and default travel settings (1:1 with `AspNetUsers`).
- `UserId`: `uuid` (Primary Key, Foreign Key ➔ `AspNetUsers(Id)`, Cascade Delete)
- `PreferredCurrencyCode`: `varchar(10)` (`INR`, `USD`, `EUR`, `GBP`)
- `DistanceUnit`: `varchar(20)` (`Kilometers`, `Miles`)
- `DefaultVehicleName`: `varchar(100)` (nullable)
- `DefaultTankCapacityLitres`: `numeric(6, 2)` (nullable)
- `DefaultFuelEfficiencyKmPerLitre`: `numeric(6, 2)` (nullable)
- `CreatedAt`, `UpdatedAt`: `timestamp with time zone`

### 3. `UserRefreshTokens`
Persisted session state for rotating refresh tokens.
- `Id`: `uuid` (Primary Key)
- `UserId`: `uuid` (Foreign Key ➔ `AspNetUsers(Id)`, Cascade Delete)
- `TokenHash`: `varchar(128)` (SHA-256 hash, indexed)
- `ExpiresAt`: `timestamp with time zone`
- `RevokedAt`: `timestamp with time zone` (nullable)
- `FamilyId`: `uuid` (Session lineage tracking for reuse detection)

### 4. `Trips`
Primary table representing road trips.
- `Id`: `uuid` (Primary Key)
- `OwnerUserId`: `uuid` (Foreign Key ➔ `AspNetUsers(Id)`, Indexed, Required)
- `Name`: `varchar(100)`, required
- `Description`: `varchar(500)`
- `StartDate`: `date`, required
- `EndDate`: `date`, required
- `Status`: `integer` (`1 = Planning`, `2 = Active`, `3 = Completed`)
- `StartedAt`: `timestamp with time zone` (nullable)
- `CompletedAt`: `timestamp with time zone` (nullable)
- `CreatedAt`, `UpdatedAt`: `timestamp with time zone`

### 2. `TripStops`
Itinerary destinations and route waypoints.
- Foreign key `TripId` ➔ `Trips(Id)` (Cascade Delete)
- `DisplayOrder`: `integer` (re-indexed automatically by `ArrivalDate`)

### 3. `Accommodations`
Stay reservations.
- Foreign key `TripId` ➔ `Trips(Id)` (Cascade Delete)
- Foreign key `TripStopId` ➔ `TripStops(Id)` (Cascade Delete)

### 4. `TripBudgets`, `BudgetEstimates`, `Expenses`
Financial planning and actual transaction logs.
- `Expenses` table mapped with precision `numeric(18, 2)`
- Foreign key `TripBudgetId` ➔ `TripBudgets(Id)` (Cascade Delete)

### 5. `ChecklistCategories`, `ChecklistItems`
Preparation packing lists.
- `ChecklistItems` includes `IsRequired` (`boolean`, defaults to `true`)

### 6. `TripDocuments`
Travel document metadata.
- Foreign key `TripId` ➔ `Trips(Id)` (Cascade Delete)
- `Title`: `varchar(100)`, `Type`: `varchar(50)`, `ExpiryDate`: `timestamp with time zone`

### 7. `EmergencyContacts`
Emergency support contacts.
- Foreign key `TripId` ➔ `Trips(Id)` (Cascade Delete)
- `Name`: `varchar(100)`, `Phone`: `varchar(30)`, `IsPrimary`: `boolean`

### 8. `TripMemories`
Personal trip journal entries and photo references.
- Foreign key `TripId` ➔ `Trips(Id)` (Cascade Delete)
- `Title`: `varchar(100)`, `Content`: `text`, `OdometerReadingKm`: `integer`

---

## Derived Unpersisted Value Objects

To enforce clean architecture and prevent stale snapshot data, **no database tables or redundant columns** are persisted for:
- Readiness scores (`TripReadiness`)
- Post-ride summaries (`TripSummary`)
- Total distance / spend calculations

All derived statistics are projected on demand via CQRS read queries.