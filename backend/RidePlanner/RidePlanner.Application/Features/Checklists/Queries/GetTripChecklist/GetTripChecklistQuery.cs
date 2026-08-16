using MediatR;
using RidePlanner.Application.Features.Checklists.DTOs;

namespace RidePlanner.Application.Features.Checklists.Queries.GetTripChecklist;

public sealed record GetTripChecklistQuery(Guid TripId) : IRequest<ChecklistSummaryDto?>;
