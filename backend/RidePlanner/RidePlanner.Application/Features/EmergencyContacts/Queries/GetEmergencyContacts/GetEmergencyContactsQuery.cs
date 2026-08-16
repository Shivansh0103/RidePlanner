using MediatR;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;

namespace RidePlanner.Application.Features.EmergencyContacts.Queries.GetEmergencyContacts;

public sealed record GetEmergencyContactsQuery(Guid TripId) : IRequest<IReadOnlyList<EmergencyContactDto>?>;
