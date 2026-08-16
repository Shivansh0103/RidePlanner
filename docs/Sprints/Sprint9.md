# Sprint 9 – Trip Readiness, Completion & Memories

**Goal:** Evolve RidePlanner from a trip planning application into a complete trip lifecycle experience by helping riders prepare for departure, keep critical trip information accessible, complete their journey, and preserve a useful trip summary.

**Status:** Complete & Verified  
**Sprint:** 9  

**Theme:** Trip Readiness, Completion & Memories

---

# Sprint Overview

Sprint 8 completed the financial loop introduced in Sprint 6 and extended through Sprint 7:

- Budget planning
- Accommodation cost planning
- Actual expense tracking
- Budget vs Actual analysis

RidePlanner can now answer:

> **What am I planning to spend, and what have I actually spent?**

The next major gap is the transition from **planning** to **travel readiness, travel, and trip completion**.

A rider should be able to prepare for departure with confidence, access important information during the journey, and eventually close the trip with a useful summary and personal memories.

Sprint 9 therefore focuses on the next stage of the Core Experience:

```text
Plan
  ↓
Prepare
  ↓
Travel
  ↓
Complete
  ↓
Remember
```

The goal is not to introduce another isolated feature.

Instead, Sprint 9 connects several existing capabilities into a coherent trip lifecycle.

---

# Architecture Review Status

The Sprint 9 architecture review has been completed before implementation.

The decisions below are the **approved architecture baseline** for Sprint 9.

Antigravity must inspect the current repository and validate these decisions against the actual Sprint 8 codebase before implementation. The repository has **not** been modified to implement these decisions yet.

If the current code conflicts with any decision below, Antigravity should report the conflict and recommend the cleanest implementation approach before making changes.

---

# Approved Architecture Decisions

## AD-1 – Trip Lifecycle

The persisted trip lifecycle is intentionally simple:

```text
Planning
   ↓
Active
   ↓
Completed
```

### Persisted status

Use only:

- `Planning`
- `Active`
- `Completed`

Do **not** introduce persisted:

- `Ready`
- `Archived`

### Why

`Ready` is derived preparation state, not a lifecycle fact.

`Archived` is deferred until there is an actual product requirement for archival/visibility management.

### Planned dates vs actual lifecycle

Existing planned trip dates remain:

```text
StartDate
EndDate
```

These represent what the user planned.

Actual lifecycle timestamps are separate:

```text
StartedAt?
CompletedAt?
```

These represent known actual lifecycle events.

Both actual timestamps are nullable.

### Automatic activation

A trip in `Planning` should automatically become `Active` when:

```text
StartDate <= current application date
AND Status == Planning
```

Automatic activation must not pretend to know the exact actual start time.

Therefore automatic activation may result in:

```text
Status = Active
StartedAt = null
```

### Manual early activation

A user can explicitly start a trip before the planned `StartDate`.

This should result in:

```text
Status = Active
StartedAt = current timestamp
```

### Completion

Completion is explicit.

```text
Active
   ↓
Complete Trip
   ↓
Completed
CompletedAt = current timestamp
```

Passing `EndDate` must **not** automatically complete a trip.

### Completed trips

Completed trips:

- Never automatically reactivate.
- Do not have a Sprint 9 "Reopen Trip" workflow.
- Remain editable in their underlying planning/financial/supporting data.
- Keep `StartedAt` and `CompletedAt` as historical lifecycle information.

### Date changes

Changing planned dates does not rewrite historical lifecycle timestamps.

For example:

```text
Planned Start: June 20
Actual Start:  June 18
```

Changing the planned start later must not erase or rewrite the actual start.

### Overlapping trips

Overlapping trips are allowed.

RidePlanner should not assume that a user can only have one active trip.

### Lifecycle transition table

