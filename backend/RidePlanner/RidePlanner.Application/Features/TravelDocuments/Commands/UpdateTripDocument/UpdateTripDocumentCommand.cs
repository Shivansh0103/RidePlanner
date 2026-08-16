using MediatR;
using RidePlanner.Application.Features.TravelDocuments.DTOs;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.UpdateTripDocument;

public sealed record UpdateTripDocumentCommand(
    Guid TripId,
    Guid DocumentId,
    string Title,
    string Type,
    string? DocumentNumber = null,
    DateTimeOffset? ExpiryDate = null,
    string? FilePath = null,
    string? Notes = null) : IRequest<TripDocumentDto?>;
