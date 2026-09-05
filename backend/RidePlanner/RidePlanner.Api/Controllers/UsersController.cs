using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Api.Models.Users;
using RidePlanner.Application.Features.Users.Commands.UpdateUserProfile;
using RidePlanner.Application.Features.Users.DTOs;
using RidePlanner.Application.Features.Users.Queries.GetUserProfile;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly ISender _sender;

    public UsersController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("profile")]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserProfileDto>> GetProfile(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetUserProfileQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpPut("profile")]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserProfileDto>> UpdateProfile(
        [FromBody] UpdateUserProfileRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateUserProfileCommand(
            request.PreferredCurrencyCode,
            request.DistanceUnit,
            request.DefaultVehicleName,
            request.DefaultTankCapacityLitres,
            request.DefaultFuelEfficiencyKmPerLitre);

        var result = await _sender.Send(command, cancellationToken);
        return Ok(result);
    }
}