| Current Status | Trigger | Result |
|---|---|---|
| Planning | Start date arrives | Active |
| Planning | User starts early | Active |
| Planning | Planned dates edited | Planning |
| Active | User completes trip | Completed |
| Active | End date passes | Active |
| Active | Planned dates edited | Active |
| Completed | Underlying data edited | Completed |
| Completed | Planned dates changed | Completed |
| Completed | Any automatic date processing | Completed |

No backwards lifecycle transitions are required for Sprint 9.

### Lifecycle synchronization

Automatic activation must be implemented in a centralized backend/application/domain boundary rather than duplicated across individual queries or frontend components.

The exact implementation location must be determined from the current repository architecture.

---

# AD-2 – Trip Readiness

Readiness is a **derived aggregate** of existing trip state.

Do not persist:

```text
Trip.ReadinessPercentage
Trip.IsReady
```

### Readiness philosophy

Readiness should tell the user:

> **Are the important parts of this trip prepared?**

It should be transparent and actionable rather than an arbitrary weighted score.

### Readiness states

Each readiness category can be represented as:

- Complete
- Incomplete
- Not Applicable
- Optional / Not Configured

### Blocking categories

Only these categories can make the trip "Needs Attention":

1. Required checklist items
2. Required documents
3. Journey plan

### Conditional category

- Accommodation

### Informational categories

- Emergency contacts
- Budget

### Overall readiness

If all applicable blocking categories are complete:

```text
READY
```

Otherwise:

```text
NEEDS ATTENTION
```

A percentage may be displayed as a presentation convenience, but it must be derived and must not be persisted.

The percentage must never become the source of truth.

---

# AD-3 – Checklist Required / Optional

Existing checklist items should gain a required/optional distinction.

Conceptually:

```text
ChecklistItem
├── ...
├── IsRequired
└── Completed
```

### Rules

- New checklist items should default to **Required**.
- Users can explicitly mark an item as Optional.
- Only required incomplete items block readiness.
- Optional incomplete items do not block readiness.

Example:

```text
Preparation Checklist

✓ Check tyre pressure       Required
✓ Carry spare tubes         Required
○ Clean bike                Optional
○ Take camera               Optional
```

Readiness:

```text
Required: 2
Completed: 2
Optional incomplete: 2

Checklist = Complete
```

This change should extend the existing Checklist feature rather than create a Sprint 9-specific checklist system.

---

# AD-4 – Travel Documents

Introduce a lightweight trip-specific document registry.

The application stores document metadata only.

## Entity

Conceptually:

```text
TripDocument
├── Id
├── TripId
├── DocumentType
├── Name
├── DocumentNumber?
├── ExpiryDate?
├── IsRequired
├── Notes?
├── CreatedAt
└── UpdatedAt
```

The exact implementation must follow existing RidePlanner domain conventions.

## Document type

Prefer a structured representation following existing project conventions.

Suggested types:

- Driving Licence
- Vehicle RC
- Insurance
- PUC
- Permit
- Booking Confirmation
- ID Proof
- Other

`Name` remains available for user-specific context.

Example:

```text
DocumentType: Other
Name: Rohtang Permit
```

## Required / optional

Documents support:

```text
IsRequired
```

New documents should default to Required.

Only required documents affect readiness.

Optional documents may still be displayed and validated, but they do not block readiness.

## Expiry

`ExpiryDate` is optional.

A document with no expiry date is considered valid for Sprint 9 because the system has no basis to mark it invalid.

Expiry status is derived:

```text
No expiry date
    → Valid

More than 30 days remaining
    → Valid

30 days or fewer remaining
    → Expiring Soon

Past expiry date
    → Expired
```

The 30-day threshold should be centralized rather than duplicated throughout the application.

## Readiness interaction

Required documents:

```text
Valid
    → Satisfy readiness

Expiring Soon
    → Satisfy readiness + warning

Expired
    → Do not satisfy readiness
```

Optional expired documents do not block readiness.

## Explicit boundary

Sprint 9 does **not** include:

