using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Summary.Queries.GetTripSummary;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/summary")]
public sealed class TripSummaryController : ControllerBase
{
    private readonly GetTripSummaryQueryHandler _getSummaryHandler;

    public TripSummaryController(GetTripSummaryQueryHandler getSummaryHandler)
    {
        _getSummaryHandler = getSummaryHandler;
    }

    [HttpGet]
    public async Task<IActionResult> GetSummary(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var result = await _getSummaryHandler.Handle(
            new GetTripSummaryQuery(tripId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}
