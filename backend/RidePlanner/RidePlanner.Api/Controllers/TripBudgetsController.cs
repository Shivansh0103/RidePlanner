using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Budgets.Commands.UpdateTripBudget;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Budgets.Queries.GetTripBudget;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/budget")]
public sealed class TripBudgetsController : ControllerBase
{
    private readonly GetTripBudgetQueryHandler _getTripBudgetHandler;
    private readonly UpdateTripBudgetCommandHandler _updateTripBudgetHandler;

    public TripBudgetsController(
        GetTripBudgetQueryHandler getTripBudgetHandler,
        UpdateTripBudgetCommandHandler updateTripBudgetHandler)
    {
        _getTripBudgetHandler = getTripBudgetHandler;
        _updateTripBudgetHandler = updateTripBudgetHandler;
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

    [HttpPut]
    public async Task<IActionResult> UpdateBudget(
        Guid tripId,
        [FromBody] UpdateTripBudgetRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _updateTripBudgetHandler.Handle(
            new UpdateTripBudgetCommand(
                tripId,
                request.TargetBudget),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}