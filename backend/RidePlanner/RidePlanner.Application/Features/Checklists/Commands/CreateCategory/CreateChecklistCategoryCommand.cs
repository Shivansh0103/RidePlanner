using MediatR;
using RidePlanner.Application.Features.Checklists.DTOs;

namespace RidePlanner.Application.Features.Checklists.Commands.CreateCategory;

public sealed record CreateChecklistCategoryCommand(
    Guid TripId,
    string Name) : IRequest<ChecklistSummaryDto?>;
