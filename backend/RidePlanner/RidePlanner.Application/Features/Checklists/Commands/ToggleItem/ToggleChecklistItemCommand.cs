using MediatR;
using RidePlanner.Application.Features.Checklists.DTOs;

namespace RidePlanner.Application.Features.Checklists.Commands.ToggleItem;

public sealed record ToggleChecklistItemCommand(
    Guid TripId,
    Guid ItemId,
    bool? IsCompleted) : IRequest<ChecklistSummaryDto?>;
