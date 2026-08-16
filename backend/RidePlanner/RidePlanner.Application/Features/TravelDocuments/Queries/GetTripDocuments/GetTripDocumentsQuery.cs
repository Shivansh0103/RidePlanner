using MediatR;
using RidePlanner.Application.Features.TravelDocuments.DTOs;

namespace RidePlanner.Application.Features.TravelDocuments.Queries.GetTripDocuments;

public sealed record GetTripDocumentsQuery(Guid TripId) : IRequest<IReadOnlyList<TripDocumentDto>?>;
