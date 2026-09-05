using MediatR;
using RidePlanner.Application.Features.Users.DTOs;

namespace RidePlanner.Application.Features.Users.Queries.GetUserProfile;

public sealed record GetUserProfileQuery() : IRequest<UserProfileDto>;
