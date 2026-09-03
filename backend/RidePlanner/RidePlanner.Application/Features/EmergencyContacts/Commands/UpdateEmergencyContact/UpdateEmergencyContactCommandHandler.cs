using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;
using RidePlanner.Application.Features.EmergencyContacts.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.EmergencyContacts.Commands.UpdateEmergencyContact;

public sealed class UpdateEmergencyContactCommandHandler : IRequestHandler<UpdateEmergencyContactCommand, EmergencyContactDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IEmergencyContactRepository _contactRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public UpdateEmergencyContactCommandHandler(
        ITripRepository tripRepository,
        IEmergencyContactRepository contactRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _contactRepository = contactRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<EmergencyContactDto?> Handle(
        UpdateEmergencyContactCommand request,
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
