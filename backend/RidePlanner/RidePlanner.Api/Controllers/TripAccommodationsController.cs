using MediatR;
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
    private readonly ISender _sender;

    public TripAccommodationsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AccommodationResponse>>> GetAccommodations(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var accommodations = await _sender.Send(
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
        var accommodation = await _sender.Send(
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

        var accommodation = await _sender.Send(
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

        var accommodation = await _sender.Send(
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

        await _sender.Send(
            command,
            cancellationToken);

        return NoContent();
    }
}
