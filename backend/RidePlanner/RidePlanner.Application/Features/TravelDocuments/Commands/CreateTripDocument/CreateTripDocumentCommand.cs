using MediatR;
using RidePlanner.Application.Features.TravelDocuments.DTOs;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.CreateTripDocument;

public sealed record CreateTripDocumentCommand(
    Guid TripId,
    string Title,
    string Type,
    string? DocumentNumber = null,
    DateTimeOffset? ExpiryDate = null,
    string? FilePath = null,
    string? Notes = null) : IRequest<TripDocumentDto?>;
