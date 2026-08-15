using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;
using RidePlanner.Application.Features.EmergencyContacts.Mappings;

namespace RidePlanner.Application.Features.EmergencyContacts.Commands.UpdateEmergencyContact;

public sealed class UpdateEmergencyContactCommandHandler
{
    private readonly IEmergencyContactRepository _contactRepository;

    public UpdateEmergencyContactCommandHandler(IEmergencyContactRepository contactRepository)
    {
        _contactRepository = contactRepository;
    }

    public async Task<EmergencyContactDto?> Handle(
        UpdateEmergencyContactCommand command,
        CancellationToken cancellationToken = default)
    {
        var contact = await _contactRepository.GetByIdAsync(command.ContactId, cancellationToken);
        if (contact is null || contact.TripId != command.TripId)
        {
            return null;
        }

        if (command.IsPrimary && !contact.IsPrimary)
        {
            await _contactRepository.UnsetPrimaryContactsForTripAsync(command.TripId, cancellationToken);
        }

        contact.Update(
            command.Name,
            command.Relationship,
            command.Phone,
            command.AlternatePhone,
            command.Email,
            command.IsPrimary);

        await _contactRepository.SaveChangesAsync(cancellationToken);

        return contact.ToDto();
    }
}
