using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Readiness.Queries.GetTripReadiness;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/readiness")]
public sealed class TripReadinessController : ControllerBase
{
    private readonly GetTripReadinessQueryHandler _getReadinessHandler;

    public TripReadinessController(GetTripReadinessQueryHandler getReadinessHandler)
    {
        _getReadinessHandler = getReadinessHandler;
    }

    [HttpGet]
    public async Task<IActionResult> GetReadiness(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var result = await _getReadinessHandler.Handle(
            new GetTripReadinessQuery(tripId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}
