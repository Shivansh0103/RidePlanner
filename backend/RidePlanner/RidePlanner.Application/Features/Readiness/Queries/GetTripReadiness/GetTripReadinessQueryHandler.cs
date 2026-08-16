using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Readiness.DTOs;
using RidePlanner.Domain.ValueObjects;

namespace RidePlanner.Application.Features.Readiness.Queries.GetTripReadiness;

public sealed class GetTripReadinessQueryHandler : IRequestHandler<GetTripReadinessQuery, TripReadinessDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _stopRepository;
    private readonly IChecklistRepository _checklistRepository;
    private readonly ITripDocumentRepository _documentRepository;
    private readonly IEmergencyContactRepository _contactRepository;
    private readonly IAccommodationRepository _accommodationRepository;

    public GetTripReadinessQueryHandler(
        ITripRepository tripRepository,
        ITripStopRepository stopRepository,
        IChecklistRepository checklistRepository,
        ITripDocumentRepository documentRepository,
        IEmergencyContactRepository contactRepository,
        IAccommodationRepository accommodationRepository)
    {
        _tripRepository = tripRepository;
        _stopRepository = stopRepository;
        _checklistRepository = checklistRepository;
        _documentRepository = documentRepository;
        _contactRepository = contactRepository;
        _accommodationRepository = accommodationRepository;
    }

    public async Task<TripReadinessDto?> Handle(
        GetTripReadinessQuery request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(request.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var stops = await _stopRepository.GetByTripIdAsync(request.TripId, cancellationToken);
        var categories = await _checklistRepository.GetCategoriesByTripIdAsync(request.TripId, cancellationToken);
        var documents = await _documentRepository.GetByTripIdAsync(request.TripId, cancellationToken);

        var contacts = await _contactRepository.GetByTripIdAsync(request.TripId, cancellationToken);
        var accommodations = await _accommodationRepository.GetByTripIdAsync(request.TripId, cancellationToken);

        var items = new List<ReadinessItem>();

        // 1. Route & Stops
        var hasRoute = stops.Count > 0;
        items.Add(new ReadinessItem(
            "Route",
            "Route & Stops",
            isPassed: hasRoute,
            isRequired: true,
            message: hasRoute
                ? $"Configured with {stops.Count} {(stops.Count == 1 ? "stop" : "stops")}."
                : "No stops added to itinerary yet."));

        // 2. Checklist & Gear
        var allChecklistItems = categories.SelectMany(c => c.Items).ToList();
        var requiredChecklistItems = allChecklistItems.Where(i => i.IsRequired).ToList();
        var isChecklistPassed = requiredChecklistItems.Count > 0 && requiredChecklistItems.All(i => i.IsCompleted);
        var packedCount = requiredChecklistItems.Count(i => i.IsCompleted);

        items.Add(new ReadinessItem(
            "Checklist",
            "Checklist & Gear",
            isPassed: isChecklistPassed,
            isRequired: true,
            message: requiredChecklistItems.Count == 0
                ? "No required checklist items defined."
                : isChecklistPassed
                    ? $"All {requiredChecklistItems.Count} required gear items packed."
                    : $"{packedCount} of {requiredChecklistItems.Count} required items packed."));

        // 3. Travel Documents
        var hasDocuments = documents.Count > 0;
        var expiredCount = documents.Count(d => d.ExpiryDate.HasValue && d.ExpiryDate.Value.Date < DateTimeOffset.UtcNow.Date);
        var isDocumentsPassed = hasDocuments && expiredCount == 0;

        items.Add(new ReadinessItem(
            "Documents",
            "Travel Documents",
            isPassed: isDocumentsPassed,
            isRequired: true,
            message: !hasDocuments
                ? "No travel documents stored."
                : expiredCount > 0
                    ? $"{expiredCount} document(s) expired."
                    : $"{documents.Count} valid document(s) stored."));

        // 4. Emergency Contacts
        var hasContacts = contacts.Count > 0;
        var primaryContact = contacts.FirstOrDefault(c => c.IsPrimary);

        items.Add(new ReadinessItem(
            "Contacts",
            "Emergency Contacts",
            isPassed: hasContacts,
            isRequired: false,
            message: !hasContacts
                ? "No emergency contacts added."
                : primaryContact != null
                    ? $"Primary contact: {primaryContact.Name} ({primaryContact.Phone})."
                    : $"{contacts.Count} contact(s) added."));

        // 5. Accommodations
        var isAccommodationsPassed = accommodations.Count > 0 || stops.Count <= 1;

        items.Add(new ReadinessItem(
            "Accommodations",
            "Stay Reservations",
            isPassed: isAccommodationsPassed,
            isRequired: false,
            message: accommodations.Count > 0
                ? $"{accommodations.Count} stay reservation(s) booked."
                : stops.Count <= 1
                    ? "Single day ride - no accommodation required."
                    : "Multi-day ride - no stay reservations booked yet."));

        // 6. Budget Target
        var targetBudget = trip.Budget?.TargetBudget ?? 0m;
        var hasBudgetDefined = targetBudget > 0m;

        items.Add(new ReadinessItem(
            "Budget",
            "Budget Target",
            isPassed: hasBudgetDefined,
            isRequired: false,
            message: hasBudgetDefined
                ? $"Target budget set to ₹{targetBudget.ToString("N0")}."
                : "No target budget set for trip."));

        var domainReadiness = new TripReadiness(items);

        return new TripReadinessDto
        {
            TripId = request.TripId,
            ScorePercentage = domainReadiness.ScorePercentage,
            IsReady = domainReadiness.IsReady,
            Items = domainReadiness.Items.Select(i => new ReadinessItemDto
            {
                Key = i.Key,
                Title = i.Title,
                IsPassed = i.IsPassed,
                IsRequired = i.IsRequired,
                Message = i.Message,
            }).ToList(),
        };
    }
}
