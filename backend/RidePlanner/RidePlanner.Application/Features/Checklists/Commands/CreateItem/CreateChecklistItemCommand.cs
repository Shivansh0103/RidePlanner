namespace RidePlanner.Application.Features.Checklists.Commands.CreateItem;

public sealed record CreateChecklistItemCommand(
    Guid TripId,
    Guid CategoryId,
    string Title);
