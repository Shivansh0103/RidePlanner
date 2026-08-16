using MediatR;
using RidePlanner.Application.Features.Checklists.DTOs;

namespace RidePlanner.Application.Features.Checklists.Commands.UpdateCategory;

public sealed record UpdateChecklistCategoryCommand(
    Guid TripId,
    Guid CategoryId,
    string Name) : IRequest<ChecklistSummaryDto?>;
