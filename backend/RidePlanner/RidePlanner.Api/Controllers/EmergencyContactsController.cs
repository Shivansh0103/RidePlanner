using MediatR;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.EmergencyContacts.Commands.CreateEmergencyContact;
using RidePlanner.Application.Features.EmergencyContacts.Commands.DeleteEmergencyContact;
using RidePlanner.Application.Features.EmergencyContacts.Commands.UpdateEmergencyContact;
using RidePlanner.Application.Features.EmergencyContacts.DTOs;
using RidePlanner.Application.Features.EmergencyContacts.Queries.GetEmergencyContact;
using RidePlanner.Application.Features.EmergencyContacts.Queries.GetEmergencyContacts;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/contacts")]
public sealed class EmergencyContactsController : ControllerBase
{
    private readonly ISender _sender;

    public EmergencyContactsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetContacts(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetEmergencyContactsQuery(tripId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetContact(
        Guid tripId,
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetEmergencyContactQuery(tripId, id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateContact(
        Guid tripId,
        [FromBody] CreateEmergencyContactRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new CreateEmergencyContactCommand(
                tripId,
                request.Name,
                request.Relationship,
                request.Phone,
                request.AlternatePhone,
                request.Email,
                request.IsPrimary),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return CreatedAtAction(
            nameof(GetContact),
            new { tripId, id = result.Id },
            result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateContact(
        Guid tripId,
        Guid id,
        [FromBody] UpdateEmergencyContactRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new UpdateEmergencyContactCommand(
                tripId,
                id,
                request.Name,
                request.Relationship,
                request.Phone,
                request.AlternatePhone,
                request.Email,
                request.IsPrimary),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteContact(
        Guid tripId,
        Guid id,
        CancellationToken cancellationToken)
    {
        var success = await _sender.Send(
            new DeleteEmergencyContactCommand(tripId, id),
            cancellationToken);

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}
