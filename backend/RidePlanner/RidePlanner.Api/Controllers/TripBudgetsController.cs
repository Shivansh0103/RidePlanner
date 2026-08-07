using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Budgets.Commands.CreateBudgetEstimate;
using RidePlanner.Application.Features.Budgets.Commands.UpdateBudgetEstimate;
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
    private readonly CreateBudgetEstimateCommandHandler _createBudgetEstimateHandler;
    private readonly UpdateBudgetEstimateCommandHandler _updateBudgetEstimateHandler;

    public TripBudgetsController(
        GetTripBudgetQueryHandler getTripBudgetHandler,
        UpdateTripBudgetCommandHandler updateTripBudgetHandler,
        CreateBudgetEstimateCommandHandler createBudgetEstimateHandler,
        UpdateBudgetEstimateCommandHandler updateBudgetEstimateHandler)
    {
        _getTripBudgetHandler = getTripBudgetHandler;
        _updateTripBudgetHandler = updateTripBudgetHandler;
        _createBudgetEstimateHandler = createBudgetEstimateHandler;
        _updateBudgetEstimateHandler = updateBudgetEstimateHandler;
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

    [HttpPost("estimates")]
    public async Task<IActionResult> CreateEstimate(
        Guid tripId,
        [FromBody] CreateBudgetEstimateRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _createBudgetEstimateHandler.Handle(
            new CreateBudgetEstimateCommand(
                tripId,
                request.Category,
                request.Name,
                request.EstimatedAmount),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPut("estimates/{estimateId:guid}")]
    public async Task<IActionResult> UpdateEstimate(
        Guid tripId,
        Guid estimateId,
        [FromBody] UpdateBudgetEstimateRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _updateBudgetEstimateHandler.Handle(
            new UpdateBudgetEstimateCommand(
                tripId,
                estimateId,
                request.Name,
                request.EstimatedAmount),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}