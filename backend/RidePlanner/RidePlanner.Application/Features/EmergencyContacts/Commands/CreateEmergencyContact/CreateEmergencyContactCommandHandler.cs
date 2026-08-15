using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;
using RidePlanner.Application.Features.EmergencyContacts.Mappings;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.EmergencyContacts.Commands.CreateEmergencyContact;

public sealed class CreateEmergencyContactCommandHandler
{
    private readonly ITripRepository _tripRepository;
    private readonly IEmergencyContactRepository _contactRepository;

    public CreateEmergencyContactCommandHandler(
        ITripRepository tripRepository,
        IEmergencyContactRepository contactRepository)
    {
        _tripRepository = tripRepository;
        _contactRepository = contactRepository;
    }

    public async Task<EmergencyContactDto?> Handle(
        CreateEmergencyContactCommand command,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(command.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var existingContacts = await _contactRepository.GetByTripIdAsync(command.TripId, cancellationToken);
        var shouldBePrimary = command.IsPrimary || existingContacts.Count == 0;

        if (shouldBePrimary)
        {
            await _contactRepository.UnsetPrimaryContactsForTripAsync(command.TripId, cancellationToken);
        }

        var contact = new EmergencyContact(
            command.TripId,
            command.Name,
            command.Relationship,
            command.Phone,
            command.AlternatePhone,
            command.Email,
            isPrimary: shouldBePrimary);

        await _contactRepository.AddAsync(contact, cancellationToken);
        await _contactRepository.SaveChangesAsync(cancellationToken);

        return contact.ToDto();
    }
}
