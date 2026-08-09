namespace RidePlanner.Application.Features.Accommodations.Commands.DeleteAccommodation;

public sealed record DeleteAccommodationCommand(Guid TripId, Guid Id);