- PDF uploads
- Image uploads
- Cloud document storage
- OCR
- Document scanning
- Automatic extraction

This is a metadata registry only.

## Ownership

Documents belong to a specific Trip.

There is no global document library in Sprint 9.

---

# AD-5 – Emergency Contacts

Introduce trip-specific emergency/support contacts.

## Entity

Conceptually:

```text
EmergencyContact
├── Id
├── TripId
├── Name
├── ContactType
├── PhoneNumber
├── Notes?
├── IsPrimary
├── CreatedAt
└── UpdatedAt
```

## Contact types

Suggested structured types:

- Family
- Emergency Services
- Roadside Assistance
- Insurance
- Accommodation
- Medical
- Other

The exact representation should follow existing RidePlanner conventions.

## Rules

- Contacts belong to a specific Trip.
- `Name` is required.
- `PhoneNumber` is required.
- International phone numbers should be supported.
- Validation should reject obviously invalid input without enforcing a single-country 10-digit format.
- At most one contact can be primary per Trip.
- Marking a contact primary should clear the primary flag from any existing primary contact.
- Deleting the primary contact leaves the trip without a primary contact.
- The application should not automatically create emergency-service contacts.
- No global address book is required.

## Readiness

Emergency contacts are **informational only**.

No emergency contact does not block readiness.

Example:

```text
Emergency Contacts
⚠ No primary contact added
Optional
```

---

# AD-6 – Journey Plan Readiness

Journey Plan is complete when the trip has a meaningful existing travel plan.

For Sprint 9:

```text
Existing Route exists
OR
Meaningful TripStop / itinerary data exists
```

Therefore users do not need to configure both a Route and an Itinerary/Stops plan.

### Important principles

- Reuse existing Route and TripStop data.
- Do not add `HasRoute`, `HasItinerary`, or `IsJourneyPlanned` persisted fields merely for readiness.
- Do not duplicate route/stop information.
- The exact definition of "meaningful" must follow the existing domain model.

Journey Plan is a blocking readiness category.

---

# AD-7 – Accommodation Readiness

Accommodation is conditional/informational.

### Rules

If no accommodation records exist:

```text
Accommodation
○ Not configured / Not applicable
```

This does not block readiness.

If accommodation records exist:

```text
Accommodation
✓ 4 stays planned
```

The system should not attempt to validate complete overnight coverage in Sprint 9.

Do not introduce:

```text
Trip.AccommodationRequired
```

just for readiness.

Do not build a new accommodation coverage engine.

Existing Accommodation data remains the source of truth.

---

# AD-8 – Budget Readiness

Budget is informational.

A trip can be ready without a configured budget.

For example:

```text
Budget
○ Not configured
Optional
```

Budget should not block readiness.

Existing Budget functionality remains the source of truth.

---

# AD-9 – Trip Summary

Completed trips should expose a useful derived summary.

The summary is a **read model**, not a persisted snapshot.

## Summary should reuse existing data

Conceptually:

```text
TripSummary
├── Trip
│   ├── Name
│   ├── StartDate
│   ├── EndDate
│   ├── StartedAt
│   └── CompletedAt
│
├── Journey
│   ├── StopCount
│   ├── Distance?
│   └── DrivingDuration?
│
├── Accommodation
│   └── StayCount
│
├── Financial
│   ├── PlannedBudget?
│   ├── ActualSpend
│   └── Variance?
│
└── Preparation
    ├── RequiredItemCount
    └── CompletedRequiredItemCount
```

The exact DTO must be determined after inspecting the current application.

## No duplicate persisted statistics

Do not add:

```text
Trip.TotalDistance
Trip.TotalSpend
Trip.NumberOfStops
Trip.DrivingDuration
Trip.BudgetVariance
Trip.ChecklistCompletionPercentage
```

solely for the summary.

## Existing calculations

Budget/actual calculations should reuse Sprint 8 functionality.

