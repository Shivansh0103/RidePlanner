namespace RidePlanner.Application.Features.Checklists.Commands.CreateCategory;

public sealed record CreateChecklistCategoryCommand(
    Guid TripId,
    string Name);
