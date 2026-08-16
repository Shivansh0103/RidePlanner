using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;
using RidePlanner.Application.Features.EmergencyContacts.Mappings;

namespace RidePlanner.Application.Features.EmergencyContacts.Commands.UpdateEmergencyContact;

public sealed class UpdateEmergencyContactCommandHandler : IRequestHandler<UpdateEmergencyContactCommand, EmergencyContactDto?>
{
    private readonly IEmergencyContactRepository _contactRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateEmergencyContactCommandHandler(
        IEmergencyContactRepository contactRepository,
        IUnitOfWork unitOfWork)
    {
        _contactRepository = contactRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<EmergencyContactDto?> Handle(
        UpdateEmergencyContactCommand request,
        CancellationToken cancellationToken = default)
    {
        var contact = await _contactRepository.GetByIdAsync(request.ContactId, cancellationToken);
        if (contact is null || contact.TripId != request.TripId)
        {
            return null;
        }

        if (request.IsPrimary && !contact.IsPrimary)
        {
            await _contactRepository.UnsetPrimaryContactsForTripAsync(request.TripId, cancellationToken);
        }

        contact.Update(
            request.Name,
            request.Relationship,
            request.Phone,
            request.AlternatePhone,
            request.Email,
            request.IsPrimary);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return contact.ToDto();
    }
}
