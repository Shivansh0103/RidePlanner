using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.EmergencyContacts.Commands.DeleteEmergencyContact;

public sealed class DeleteEmergencyContactCommandHandler
{
    private readonly IEmergencyContactRepository _contactRepository;

    public DeleteEmergencyContactCommandHandler(IEmergencyContactRepository contactRepository)
    {
        _contactRepository = contactRepository;
    }

    public async Task<bool> Handle(
        DeleteEmergencyContactCommand command,
        CancellationToken cancellationToken = default)
    {
        var contact = await _contactRepository.GetByIdAsync(command.ContactId, cancellationToken);
        if (contact is null || contact.TripId != command.TripId)
        {
            return false;
        }

        var wasPrimary = contact.IsPrimary;
        _contactRepository.Delete(contact);
        await _contactRepository.SaveChangesAsync(cancellationToken);

        if (wasPrimary)
        {
            var remaining = await _contactRepository.GetByTripIdAsync(command.TripId, cancellationToken);
            if (remaining.Count > 0 && !remaining.Any(x => x.IsPrimary))
            {
                remaining[0].SetPrimary(true);
                await _contactRepository.SaveChangesAsync(cancellationToken);
            }
        }

        return true;
    }
}
