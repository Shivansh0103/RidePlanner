namespace RidePlanner.Application.Features.Checklists.Commands.DeleteCategory;

public sealed record DeleteChecklistCategoryCommand(
    Guid TripId,
    Guid CategoryId);
