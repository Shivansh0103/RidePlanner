# Data Modeling & Persistence Principles

## Database Architecture

RidePlanner uses **PostgreSQL** as its primary relational database via **Entity Framework Core**.

---

## Core Entities & Relational Mappings

### 1. `Trips`
Primary table representing road trips.
- `Id`: `uuid` (Primary Key)
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