using MediatR;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;

namespace RidePlanner.Application.Features.EmergencyContacts.Commands.UpdateEmergencyContact;

public sealed record UpdateEmergencyContactCommand(
    Guid TripId,
    Guid ContactId,
    string Name,
    string Relationship,
    string Phone,
    string? AlternatePhone = null,
    string? Email = null,
    bool IsPrimary = false) : IRequest<EmergencyContactDto?>;
