using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Trips.Commands.CreateTrip;
using RidePlanner.Application.Features.Trips.Commands.StartTrip;
using RidePlanner.Application.Features.Trips.Commands.CompleteTrip;
using RidePlanner.Application.Features.Trips.Commands.UpdateTrip;
using RidePlanner.Application.Features.Trips.Commands.DeleteTrip;
using RidePlanner.Application.Features.Trips.DTOs;
using RidePlanner.Application.Features.Trips.Mappings;
using RidePlanner.Application.Features.Trips.Queries.GetTrip;
using RidePlanner.Application.Features.Trips.Queries.GetTrips;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TripsController : ControllerBase
{
    private readonly CreateTripCommandHandler _createTripCommandHandler;
    private readonly UpdateTripCommandHandler _updateTripCommandHandler;
    private readonly DeleteTripCommandHandler _deleteTripCommandHandler;
    private readonly StartTripCommandHandler _startTripCommandHandler;
    private readonly CompleteTripCommandHandler _completeTripCommandHandler;
    private readonly GetTripQueryHandler _getTripQueryHandler;
    private readonly GetTripsQueryHandler _getTripsQueryHandler;

    public TripsController(
        CreateTripCommandHandler createTripCommandHandler,
        UpdateTripCommandHandler updateTripCommandHandler,
        DeleteTripCommandHandler deleteTripCommandHandler,
        StartTripCommandHandler startTripCommandHandler,
        CompleteTripCommandHandler completeTripCommandHandler,
        GetTripQueryHandler getTripQueryHandler,
        GetTripsQueryHandler getTripsQueryHandler)
    {
        _createTripCommandHandler = createTripCommandHandler;
        _updateTripCommandHandler = updateTripCommandHandler;
        _deleteTripCommandHandler = deleteTripCommandHandler;
        _startTripCommandHandler = startTripCommandHandler;
        _completeTripCommandHandler = completeTripCommandHandler;
        _getTripQueryHandler = getTripQueryHandler;
        _getTripsQueryHandler = getTripsQueryHandler;
    }

    [HttpPost]
    public async Task<ActionResult<TripResponse>> CreateTrip(
    CreateTripRequest request,
    CancellationToken cancellationToken)
    {
        var command = new CreateTripCommand(
            request.Name,
            request.Description,
            request.StartDate,
            request.EndDate);

        var trip = await _createTripCommandHandler.Handle(
            command,
            cancellationToken);

        return CreatedAtAction(nameof(GetTrip), new { id = trip.Id }, trip.ToResponse());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TripResponse>> GetTrip(Guid id,CancellationToken cancellationToken)
    {
        var trip = await _getTripQueryHandler.Handle(
                            new GetTripQuery(id),
                            cancellationToken);

        if (trip == null)
            return NotFound();

        return Ok(trip.ToResponse());
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TripResponse>>> GetTrips(CancellationToken cancellationToken)
    {
        var trips = await _getTripsQueryHandler.Handle(
            cancellationToken);

        IEnumerable<TripResponse> response = trips.Select(trip => trip.ToResponse());

        return Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TripResponse>> UpdateTrip(
    Guid id,
    UpdateTripRequest request,
    CancellationToken cancellationToken)
    {
        var command = new UpdateTripCommand(
            id,
            request.Name,
            request.Description,
            request.StartDate,
            request.EndDate);

        var trip = await _updateTripCommandHandler.Handle(
            command,
            cancellationToken);

        if (trip is null)
            return NotFound();

        return Ok(trip.ToResponse());
    }

    [HttpPost("{id:guid}/start")]
    public async Task<ActionResult<TripResponse>> StartTrip(
        Guid id,
        [FromBody] StartTripRequest? request,
        CancellationToken cancellationToken)
    {
        var command = new StartTripCommand(id, request?.ActualStart);
        var trip = await _startTripCommandHandler.Handle(command, cancellationToken);

        return Ok(trip.ToResponse());
    }

    [HttpPost("{id:guid}/complete")]
    public async Task<ActionResult<TripResponse>> CompleteTrip(
        Guid id,
        [FromBody] CompleteTripRequest? request,
        CancellationToken cancellationToken)
    {
        var command = new CompleteTripCommand(id, request?.ActualCompletion);
        var trip = await _completeTripCommandHandler.Handle(command, cancellationToken);

        return Ok(trip.ToResponse());
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteTrip(
    Guid id,
    CancellationToken cancellationToken)
    {
        var command = new DeleteTripCommand(id);
        await _deleteTripCommandHandler.Handle(
            command,
            cancellationToken);

        return NoContent();
    }
}