Checklist calculations should reuse the existing checklist state.

Route/distance/duration should only be included if reliable existing data supports them.

Do not introduce a new routing engine in Sprint 9.

## Summary experience

The full Trip Summary experience is primarily surfaced after completion.

However, the backend query should remain a read model and should not require a persisted snapshot.

## Memories remain separate

Summary answers:

> What happened quantitatively?

Memories answer:

> What do I personally remember?

They should not be merged into one persisted summary object.

---

# AD-10 – Trip Memories

Introduce lightweight personal memories.

## Entity

Conceptually:

```text
TripMemory
├── Id
├── TripId
├── Title?
├── Content
├── CreatedAt
└── UpdatedAt
```

## Rules

- Memories belong directly to a Trip.
- Memories can be created during Planning, Active, or Completed.
- They become especially prominent after completion.
- Content is required.
- Title is optional.
- Plain text is sufficient.
- Newest memories should appear first.
- CRUD operations are required.
- Hard delete is acceptable for Sprint 9.

## Explicit boundary

Do not build:

- Photo albums
- Image storage
- Media processing
- Public sharing
- Social feeds
- Likes/comments
- Public profiles
- AI-generated memories

---

# AD-11 – Completed Trip Editing

Completing a trip means:

> **The journey is finished.**

It does not mean:

> **The trip record is frozen.**

Completed trips remain editable in their underlying data.

### Editable after completion

- Trip name
- Description
- Planned dates
- Stops
- Route
- Accommodation
- Budget
- Expenses
- Checklist
- Documents
- Emergency contacts
- Memories

### Not casually editable

- Lifecycle status
- `StartedAt`
- `CompletedAt`

No "Reopen Trip" workflow is required in Sprint 9.

### Historical principle

If a completed trip's expense or other supporting data is corrected later, the derived summary should reflect the corrected data.

Do not create a completion snapshot that becomes stale.

---

# Why This Sprint?

RidePlanner already provides:

- Trip creation and management
- Itinerary/stops
- Route planning
- Maps
- Preparation checklists
- Budget planning
- Accommodation
- Expense tracking
- Budget vs Actual

Sprint 9 closes the lifecycle gap:

```text
Plan
  ↓
Prepare
  ↓
Travel
  ↓
Complete
  ↓
Remember
```

The sprint should make the application feel like a complete trip lifecycle companion rather than a collection of independent planning tools.

---

# Features

## 1. Travel Documents

Users can:

- Add a document.
- Edit a document.
- Delete a document.
- Mark it Required/Optional.
- Store document number where applicable.
- Store expiry where applicable.
- See valid/expiring/expired state.
- See readiness impact for required documents.

No document files are stored.

---

## 2. Emergency Contacts

Users can:

- Add a contact.
- Edit a contact.
- Delete a contact.
- Mark one contact as primary.
- Quickly access/call a phone number.

Contacts are trip-specific.

---

## 3. Trip Readiness

Users can see:

```text
Trip Readiness

✓ Required Checklist       18 / 18
✓ Required Documents       4 / 4 valid
✓ Journey Plan             Route configured
✓ Accommodation            3 stays planned
⚠ Emergency Contacts       No primary contact
○ Budget                    Not configured

────────────────────────────

🟢 READY FOR TRAVEL
```

Or:

```text
Trip Readiness

⚠ Required Checklist       16 / 18
✓ Required Documents       4 / 4 valid
✓ Journey Plan             Route configured
○ Accommodation            Not applicable
⚠ Emergency Contacts       No primary contact
✓ Budget                   Configured

────────────────────────────

🟡 NEEDS ATTENTION

2 required preparation items incomplete
```

The UI should make incomplete blocking categories directly actionable.

---

## 4. Trip Lifecycle

Users can:

- See current status.
- Start a trip early.
- Automatically transition planned trips to Active based on StartDate.
- Explicitly complete Active trips.
- View completed trips separately.

