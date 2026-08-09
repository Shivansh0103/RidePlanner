using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Accommodations.Commands.CreateAccommodation;
using RidePlanner.Application.Features.Accommodations.Commands.DeleteAccommodation;
using RidePlanner.Application.Features.Accommodations.Commands.UpdateAccommodation;
using RidePlanner.Application.Features.Accommodations.DTOs;
using RidePlanner.Application.Features.Accommodations.Queries.GetAccommodationById;
using RidePlanner.Application.Features.Accommodations.Queries.GetAccommodationsByTripId;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/accommodations")]
public class TripAccommodationsController : ControllerBase
{
    private readonly CreateAccommodationCommandHandler _createAccommodationCommandHandler;
    private readonly UpdateAccommodationCommandHandler _updateAccommodationCommandHandler;
    private readonly DeleteAccommodationCommandHandler _deleteAccommodationCommandHandler;
    private readonly GetAccommodationsByTripIdQueryHandler _getAccommodationsByTripIdQueryHandler;
    private readonly GetAccommodationByIdQueryHandler _getAccommodationByIdQueryHandler;

    public TripAccommodationsController(
        CreateAccommodationCommandHandler createAccommodationCommandHandler,
        UpdateAccommodationCommandHandler updateAccommodationCommandHandler,
        DeleteAccommodationCommandHandler deleteAccommodationCommandHandler,
        GetAccommodationsByTripIdQueryHandler getAccommodationsByTripIdQueryHandler,
        GetAccommodationByIdQueryHandler getAccommodationByIdQueryHandler)
    {
        _createAccommodationCommandHandler = createAccommodationCommandHandler;
        _updateAccommodationCommandHandler = updateAccommodationCommandHandler;
        _deleteAccommodationCommandHandler = deleteAccommodationCommandHandler;
        _getAccommodationsByTripIdQueryHandler = getAccommodationsByTripIdQueryHandler;
        _getAccommodationByIdQueryHandler = getAccommodationByIdQueryHandler;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AccommodationResponse>>> GetAccommodations(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var accommodations = await _getAccommodationsByTripIdQueryHandler.Handle(
            new GetAccommodationsByTripIdQuery(tripId),
            cancellationToken);

        return Ok(accommodations);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AccommodationResponse>> GetAccommodationById(
        Guid tripId,
        Guid id,
        CancellationToken cancellationToken)
    {
        var accommodation = await _getAccommodationByIdQueryHandler.Handle(
            new GetAccommodationByIdQuery(tripId, id),
            cancellationToken);

        return Ok(accommodation);
    }

    [HttpPost]
    public async Task<ActionResult<AccommodationResponse>> CreateAccommodation(
        Guid tripId,
        CreateAccommodationRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateAccommodationCommand(
            tripId,
            request.Name,
            request.Type,
            request.CheckInDate,
            request.CheckOutDate,
            request.CheckInTime,
            request.CheckOutTime,
            request.FormattedAddress,
            request.Latitude,
            request.Longitude,
            request.PlaceId,
            request.ConfirmationNumber,
            request.ContactName,
            request.ContactPhone,
            request.Website,
            request.BookingNotes,
            request.Cost,
            request.DisplayOrder);

        var accommodation = await _createAccommodationCommandHandler.Handle(
            command,
            cancellationToken);

        return CreatedAtAction(
            nameof(GetAccommodationById),
            new { tripId, id = accommodation.Id },
            accommodation);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<AccommodationResponse>> UpdateAccommodation(
        Guid tripId,
        Guid id,
        UpdateAccommodationRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateAccommodationCommand(
            id,
            tripId,
            request.Name,
            request.Type,
            request.CheckInDate,
            request.CheckOutDate,
            request.CheckInTime,
            request.CheckOutTime,
            request.FormattedAddress,
            request.Latitude,
            request.Longitude,
            request.PlaceId,
            request.ConfirmationNumber,
            request.ContactName,
            request.ContactPhone,
            request.Website,
            request.BookingNotes,
            request.Cost,
            request.DisplayOrder);

        var accommodation = await _updateAccommodationCommandHandler.Handle(
            command,
            cancellationToken);

        return Ok(accommodation);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAccommodation(
        Guid tripId,
        Guid id,
        CancellationToken cancellationToken)
    {
        var command = new DeleteAccommodationCommand(
            tripId,
            id);

        await _deleteAccommodationCommandHandler.Handle(
            command,
            cancellationToken);

        return NoContent();
    }
}
