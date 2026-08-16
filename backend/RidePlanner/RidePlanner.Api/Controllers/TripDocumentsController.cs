using MediatR;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.TravelDocuments.Commands.CreateTripDocument;
using RidePlanner.Application.Features.TravelDocuments.Commands.DeleteTripDocument;
using RidePlanner.Application.Features.TravelDocuments.Commands.UpdateTripDocument;
using RidePlanner.Application.Features.TravelDocuments.DTOs;
using RidePlanner.Application.Features.TravelDocuments.Queries.GetTripDocument;
using RidePlanner.Application.Features.TravelDocuments.Queries.GetTripDocuments;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/documents")]
public sealed class TripDocumentsController : ControllerBase
{
    private readonly ISender _sender;

    public TripDocumentsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetDocuments(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetTripDocumentsQuery(tripId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetDocument(
        Guid tripId,
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetTripDocumentQuery(tripId, id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDocument(
        Guid tripId,
        [FromBody] CreateTripDocumentRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new CreateTripDocumentCommand(
                tripId,
                request.Title,
                request.Type,
                request.DocumentNumber,
                request.ExpiryDate,
                request.FilePath,
                request.Notes),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return CreatedAtAction(
            nameof(GetDocument),
            new { tripId, id = result.Id },
            result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateDocument(
        Guid tripId,
        Guid id,
        [FromBody] UpdateTripDocumentRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new UpdateTripDocumentCommand(
                tripId,
                id,
                request.Title,
                request.Type,
                request.DocumentNumber,
                request.ExpiryDate,
                request.FilePath,
                request.Notes),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteDocument(
        Guid tripId,
        Guid id,
        CancellationToken cancellationToken)
    {
        var success = await _sender.Send(
            new DeleteTripDocumentCommand(tripId, id),
            cancellationToken);

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}
