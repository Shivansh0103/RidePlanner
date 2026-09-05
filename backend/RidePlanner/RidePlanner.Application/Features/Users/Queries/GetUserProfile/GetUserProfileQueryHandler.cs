using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;
using RidePlanner.Application.Features.Users.DTOs;

namespace RidePlanner.Application.Features.Users.Queries.GetUserProfile;

public sealed class GetUserProfileQueryHandler : IRequestHandler<GetUserProfileQuery, UserProfileDto>
{
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetUserProfileQueryHandler(
        IUserProfileRepository userProfileRepository,
        ICurrentUserService currentUserService)
    {
        _userProfileRepository = userProfileRepository;
        _currentUserService = currentUserService;
    }

    public async Task<UserProfileDto> Handle(
        GetUserProfileQuery request,
        CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var profile = await _userProfileRepository.GetByUserIdAsync(currentUserId, cancellationToken);
        if (profile == null)
        {
            throw new NotFoundException($"User profile not found for user '{currentUserId}'.");
        }

        return UserProfileDto.FromEntity(profile);
    }
}
