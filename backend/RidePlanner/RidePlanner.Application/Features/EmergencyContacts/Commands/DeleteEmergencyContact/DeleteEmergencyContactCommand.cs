using MediatR;

namespace RidePlanner.Application.Features.EmergencyContacts.Commands.DeleteEmergencyContact;

public sealed record DeleteEmergencyContactCommand(
    Guid TripId,
    Guid ContactId) : IRequest<bool>;
