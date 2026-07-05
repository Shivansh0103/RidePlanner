# Ride Planner - User Stories & Acceptance Criteria

This document outlines the user stories and acceptance criteria that define the requirements for the Ride Planner platform.

---

## Feature 1: User Authentication

### US1: User Registration
**As a** new motorcycle rider  
**I want to** create an account with my email, password, and name  
**So that** I can securely save and manage my own rides.

**Acceptance Criteria:**
- The user must provide a name, a valid email address, and a password.
- The email address must be unique in the system.
- The password must be secure (e.g., minimum 8 characters).
- Passwords must be encrypted/hashed before storing in the database (never store plain text).
- On successful registration, the user receives a confirmation response.

### US2: User Login
**As a** registered rider  
**I want to** log in with my email and password  
**So that** I can access my saved trips and profile.

**Acceptance Criteria:**
- The user must provide their registered email and password.
- If credentials are correct, the system returns a secure token (JWT) to authenticate subsequent requests.
- If credentials are incorrect, the system returns a clear but generic error message (e.g., "Invalid email or password") to prevent username enumeration.

---

## Feature 2: Trip Management (Basic CRUD)

### US3: Create a Trip
**As a** logged-in rider  
**I want to** create a new motorcycle trip by entering a title, start date, end date, and description  
**So that** I can start planning my route.

**Acceptance Criteria:**
- The user must be authenticated to create a trip.
- The trip must have a title (minimum 3 characters, maximum 100 characters).
- The start date must be today or in the future.
- The end date must be on or after the start date.
- The trip is linked to the authenticated user who created it.
