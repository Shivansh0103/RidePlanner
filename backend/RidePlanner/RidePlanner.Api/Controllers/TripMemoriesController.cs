using MediatR;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Memories.Commands.CreateTripMemory;
using RidePlanner.Application.Features.Memories.Commands.DeleteTripMemory;
using RidePlanner.Application.Features.Memories.Commands.UpdateTripMemory;
using RidePlanner.Application.Features.Memories.DTOs;
using RidePlanner.Application.Features.Memories.Queries.GetTripMemories;
using RidePlanner.Application.Features.Memories.Queries.GetTripMemory;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/memories")]
public sealed class TripMemoriesController : ControllerBase
{
    private readonly ISender _sender;

    public TripMemoriesController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetMemories(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetTripMemoriesQuery(tripId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetMemory(
        Guid tripId,
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetTripMemoryQuery(tripId, id),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMemory(
        Guid tripId,
        [FromBody] CreateTripMemoryRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new CreateTripMemoryCommand(
                tripId,
                request.Title,
                request.Content,
                request.ImageUrl,
                request.OdometerReadingKm,
                request.MemoryDate),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return CreatedAtAction(
            nameof(GetMemory),
            new { tripId, id = result.Id },
            result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateMemory(
        Guid tripId,
        Guid id,
        [FromBody] UpdateTripMemoryRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new UpdateTripMemoryCommand(
                tripId,
                id,
                request.Title,
                request.Content,
                request.ImageUrl,
                request.OdometerReadingKm,
                request.MemoryDate),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteMemory(
        Guid tripId,
        Guid id,
        CancellationToken cancellationToken)
    {
        var success = await _sender.Send(
            new DeleteTripMemoryCommand(tripId, id),
            cancellationToken);

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}
