namespace RidePlanner.Application.Features.Checklists.Commands.DeleteItem;

public sealed record DeleteChecklistItemCommand(
    Guid TripId,
    Guid ItemId);