No complex workflow engine.

---

## 5. Trip Completion

When a journey finishes:

```text
Active
  ↓
Complete Trip
  ↓
Completed
```

The underlying trip data remains available.

Completion should lead naturally into the Trip Summary experience.

---

## 6. Trip Summary

Potential display:

```text
Ladakh 2026

15 Jun → 22 Jun
8 days · 7 nights

────────────────────────────

📍 14 Stops
🛣️ 2,350 km
⏱️ 42 hrs driving
🏨 6 Accommodations
💰 ₹47,850 Actual Spend
🎯 ₹50,000 Planned Budget

────────────────────────────

Budget
₹47,850 / ₹50,000
₹2,150 under budget

────────────────────────────

Route
Delhi → Manali → Sarchu → Leh
       → Nubra → Pangong → Leh

────────────────────────────

Preparation
18 / 18 required items completed

────────────────────────────

[ Add a Memory ]
```

Metrics should only be shown when supported by reliable existing data.

---

## 7. Trip Memories

Example:

```text
Trip Memories

⭐ More Plains Snowstorm

We unexpectedly got caught in heavy snow
and had to slow down considerably.

────────────────────────

🏕️ Sarchu

Camping at Sarchu was one of the highlights
of the entire trip.
```

---

# Milestones

## Milestone 1 – Repository Review & Implementation Mapping

Before implementation, Antigravity must inspect the current repository.

The current repository represents the **Sprint 8 implementation state**. None of the Sprint 9 architecture decisions above should be assumed to already exist in code.

### Antigravity review must determine:

1. Current `Trip` entity and status/date representation.
2. Existing Trip commands, queries, DTOs, mappings and tests.
3. Best location for lifecycle synchronization.
4. Existing Checklist model and where `IsRequired` should be added.
5. Existing Route/TripStop/Itinerary capabilities that readiness can reuse.
6. Existing Accommodation capabilities that readiness can reuse.
7. Existing Budget/Expense calculations that Summary can reuse.
8. Best domain/application boundary for `TripDocument`.
9. Best domain/application boundary for `EmergencyContact`.
10. Best location for derived `TripReadiness`.
11. Best location for derived `TripSummary`.
12. Best domain/application boundary for `TripMemory`.
13. Existing frontend Trip Details architecture.
14. Required database relationships/migrations.
15. Existing tests to extend.
16. New tests required.
17. Any conflict between the approved architecture and current code.

### Review-only rule

Antigravity must **not modify or implement code during this milestone**.

It should return:

- Current architecture findings.
- Recommended implementation mapping.
- Files/classes/features to modify.
- New files/entities/features required.
- Database/migration impact.
- API impact.
- Frontend impact.
- Testing impact.
- Architecture conflicts/concerns.
- Recommended implementation order.

Implementation begins only after this review is accepted.

---

# Milestone 2 – Trip Lifecycle Backend

Implement the approved lifecycle model.

### Scope

- Trip status representation.
- `StartedAt?`.
- `CompletedAt?`.
- Lifecycle transition rules.
- Automatic activation.
- Manual early activation.
- Explicit completion.
- Centralized lifecycle synchronization.
- Completed-trip filtering.
- Validation.
- CQRS/API integration.
- Tests.
- Database migration if required.

### Important

Do not automatically complete trips when `EndDate` passes.

Do not automatically reactivate completed trips.

---

# Milestone 3 – Checklist Required/Optional

Extend the existing Checklist feature.

### Scope

- Add Required/Optional state.
- Default new items to Required.
- Update domain model.
- EF configuration/migration if required.
- Commands/queries/DTOs/mapping.
- Validation.
- Frontend form/display.
- Readiness integration.
- Tests.

---

# Milestone 4 – Travel Documents Backend

Implement the approved document registry.

### Scope

- Domain model.
- EF Core configuration.
- PostgreSQL migration.
- CQRS commands/queries.
- DTOs.
- Mapping.
- Validation.
- API endpoints.
- Dependency injection.
- Tests.

