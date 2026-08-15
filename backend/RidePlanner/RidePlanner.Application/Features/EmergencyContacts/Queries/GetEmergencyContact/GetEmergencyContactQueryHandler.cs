using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;
using RidePlanner.Application.Features.EmergencyContacts.Mappings;

namespace RidePlanner.Application.Features.EmergencyContacts.Queries.GetEmergencyContact;

public sealed class GetEmergencyContactQueryHandler
{
    private readonly IEmergencyContactRepository _contactRepository;

    public GetEmergencyContactQueryHandler(IEmergencyContactRepository contactRepository)
    {
        _contactRepository = contactRepository;
    }

    public async Task<EmergencyContactDto?> Handle(
        GetEmergencyContactQuery query,
        CancellationToken cancellationToken = default)
    {
        var contact = await _contactRepository.GetByIdAsync(query.ContactId, cancellationToken);
        if (contact is null || contact.TripId != query.TripId)
        {
            return null;
        }

        return contact.ToDto();
    }
}
