using MediatR;
using RidePlanner.Application.Features.Checklists.DTOs;

namespace RidePlanner.Application.Features.Checklists.Commands.DeleteCategory;

public sealed record DeleteChecklistCategoryCommand(
    Guid TripId,
    Guid CategoryId) : IRequest<ChecklistSummaryDto?>;
