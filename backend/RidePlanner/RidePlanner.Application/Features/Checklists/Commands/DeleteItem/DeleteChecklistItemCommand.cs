using MediatR;
using RidePlanner.Application.Features.Checklists.DTOs;

namespace RidePlanner.Application.Features.Checklists.Commands.DeleteItem;

public sealed record DeleteChecklistItemCommand(
    Guid TripId,
    Guid ItemId) : IRequest<ChecklistSummaryDto?>;
