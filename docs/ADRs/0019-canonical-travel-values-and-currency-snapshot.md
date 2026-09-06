# 19. Canonical Travel Values and Trip-Level Currency Snapshot

* Status: Approved
* Date: September 2026

## Context

Sprint 13 introduced `UserProfile` to capture rider preferences, including:
- `PreferredCurrencyCode` (e.g. `INR`, `USD`, `EUR`, `GBP`)
- `DistanceUnit` (e.g. `Kilometers`, `Miles`)
- Default vehicle tank capacity and fuel efficiency

A critical architectural hazard in travel and financial planning software is allowing display preferences to silently mutate, convert, or corrupt transactional business data.

Specifically:
1. If a rider created a trip budget with ₹20,000 INR, changing their profile preferred currency to USD must never silently change the stored trip value to $20,000 or attempt speculative exchange rate conversions.
2. If route distances and fuel calculations depend on units, calculations could suffer precision loss or inconsistencies if stored in mixed units.

## Decision

We established strict data integrity rules separating user preferences from domain entities:

1. **Trip-Level Currency Snapshot**:
   - `UserProfile.PreferredCurrencyCode` serves exclusively as a **default template for newly created trips/budgets**.
   - Each trip budget holds its own currency context established at creation time.
   - Modifying `UserProfile.PreferredCurrencyCode` has **zero impact** on historical trips, existing budgets, or logged expenses. It does not convert, recalculate, or relabel existing money.
   - Dynamic currency conversion via external exchange-rate APIs is explicitly deferred and not permitted in Sprint 13.

2. **Canonical Metric Distance Storage**:
   - The domain model and routing APIs continue to store all route distances and waypoint coordinates canonically in metric units (meters and kilometers).
   - `DistanceUnit` (`Kilometers` | `Miles`) in `UserProfile` is strictly a presentation and input UX preference.
   - When displaying distances or capturing user input, UI formatters and form controls translate between canonical meters and the rider's chosen unit without altering database representations.

3. **Decoupled Fuel Domain Logic**:
   - The backend domain calculation in `TripBudget.CalculateFuelEstimate` calculates fuel costs strictly using parameters supplied in the request.
   - The profile's `DefaultFuelEfficiencyKmPerLitre` provides default values to the frontend UI dialog and background sync, but riders retain full autonomy to override mileage on a per-calculation basis.

## Consequences

### Positive

- **Absolute Data Integrity**: Prevents accidental corruption of financial records and travel logs when users switch travel preferences.
- **Predictable Domain Modeling**: Canonical metric units guarantee consistent geographic calculations across all backend algorithms.
- **Accurate Historical Records**: A trip planned in 2025 in INR accurately remains in INR, even if the rider relocates and sets their profile default to EUR in 2026.

### Negative

- Cross-currency comparison across different historical trips in an aggregate reporting view requires future currency conversion services.
