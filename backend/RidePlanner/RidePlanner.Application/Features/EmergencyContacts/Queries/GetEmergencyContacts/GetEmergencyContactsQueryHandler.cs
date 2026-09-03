using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;
using RidePlanner.Application.Features.EmergencyContacts.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.EmergencyContacts.Queries.GetEmergencyContacts;

public sealed class GetEmergencyContactsQueryHandler : IRequestHandler<GetEmergencyContactsQuery, IReadOnlyList<EmergencyContactDto>?>
{
    private readonly IEmergencyContactRepository _contactRepository;
    private readonly ITripRepository _tripRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetEmergencyContactsQueryHandler(
        IEmergencyContactRepository contactRepository,
        ITripRepository tripRepository,
        ICurrentUserService currentUserService)
    {
        _contactRepository = contactRepository;
        _tripRepository = tripRepository;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<EmergencyContactDto>?> Handle(
        GetEmergencyContactsQuery request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var contacts = await _contactRepository.GetByTripIdAsync(request.TripId, cancellationToken);
        return contacts.Select(c => c.ToDto()).ToList();
    }
}
