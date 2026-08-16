using MediatR;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.TripStops.Commands.CreateTripStop;
using RidePlanner.Application.Features.TripStops.Commands.DeleteTripStop;
using RidePlanner.Application.Features.TripStops.Commands.ReorderTripStops;
using RidePlanner.Application.Features.TripStops.Commands.UpdateTripStop;
using RidePlanner.Application.Features.TripStops.DTOs;
using RidePlanner.Application.Features.TripStops.Queries.GetTripStops;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/stops")]
public class TripStopsController : ControllerBase
{
    private readonly ISender _sender;

    public TripStopsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TripStopResponse>>> GetTripStops(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var stops = await _sender.Send(
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
            request.PlaceId,
            request.FormattedAddress,
            request.Latitude,
            request.Longitude,
            request.Category,
            request.ArrivalDate,
            request.DepartureDate,
            request.Notes,
            request.DisplayOrder);

        var stopId = await _sender.Send(
            command,
            cancellationToken);

        return CreatedAtAction(
            nameof(GetTripStops),
            new { tripId },
            stopId);
    }

    [HttpPost("reorder")]
    public async Task<IActionResult> ReorderTripStops(
        Guid tripId,
        ReorderTripStopsRequest request,
        CancellationToken cancellationToken)
    {
        var command = new ReorderTripStopsCommand(
            tripId,
            request.OrderedStopIds);

        await _sender.Send(
            command,
            cancellationToken);

        return NoContent();
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
            request.PlaceId,
            request.FormattedAddress,
            request.Latitude,
            request.Longitude,
            request.Category,
            request.ArrivalDate,
            request.DepartureDate,
            request.Notes,
            request.DisplayOrder);

        await _sender.Send(
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

        await _sender.Send(
            command,
            cancellationToken);

        return NoContent();
    }
}