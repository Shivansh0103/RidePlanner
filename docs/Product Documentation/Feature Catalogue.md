# Ride Planner - Feature Catalogue

## Introduction

The Feature Catalogue serves as the central inventory of Ride Planner's capabilities.

Features are organized into functional domains that represent the major responsibilities of the platform. This structure helps maintain a clear separation of concerns, simplifies future planning, and provides a foundation for product evolution and system architecture.

The catalogue is intentionally independent of implementation details, release timelines, and technical implementation. It describes **what** Ride Planner is capable of rather than **how** those capabilities are implemented.

As the product evolves, this document should be updated to reflect new features, changing priorities, and lessons learned throughout development.

---

## Feature Status

| Status         | Meaning                                                            |
| -------------- | ------------------------------------------------------------------ |
| 🟢 Planned     | Feature has been identified and is planned for future development. |
| 🟡 In Progress | Feature is currently under development.                            |
| 🔵 Implemented | Feature has been completed and is available.                       |
| ⚪ On Hold      | Feature is deferred for future consideration.                      |
| 🔴 Dropped     | Feature has been intentionally removed from the product direction. |

---

# Core Domains

Core domains define the primary responsibilities of Ride Planner. These capabilities represent the heart of the platform and are essential to the overall planning experience.

---

## Trip Management

Responsible for creating and managing trips.

### Features

* 🔵 Create Trip
* 🔵 Edit Trip
* 🔵 Delete Trip
* 🔵 Trip Status & Lifecycle (`Planning`, `Active`, `Completed`)
* 🔵 Actual Lifecycle Timestamps (`StartedAt`, `CompletedAt`)
* 🟢 Duplicate Trip
* 🟢 Archive Trip
* 🟢 Trip Templates
* 🟢 Favorite Trips

---

## Itinerary Management

Responsible for organizing journeys throughout their duration.

### Features

* 🔵 Multi-day itineraries
* 🔵 Daily schedules & arrival date ordering
* 🔵 Destinations & Stops management
* 🔵 Interactive Timeline view
* 🔵 Bi-directional Map ↔ Itinerary selection sync
* 🟢 Activities
* 🟢 Trip notes

---

## Route Planning

Responsible for planning and organizing travel routes.

### Features

* 🔵 Route Builder & Google Places Autocomplete
* 🔵 Waypoints & Stop Markers
* 🔵 Distance estimation
* 🔵 Duration estimation
* 🟢 Scenic routes
* 🟢 Alternative routes
* 🟢 GPX Import
* 🟢 GPX Export

---

## Budget & Expense Management

Responsible for estimating, tracking, and reviewing travel expenses.

### Features

* 🔵 Smart Fuel Cost Calculator
* 🔵 Category Planned Estimates (Fuel, Accommodation, Food, Tolls, Misc)
* 🔵 Actual Expense Log Data Table
* 🔵 Payment Method Tagging (`Cash`, `UPI`, `CreditCard`, `DebitCard`, `Other`)
* 🔵 Budget vs Actual Visual Comparison Matrix & Variance Analysis
* 🟢 Shared expenses

---

## Collaboration

Responsible for making group trip planning simple and efficient.

### Features

* 🟢 Invite travelers
* 🟢 Shared trips
* 🟢 Shared itineraries
* 🟢 Shared expenses
* 🟢 Roles & permissions

---

# Experience Domains

Experience domains enhance the travel journey before, during, and after the trip.

---

## Travel Preparation

Helping travelers prepare before departure.

### Features

* 🔵 Preparation Checklists with Required vs Optional classification
* 🔵 Travel Documents Metadata Registry (expiry dates & 30-day alerts)
* 🔵 Emergency Contacts Registry (primary contact enforcement)
* 🔵 Derived Pre-Ride Trip Readiness Health Score & 6-category breakdown
* 🟢 Personal reminders

---

## Accommodation

Helping travelers organize accommodation information.

### Features

* 🔵 Accommodation & Stay Planning
* 🔵 1:1 TripStop binding & stay dates/nights calculation
* 🔵 Automatic Budget Estimate Synchronization
* 🔵 Hotel category auto-redirect workflow
* 🔵 Manual address-only stay support
* 🔵 Reservation & Contact details (`ConfirmationNumber`, `ContactPhone`, `Website`)

---

## Trip Memories & Summary Report

Surfacing post-ride summaries and personal memories.

### Features

* 🔵 Post-Ride Trip Summary Report Dashboard
* 🔵 Printable Summary Report Generator
* 🔵 Trip Memories & Journal Log (photos, notes, odometer readings)
* 🔵 Chronological Memory Timeline (newest first)
* 🟢 Photo albums / Cloud media storage

---

# Supporting Domains

Supporting domains complement the core planning experience through integrations and supporting services.

---

## Weather

### Features

* 🟢 Weather forecast
* 🟢 Daily weather
* 🟢 Weather alerts
* 🟢 Wind information
* 🟢 Sunrise & sunset

---

## Notifications

### Features

* 🟢 Trip reminders
* 🟢 Departure reminders
* 🟢 Packing reminders
* 🟢 Weather alerts
* 🟢 Document reminders

---

## Integrations

Ride Planner integrates with specialized services rather than replacing them.

### Features

* 🔵 Google Maps & Places Autocomplete
* 🟢 Navigation applications
* 🟢 Calendar integration
* 🟢 Weather providers
* 🟢 Cloud storage providers

---

# Notes

This catalogue is a living document and reflects the complete state of Ride Planner as of **v0.9.0**.
