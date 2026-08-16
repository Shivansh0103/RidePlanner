using MediatR;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Budgets.Commands.CalculateFuelEstimate;
using RidePlanner.Application.Features.Budgets.Commands.CreateBudgetEstimate;
using RidePlanner.Application.Features.Budgets.Commands.DeleteBudgetEstimate;
using RidePlanner.Application.Features.Budgets.Commands.UpdateBudgetEstimate;
using RidePlanner.Application.Features.Budgets.Commands.UpdateTripBudget;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Budgets.Queries.GetTripBudget;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/budget")]
public sealed class TripBudgetsController : ControllerBase
{
    private readonly ISender _sender;

    public TripBudgetsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetBudget(Guid tripId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetTripBudgetQuery(tripId),
            cancellationToken);

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
        var result = await _sender.Send(
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
        var result = await _sender.Send(
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
        var result = await _sender.Send(
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

    [HttpDelete("estimates/{estimateId:guid}")]
    public async Task<IActionResult> DeleteEstimate(
        Guid tripId,
        Guid estimateId,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new DeleteBudgetEstimateCommand(
                tripId,
                estimateId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost("fuel-estimate")]
    public async Task<IActionResult> CalculateFuelEstimate(
        Guid tripId,
        [FromBody] CalculateFuelEstimateRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new CalculateFuelEstimateCommand(
                tripId,
                request.RouteDistanceKm,
                request.VehicleMileage,
                request.FuelPricePerLiter),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}