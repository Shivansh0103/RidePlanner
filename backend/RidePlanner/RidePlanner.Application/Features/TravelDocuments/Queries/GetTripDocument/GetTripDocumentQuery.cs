using MediatR;
using RidePlanner.Application.Features.TravelDocuments.DTOs;

namespace RidePlanner.Application.Features.TravelDocuments.Queries.GetTripDocument;

public sealed record GetTripDocumentQuery(Guid TripId, Guid DocumentId) : IRequest<TripDocumentDto?>;