### Requirements

- Trip-specific.
- Required/Optional.
- Optional expiry.
- Derived expiry status.
- No file storage.
- Correct trip deletion behavior.

---

# Milestone 5 – Emergency Contacts Backend

Implement trip-specific contacts.

### Scope

- Domain model.
- EF configuration.
- Migration.
- CQRS commands/queries.
- DTOs.
- Validation.
- API endpoints.
- Primary-contact invariant.
- Tests.

---

# Milestone 6 – Trip Readiness

Implement the derived readiness query.

### Categories

```text
Required Checklist
Required Documents
Journey Plan
Accommodation
Emergency Contacts
Budget
```

### Blocking

Only:

```text
Required Checklist
Required Documents
Journey Plan
```

block readiness.

### Derived only

Do not persist:

```text
IsReady
ReadinessPercentage
```

The backend should return transparent category results so the frontend does not reimplement business logic.

---

# Milestone 7 – Trip Completion & Summary

Implement:

- Complete Trip action.
- Completed-trip filtering.
- Trip Summary query.
- Reuse existing calculations.
- Summary frontend experience.
- Navigation to existing detailed features.

No summary snapshot table.

No duplicate statistics on Trip.

---

# Milestone 8 – Memories

Implement:

- Memory entity.
- EF configuration/migration.
- CRUD commands/queries.
- DTOs/mapping.
- Validation.
- API endpoints.
- Frontend list/form/actions.
- Tests.

Memories remain available on completed trips.

---

# Milestone 9 – Frontend Integration

Extend the existing Trip Details experience rather than creating a separate application area.

Potential structure:

```text
Trip Details
│
├── Overview
│     ├── Trip Summary
│     └── Readiness
│
├── Itinerary
│
├── Budget & Costs
│
├── Accommodation
│
├── Checklist
│
├── Documents
│
├── Emergency Contacts
│
└── Memories
```

The exact navigation must follow the current UI after inspection.

### Documents UI

- Document list.
- Add/edit dialog.
- Required/optional indicator.
- Expiry indicators.
- Expired/expiring states.
- Empty state.

### Emergency Contacts UI

- Contact list.
- Add/edit dialog.
- Call-friendly phone display.
- Primary contact indication.
- Empty state.

### Readiness UI

- Overall readiness state.
- Category states.
- Blocking vs informational distinction.
- Direct actions to incomplete areas.

### Lifecycle UI

Planning:

```text
Planning
Trip starts June 20
```

Active:

```text
Active
[ Complete Trip ]
```

Completed:

```text
Completed
[ View Summary ]
```

### Completion UI

- Clear Complete Trip action.
- Confirmation where appropriate.
- Transition to completed summary.

### Memories UI

- Memory list.
- Add/edit/delete.
- Simple text editor/form.
- Empty state.
- Newest first.

---

# Milestone 10 – Integration & Polish

Verify that Sprint 9 integrates with:

```text
Trip
 ├── Itinerary
 ├── Route
 ├── Budget
 ├── Expenses
 ├── Accommodation
 ├── Checklist
 ├── Documents
 ├── Contacts
 ├── Memories
 └── Lifecycle
```

Existing functionality must continue working without regressions.

Perform a focused UI polish pass after functional implementation is complete.

---

# API Direction

The exact endpoints must follow current RidePlanner conventions after repository inspection.

Conceptually:

```text
Documents

GET    /api/trips/{tripId}/documents
POST   /api/trips/{tripId}/documents
PUT    /api/trips/{tripId}/documents/{documentId}
DELETE /api/trips/{tripId}/documents/{documentId}
```

```text
Emergency Contacts

GET    /api/trips/{tripId}/emergency-contacts
POST   /api/trips/{tripId}/emergency-contacts
PUT    /api/trips/{tripId}/emergency-contacts/{contactId}
DELETE /api/trips/{tripId}/emergency-contacts/{contactId}
```

