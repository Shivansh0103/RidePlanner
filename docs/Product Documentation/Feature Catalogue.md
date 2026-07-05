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

* 🟢 Create Trip
* 🟢 Edit Trip
* 🟢 Duplicate Trip
* 🟢 Archive Trip
* 🟢 Delete Trip
* 🟢 Trip Templates
* 🟢 Favorite Trips

---

## Itinerary Management

Responsible for organizing journeys throughout their duration.

### Features

* 🟢 Multi-day itineraries
* 🟢 Daily schedules
* 🟢 Destinations
* 🟢 Stops
* 🟢 Activities
* 🟢 Timeline
* 🟢 Trip notes

---

## Route Planning

Responsible for planning and organizing travel routes.

### Features

* 🟢 Route Builder
* 🟢 Waypoints
* 🟢 Scenic routes
* 🟢 Alternative routes
* 🟢 Distance estimation
* 🟢 Duration estimation
* 🟢 GPX Import
* 🟢 GPX Export

---

## Budget & Expense Management

Responsible for estimating, tracking, and reviewing travel expenses.

### Features

* 🟢 Fuel estimation
* 🟢 Fuel expenses
* 🟢 Toll estimation
* 🟢 Accommodation expenses
* 🟢 Food expenses
* 🟢 Miscellaneous expenses
* 🟢 Shared expenses
* 🟢 Budget summary

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

* 🟢 Packing lists
* 🟢 Vehicle checklist
* 🟢 Travel documents
* 🟢 Emergency contacts
* 🟢 Personal reminders

---

## Accommodation

Helping travelers organize accommodation information.

### Features

* 🟢 Accommodation planning
* 🟢 Reservation details
* 🟢 Booking references
* 🟢 Check-in schedule
* 🟢 Check-out schedule

---

## Trip Memories

Ride Planner manages the context of travel memories rather than acting as a cloud storage platform.

### Features

* 🟢 Trip highlights
* 🟢 Timeline
* 🟢 Places visited
* 🟢 Notes
* 🟢 Photo references
* 🟢 Video references
* 🟢 Trip summary
* 🟢 Trip statistics

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

* 🟢 Maps providers
* 🟢 Navigation applications
* 🟢 Calendar integration
* 🟢 Weather providers
* 🟢 Cloud storage providers
* 🟢 Photo libraries
* 🟢 Booking references

---

## User Profile

### Features

* 🟢 User profile
* 🟢 Preferences
* 🟢 Saved locations
* 🟢 Favorite destinations
* 🟢 Travel history

---

## Settings

### Features

* 🟢 Theme
* 🟢 Units
* 🟢 Privacy settings
* 🟢 Notification preferences
* 🟢 Connected services

---

# Future Domains

These domains align with the long-term product vision but are intentionally outside the scope of the initial releases.

---

## AI Assistance

### Potential Features

* ⚪ AI itinerary suggestions
* ⚪ Route optimization
* ⚪ Budget recommendations
* ⚪ Smart packing suggestions

---

## Community

### Potential Features

* ⚪ Public trips
* ⚪ Community routes
* ⚪ Travel recommendations
* ⚪ Shared itineraries

---

## Vehicle Management

### Potential Features

* ⚪ Multiple vehicles
* ⚪ Vehicle profiles
* ⚪ Maintenance reminders
* ⚪ Fuel efficiency tracking
* ⚪ EV trip planning

---

## Analytics

### Potential Features

* ⚪ Travel dashboard
* ⚪ Distance travelled
* ⚪ Expense insights
* ⚪ Annual travel summaries
* ⚪ Travel achievements

---

# Guiding Principles

The Feature Catalogue should evolve alongside the product.

When introducing new features, consider the following principles:

* Solve a genuine user problem.
* Align with the product vision and scope.
* Strengthen existing workflows before introducing new ones.
* Prefer thoughtful integrations over replacing specialized services.
* Keep the product focused on planning and managing road trips.

---

# Notes

This catalogue is intended to be a living document.

Features may be added, reorganized, reprioritized, or removed as Ride Planner evolves. The catalogue should always reflect the current understanding of the product and serve as the foundation for roadmap planning, feature specifications, and future architectural decisions.
