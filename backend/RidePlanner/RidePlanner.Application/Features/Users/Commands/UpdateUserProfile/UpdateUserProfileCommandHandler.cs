using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;
using RidePlanner.Application.Features.Users.DTOs;

namespace RidePlanner.Application.Features.Users.Commands.UpdateUserProfile;

public sealed class UpdateUserProfileCommandHandler : IRequestHandler<UpdateUserProfileCommand, UserProfileDto>
{
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public UpdateUserProfileCommandHandler(
        IUserProfileRepository userProfileRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _userProfileRepository = userProfileRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<UserProfileDto> Handle(
        UpdateUserProfileCommand request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var profile = await _userProfileRepository.GetByUserIdAsync(currentUserId, cancellationToken);
        if (profile == null)
        {
            throw new NotFoundException($"User profile not found for user '{currentUserId}'.");
        }

        profile.UpdatePreferences(
            request.PreferredCurrencyCode,
            request.DistanceUnit,
            request.DefaultVehicleName,
            request.DefaultTankCapacityLitres,
            request.DefaultFuelEfficiencyKmPerLitre);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return UserProfileDto.FromEntity(profile);
    }
}
