using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.TripStops.Commands.CreateTripStop;
using RidePlanner.Application.Features.TripStops.Commands.DeleteTripStop;
using RidePlanner.Application.Features.TripStops.Commands.UpdateTripStop;
using RidePlanner.Application.Features.TripStops.DTOs;
using RidePlanner.Application.Features.TripStops.Queries.GetTripStops;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/stops")]
public class TripStopsController : ControllerBase
{
    private readonly CreateTripStopCommandHandler _createTripStopCommandHandler;
    private readonly UpdateTripStopCommandHandler _updateTripStopCommandHandler;
    private readonly DeleteTripStopCommandHandler _deleteTripStopCommandHandler;
    private readonly GetTripStopsQueryHandler _getTripStopsQueryHandler;

    public TripStopsController(
        CreateTripStopCommandHandler createTripStopCommandHandler,
        UpdateTripStopCommandHandler updateTripStopCommandHandler,
        DeleteTripStopCommandHandler deleteTripStopCommandHandler,
        GetTripStopsQueryHandler getTripStopsQueryHandler)
    {
        _createTripStopCommandHandler = createTripStopCommandHandler;
        _updateTripStopCommandHandler = updateTripStopCommandHandler;
        _deleteTripStopCommandHandler = deleteTripStopCommandHandler;
        _getTripStopsQueryHandler = getTripStopsQueryHandler;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TripStopResponse>>> GetTripStops(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var stops = await _getTripStopsQueryHandler.Handle(
            new GetTripStopsQuery(tripId),
            cancellationToken);

        return Ok(stops);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateTripStop(
        Guid tripId,
        CreateTripStopRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateTripStopCommand(
    tripId,
    request.Name,
    request.Category,
    request.ArrivalDate,
    request.DepartureDate,
    request.Notes,
    request.DisplayOrder);

        var stopId = await _createTripStopCommandHandler.Handle(
            command,
            cancellationToken);

        return CreatedAtAction(
            nameof(GetTripStops),
            new { tripId },
            stopId);
    }

    [HttpPut("{stopId:guid}")]
    public async Task<IActionResult> UpdateTripStop(
        Guid tripId,
        Guid stopId,
        UpdateTripStopRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateTripStopCommand(
            tripId,
            stopId,
            request.Name,
            request.Category,
            request.ArrivalDate,
            request.DepartureDate,
            request.Notes,
            request.DisplayOrder);

        await _updateTripStopCommandHandler.Handle(
            command,
            cancellationToken);

        return NoContent();
    }

    [HttpDelete("{stopId:guid}")]
    public async Task<IActionResult> DeleteTripStop(
        Guid tripId,
        Guid stopId,
        CancellationToken cancellationToken)
    {
        var command = new DeleteTripStopCommand(
            tripId,
            stopId);

        await _deleteTripStopCommandHandler.Handle(
            command,
            cancellationToken);

        return NoContent();
    }
}