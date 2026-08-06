using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Budgets.Queries.GetTripBudget;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/budget")]
public sealed class TripBudgetsController : ControllerBase
{
    private readonly GetTripBudgetQueryHandler _getTripBudgetHandler;

    public TripBudgetsController(
        GetTripBudgetQueryHandler getTripBudgetHandler)
    {
        _getTripBudgetHandler = getTripBudgetHandler;
    }

    [HttpGet]
    public async Task<IActionResult> GetBudget(Guid tripId)
    {
        var result = await _getTripBudgetHandler.Handle(
            new GetTripBudgetQuery(tripId));

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}