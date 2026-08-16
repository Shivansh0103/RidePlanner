using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;
using RidePlanner.Application.Features.EmergencyContacts.Mappings;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.EmergencyContacts.Commands.CreateEmergencyContact;

public sealed class CreateEmergencyContactCommandHandler : IRequestHandler<CreateEmergencyContactCommand, EmergencyContactDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IEmergencyContactRepository _contactRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateEmergencyContactCommandHandler(
        ITripRepository tripRepository,
        IEmergencyContactRepository contactRepository,
        IUnitOfWork unitOfWork)
    {
        _tripRepository = tripRepository;
        _contactRepository = contactRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<EmergencyContactDto?> Handle(
        CreateEmergencyContactCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(request.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var existingContacts = await _contactRepository.GetByTripIdAsync(request.TripId, cancellationToken);
        var shouldBePrimary = request.IsPrimary || existingContacts.Count == 0;

        if (shouldBePrimary)
        {
            await _contactRepository.UnsetPrimaryContactsForTripAsync(request.TripId, cancellationToken);
        }

        var contact = new EmergencyContact(
            request.TripId,
            request.Name,
            request.Relationship,
            request.Phone,
            request.AlternatePhone,
            request.Email,
            isPrimary: shouldBePrimary);

        await _contactRepository.AddAsync(contact, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return contact.ToDto();
    }
}
