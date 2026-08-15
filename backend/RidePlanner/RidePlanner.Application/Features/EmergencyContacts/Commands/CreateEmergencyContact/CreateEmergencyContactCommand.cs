namespace RidePlanner.Application.Features.EmergencyContacts.Commands.CreateEmergencyContact;

public sealed record CreateEmergencyContactCommand(
    Guid TripId,
    string Name,
    string Relationship,
    string Phone,
    string? AlternatePhone = null,
    string? Email = null,
    bool IsPrimary = false);
