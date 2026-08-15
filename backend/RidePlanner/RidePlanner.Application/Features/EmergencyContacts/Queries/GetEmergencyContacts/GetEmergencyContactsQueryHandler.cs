using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;
using RidePlanner.Application.Features.EmergencyContacts.Mappings;

namespace RidePlanner.Application.Features.EmergencyContacts.Queries.GetEmergencyContacts;

public sealed class GetEmergencyContactsQueryHandler
{
    private readonly IEmergencyContactRepository _contactRepository;
    private readonly ITripRepository _tripRepository;

    public GetEmergencyContactsQueryHandler(
        IEmergencyContactRepository contactRepository,
        ITripRepository tripRepository)
    {
        _contactRepository = contactRepository;
        _tripRepository = tripRepository;
    }

    public async Task<IReadOnlyList<EmergencyContactDto>?> Handle(
        GetEmergencyContactsQuery query,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(query.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var contacts = await _contactRepository.GetByTripIdAsync(query.TripId, cancellationToken);
        return contacts.Select(c => c.ToDto()).ToList();
    }
}
