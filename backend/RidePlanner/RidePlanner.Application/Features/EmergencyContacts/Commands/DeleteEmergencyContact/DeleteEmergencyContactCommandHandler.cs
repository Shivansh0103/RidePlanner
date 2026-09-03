using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.EmergencyContacts.Commands.DeleteEmergencyContact;

public sealed class DeleteEmergencyContactCommandHandler : IRequestHandler<DeleteEmergencyContactCommand, bool>
{
    private readonly ITripRepository _tripRepository;
    private readonly IEmergencyContactRepository _contactRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public DeleteEmergencyContactCommandHandler(
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

    public async Task<bool> Handle(
        DeleteEmergencyContactCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            return false;
        }

        var contact = await _contactRepository.GetByIdAsync(request.ContactId, cancellationToken);
        if (contact is null || contact.TripId != request.TripId)
        {
            return false;
        }

        var wasPrimary = contact.IsPrimary;
        _contactRepository.Delete(contact);

        if (wasPrimary)
        {
            var remaining = await _contactRepository.GetByTripIdAsync(request.TripId, cancellationToken);
            if (remaining.Count > 0 && !remaining.Any(x => x.IsPrimary))
            {
                remaining[0].SetPrimary(true);
            }
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
