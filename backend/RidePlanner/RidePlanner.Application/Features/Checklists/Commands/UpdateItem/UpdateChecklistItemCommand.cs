using MediatR;
using RidePlanner.Application.Features.Checklists.DTOs;

namespace RidePlanner.Application.Features.Checklists.Commands.UpdateItem;

public sealed record UpdateChecklistItemCommand(
    Guid TripId,
    Guid ItemId,
    string Title,
    bool IsRequired = true) : IRequest<ChecklistSummaryDto?>;
