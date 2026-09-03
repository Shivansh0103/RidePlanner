using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;
using RidePlanner.Application.Features.EmergencyContacts.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.EmergencyContacts.Queries.GetEmergencyContact;

public sealed class GetEmergencyContactQueryHandler : IRequestHandler<GetEmergencyContactQuery, EmergencyContactDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IEmergencyContactRepository _contactRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetEmergencyContactQueryHandler(
        ITripRepository tripRepository,
        IEmergencyContactRepository contactRepository,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _contactRepository = contactRepository;
        _currentUserService = currentUserService;
    }

    public async Task<EmergencyContactDto?> Handle(
        GetEmergencyContactQuery request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var contact = await _contactRepository.GetByIdAsync(request.ContactId, cancellationToken);
        if (contact is null || contact.TripId != request.TripId)
        {
            return null;
        }

        return contact.ToDto();
    }
}