```text
Readiness

GET    /api/trips/{tripId}/readiness
```

```text
Trip Lifecycle

PATCH  /api/trips/{tripId}/status
```

```text
Trip Summary

GET    /api/trips/{tripId}/summary
```

```text
Memories

GET    /api/trips/{tripId}/memories
POST   /api/trips/{tripId}/memories
PUT    /api/trips/{tripId}/memories/{memoryId}
DELETE /api/trips/{tripId}/memories/{memoryId}
```

These are directional only.

The final API contract must follow the existing application architecture.

---

# Technical Goals

Continue reinforcing the established RidePlanner architecture.

## Backend

- Clean Architecture.
- Domain-driven aggregate boundaries.
- CQRS.
- Repository abstractions only where useful.
- EF Core.
- PostgreSQL.
- Derived state instead of persisted redundancy.
- Explicit validation.
- Reusable DTO/mapping conventions.
- Centralized business rules where appropriate.

## Frontend

- Feature-based architecture.
- React Query.
- Axios API services.
- React Hook Form.
- Zod validation.
- Material UI.
- Derived presentation state.
- Reusable components.
- Consistent loading/error/empty states.
- Business logic outside React presentation components.

---

# Core Architectural Principles

## 1. Existing Features Remain the Source of Truth

Sprint 9 must not duplicate information already owned elsewhere.

```text
Checklist
    ↓
Existing checklist data

Budget
    ↓
Existing budget data

Expenses
    ↓
Existing expense data

Accommodation
    ↓
Existing accommodation data

Route / TripStops
    ↓
Existing journey planning data
```

Readiness and Summary aggregate these sources.

---

## 2. Readiness Is Derived

Never persist:

```text
Trip.ReadinessPercentage
Trip.IsReady
```

when they can be calculated from current state.

---

## 3. Lifecycle Is Different From Readiness

Lifecycle answers:

> Where is this trip in its journey?

```text
Planning → Active → Completed
```

Readiness answers:

> How prepared is this trip?

```text
Ready / Needs Attention
```

They must remain separate concepts.

---

## 4. Completion Does Not Delete Planning Data

Completing a trip preserves:

- Route
- Stops
- Accommodation
- Budget
- Expenses
- Checklist
- Documents
- Contacts
- Memories

---

## 5. Documents Are Metadata First

Sprint 9 records information about documents.

It does not store document files.

---

## 6. Memories Are Personal, Not Social

Memories belong to the trip and are intended for the trip owner.

No public/social memory platform is required.

---

## 7. Don't Persist Derived Statistics

Do not add persisted statistics solely for:

- Readiness
- Summary
- Dashboard cards

Prefer queries/read models over redundant fields.

---

# Out of Scope

The following are explicitly **not part of Sprint 9**:

- Document file uploads.
- Cloud document storage.
- OCR.
- Document scanning.
- Automatic document extraction.
- Google Drive integration.
- OneDrive integration.
- Weather integration.
- Offline trip packs.
- GPX import/export.
- Route optimization.
- AI trip assistant.
- AI trip summaries.
- Public trip sharing.
- Social profiles.
- Photo albums.
- Social feed.
- Likes/comments.
- Group expense settlement.
- Bank/card integrations.
- Payment integrations.
- Advanced travel analytics.
- Reopen Trip workflow.
- Trip archival system.
- Complex accommodation coverage engine.
- New routing engine.

These may be considered in later releases.

---

# Success Criteria

Sprint 9 is complete when:

