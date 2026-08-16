using MediatR;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.DeleteTripDocument;

public sealed record DeleteTripDocumentCommand(
    Guid TripId,
    Guid DocumentId) : IRequest<bool>;
