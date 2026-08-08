namespace RidePlanner.Application.Features.Checklists.Commands.UpdateItem;

public sealed record UpdateChecklistItemCommand(
    Guid TripId,
    Guid ItemId,
    string Title);
