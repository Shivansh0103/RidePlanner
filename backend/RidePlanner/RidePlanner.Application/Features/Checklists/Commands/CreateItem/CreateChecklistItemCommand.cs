using MediatR;
using RidePlanner.Application.Features.Checklists.DTOs;

namespace RidePlanner.Application.Features.Checklists.Commands.CreateItem;

public sealed record CreateChecklistItemCommand(
    Guid TripId,
    Guid CategoryId,
    string Title,
    bool IsRequired = true) : IRequest<ChecklistSummaryDto?>;
