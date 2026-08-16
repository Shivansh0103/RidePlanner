# 11. Trip-Scoped Supporting Entities for Preparation and Memories

* Status: Approved
* Date: August 2026

## Context

Sprint 9 introduced supporting capabilities to help riders prepare for travel and log memories:
- Travel Documents (`TripDocument`)
- Emergency Contacts (`EmergencyContact`)
- Trip Memories & Journal (`TripMemory`)

We needed to establish clear architectural boundaries regarding entity scope and integration depth to prevent premature complexity (such as cloud blob storage pipelines, global address books, OCR, or public media feeds).

## Decision

We decided to model Travel Documents, Emergency Contacts, and Trip Memories strictly as **lightweight, trip-scoped domain entities** owned directly by the `Trip` aggregate:

1. **Travel Documents (`TripDocument`)**:
   - Stores metadata only (title, structured type category, document number, expiration date, optional external URL, and notes).
   - Document expiration status is computed dynamically (alerts triggered for `ExpiryDate <= UtcNow + 30 days`).
   - No binary file uploads, cloud storage service dependencies, or OCR pipelines.

2. **Emergency Contacts (`EmergencyContact`)**:
   - Stores contact details (`Name`, `Relationship`, `Phone`, `AlternatePhone`, `Email`, `IsPrimary`).
   - Enforces single-primary contact per trip.
   - No global user address book or external telephony integrations.

3. **Trip Memories (`TripMemory`)**:
   - Stores rider notes, photo URLs, memory date, and odometer readings (`OdometerReadingKm`).
   - Sorted in descending chronological order (newest first).
   - No social media feeds, likes/comments, or media processing engines.

## Consequences

### Positive
- **YAGNI Alignment**: Delivers immediate utility to riders without introducing complex file-upload servers or third-party cloud infrastructure.
- **Data Isolation**: Deleting a trip automatically cleans up all associated documents, contacts, and memories via EF Core cascade deletes.
- **Fast Execution**: Simplified metadata models allowed rapid, high-quality vertical feature slice implementation across all 3 domains.

### Negative
- Users must provide external URLs for documents/photos rather than uploading local files directly. (Future milestones may introduce a dedicated blob storage provider if required).
