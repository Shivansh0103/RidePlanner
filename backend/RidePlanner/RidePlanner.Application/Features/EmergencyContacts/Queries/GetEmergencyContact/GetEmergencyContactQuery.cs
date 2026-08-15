namespace RidePlanner.Application.Features.EmergencyContacts.Queries.GetEmergencyContact;

public sealed record GetEmergencyContactQuery(Guid TripId, Guid ContactId);
