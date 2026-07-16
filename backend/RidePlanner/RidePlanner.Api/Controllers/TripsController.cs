using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Trips.Commands.CreateTrip;
using RidePlanner.Application.Trips.Commands.UpdateTrip;
using RidePlanner.Application.Trips.Commands.DeleteTrip;
using RidePlanner.Application.Trips.DTOs;
using RidePlanner.Application.Trips.Mappings;
using RidePlanner.Application.Trips.Queries.GetTrip;
using RidePlanner.Application.Trips.Queries.GetTrips;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TripsController : ControllerBase
{
    private readonly CreateTripCommandHandler _createTripCommandHandler;
    private readonly UpdateTripCommandHandler _updateTripCommandHandler;
    private readonly DeleteTripCommandHandler _deleteTripCommandHandler;
    private readonly GetTripQueryHandler _getTripQueryHandler;
    private readonly GetTripsQueryHandler _getTripsQueryHandler;

    public TripsController(
        CreateTripCommandHandler createTripCommandHandler,
        UpdateTripCommandHandler updateTripCommandHandler,
        DeleteTripCommandHandler deleteTripCommandHandler,
        GetTripQueryHandler getTripQueryHandler,
        GetTripsQueryHandler getTripsQueryHandler)
    {
        _createTripCommandHandler = createTripCommandHandler;
        _updateTripCommandHandler = updateTripCommandHandler;
        _deleteTripCommandHandler = deleteTripCommandHandler;
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

        return Created(string.Empty, trip.ToResponse());
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