using MediatR;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Checklists.Commands.CreateCategory;
using RidePlanner.Application.Features.Checklists.Commands.CreateItem;
using RidePlanner.Application.Features.Checklists.Commands.DeleteCategory;
using RidePlanner.Application.Features.Checklists.Commands.DeleteItem;
using RidePlanner.Application.Features.Checklists.Commands.ToggleItem;
using RidePlanner.Application.Features.Checklists.Commands.UpdateCategory;
using RidePlanner.Application.Features.Checklists.Commands.UpdateItem;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Queries.GetTripChecklist;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/checklist")]
public sealed class TripChecklistsController : ControllerBase
{
    private readonly ISender _sender;

    public TripChecklistsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<IActionResult> GetChecklist(
        Guid tripId,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetTripChecklistQuery(tripId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory(
        Guid tripId,
        [FromBody] CreateChecklistCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new CreateChecklistCategoryCommand(tripId, request.Name),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPut("categories/{categoryId:guid}")]
    public async Task<IActionResult> UpdateCategory(
        Guid tripId,
        Guid categoryId,
        [FromBody] UpdateChecklistCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new UpdateChecklistCategoryCommand(tripId, categoryId, request.Name),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("categories/{categoryId:guid}")]
    public async Task<IActionResult> DeleteCategory(
        Guid tripId,
        Guid categoryId,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new DeleteChecklistCategoryCommand(tripId, categoryId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost("items")]
    public async Task<IActionResult> CreateItem(
        Guid tripId,
        [FromBody] CreateChecklistItemRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new CreateChecklistItemCommand(tripId, request.CategoryId, request.Title, request.IsRequired),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPut("items/{itemId:guid}")]
    public async Task<IActionResult> UpdateItem(
        Guid tripId,
        Guid itemId,
        [FromBody] UpdateChecklistItemRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new UpdateChecklistItemCommand(tripId, itemId, request.Title, request.IsRequired),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPatch("items/{itemId:guid}/toggle")]
    public async Task<IActionResult> ToggleItem(
        Guid tripId,
        Guid itemId,
        [FromBody] ToggleChecklistItemRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new ToggleChecklistItemCommand(tripId, itemId, request.IsCompleted),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpDelete("items/{itemId:guid}")]
    public async Task<IActionResult> DeleteItem(
        Guid tripId,
        Guid itemId,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new DeleteChecklistItemCommand(tripId, itemId),
            cancellationToken);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}
