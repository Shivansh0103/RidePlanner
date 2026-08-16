using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;
using RidePlanner.Application.Features.EmergencyContacts.Mappings;

namespace RidePlanner.Application.Features.EmergencyContacts.Queries.GetEmergencyContact;

public sealed class GetEmergencyContactQueryHandler : IRequestHandler<GetEmergencyContactQuery, EmergencyContactDto?>
{
    private readonly IEmergencyContactRepository _contactRepository;

    public GetEmergencyContactQueryHandler(IEmergencyContactRepository contactRepository)
    {
        _contactRepository = contactRepository;
    }

    public async Task<EmergencyContactDto?> Handle(
        GetEmergencyContactQuery request,
        CancellationToken cancellationToken = default)
    {
        var contact = await _contactRepository.GetByIdAsync(request.ContactId, cancellationToken);
        if (contact is null || contact.TripId != request.TripId)
        {
            return null;
        }

        return contact.ToDto();
    }
}