- [ ] Approved Trip lifecycle is implemented.
- [ ] Trip supports Planning, Active, and Completed states.
- [ ] Automatic activation based on StartDate works.
- [ ] Manual early activation works.
- [ ] Explicit completion works.
- [ ] Passing EndDate does not automatically complete trips.
- [ ] Completed trips do not automatically reactivate.
- [ ] StartedAt and CompletedAt correctly represent known actual lifecycle events.
- [ ] Existing Checklist items support Required/Optional.
- [ ] New checklist items default to Required.
- [ ] Users can add, edit, and delete trip documents.
- [ ] Documents support Required/Optional.
- [ ] Document expiry information is supported.
- [ ] Expired/expiring documents are clearly identified.
- [ ] Required expired documents affect readiness.
- [ ] Optional expired documents do not block readiness.
- [ ] Users can add, edit, and delete emergency contacts.
- [ ] Emergency contacts are trip-specific.
- [ ] At most one primary contact exists per trip.
- [ ] Emergency contacts do not block readiness.
- [ ] Existing Checklist state contributes to readiness.
- [ ] Required checklist items determine checklist readiness.
- [ ] Documents contribute to readiness.
- [ ] Journey Plan contributes to readiness.
- [ ] Accommodation is surfaced as conditional/informational.
- [ ] Budget is surfaced as informational.
- [ ] Readiness is derived rather than redundantly persisted.
- [ ] Readiness clearly distinguishes blocking and informational issues.
- [ ] Users can mark a trip as completed.
- [ ] Completing a trip does not remove planning/financial/supporting data.
- [ ] Completed trips expose a useful summary.
- [ ] Summary reuses existing trip data rather than duplicating stored statistics.
- [ ] Summary does not depend on a persisted snapshot.
- [ ] Users can create, edit, and delete lightweight trip memories.
- [ ] Memories remain associated with the completed trip.
- [ ] Completed trips remain editable in underlying data.
- [ ] Lifecycle timestamps are preserved as historical information.
- [ ] Existing Budget functionality remains intact.
- [ ] Existing Expense functionality remains intact.
- [ ] Existing Accommodation functionality remains intact.
- [ ] Existing Itinerary and Route functionality remains intact.
- [ ] Existing Checklist functionality remains intact.
- [ ] Backend build succeeds.
- [ ] Frontend build/lint succeeds.
- [ ] Relevant automated tests pass.
- [ ] Final end-to-end manual verification succeeds.
- [ ] Sprint 9 documentation is updated.
- [ ] Repository README/project status reflects the completed sprint.

---

# Definition of Done

Sprint 9 is complete when RidePlanner can support the following journey:

> **Plan a trip → prepare for departure → verify readiness → travel → track the journey and spending → complete the trip → review what happened → preserve the trip as a useful historical record.**

The application should now feel less like a collection of planning tools and more like a **complete trip lifecycle companion**.

---

# Development Workflow

RidePlanner will continue using the established implementation workflow:

```text
Architecture Review
        ↓
Repository / Implementation Mapping
        ↓
Domain Design
        ↓
Backend
        ↓
Database / Migration
        ↓
API Verification
        ↓
Frontend
        ↓
Integration
        ↓
UI Polish
        ↓
Manual QA
        ↓
Build / Lint / Tests
        ↓
Documentation
        ↓
Commit
```

Sprint 9 architecture has already been reviewed conceptually.

Before implementation, Antigravity must perform the repository-specific implementation mapping against the current Sprint 8 codebase.

Implementation should begin only after that mapping is reviewed and accepted.

---

# Expected Outcome

Sprint 9 should move RidePlanner from:

> **"I have planned my trip."**

to:

> **"I am ready for my trip, I can manage it while travelling, and when it is over I can look back at the complete journey."**

The product progression becomes:

```text
Sprint 6
Trip Planning Intelligence
        ↓
Sprint 7
Accommodation & Stay Planning
        ↓
Sprint 8
Actual Expenses & Budget vs Actual
        ↓
Sprint 9
Trip Readiness, Completion & Memories
```

This completes a major portion of the initial Core Experience before RidePlanner moves into more advanced capabilities such as offline support, richer travel integrations, GPX, advanced analytics, and other post-core features.
