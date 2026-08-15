using RidePlanner.Domain.Common;
using RidePlanner.Domain.Entities.Budget;
using RidePlanner.Domain.Entities.Checklist;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Entities;

public class Trip : Entity
{
    private readonly List<ChecklistCategory> _checklistCategories = [];

    public string Name { get; private set; }

    public string? Description { get; private set; }

    public DateOnly StartDate { get; private set; }

    public DateOnly EndDate { get; private set; }

    public TripStatus Status { get; private set; } = TripStatus.Planning;

    public DateTimeOffset? StartedAt { get; private set; }

    public DateTimeOffset? CompletedAt { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public ICollection<TripStop> Stops { get; private set; } = [];

    public ICollection<Accommodation> Accommodations { get; private set; } = [];

    public ICollection<TripDocument> Documents { get; private set; } = [];

    public ICollection<EmergencyContact> EmergencyContacts { get; private set; } = [];

    public TripBudget Budget { get; private set; } = null!;


    public IReadOnlyCollection<ChecklistCategory> ChecklistCategories =>
        _checklistCategories.AsReadOnly();


    private Trip(
        Guid id,
        string name,
        string? description,
        DateOnly startDate,
        DateOnly endDate)
    {
        Id = id;
        Name = name;
        Description = description;
        StartDate = startDate;
        EndDate = endDate;
        Status = TripStatus.Planning;
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public static Trip Create(
        string name,
        string? description,
        DateOnly startDate,
        DateOnly endDate)
    {
        Validate(name, startDate, endDate);

        return new Trip(
            Guid.NewGuid(),
            name,
            description,
            startDate,
            endDate);
    }

    public void Update(
        string name,
        string? description,
        DateOnly startDate,
        DateOnly endDate)
    {
        Validate(name, startDate, endDate);

        Name = name;
        Description = description;
        StartDate = startDate;
        EndDate = endDate;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Start(DateTimeOffset? actualStart = null)
    {
        if (Status == TripStatus.Completed)
            throw new DomainException("Completed trips cannot be started.");

        Status = TripStatus.Active;
        StartedAt = actualStart ?? DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void AutoActivate()
    {
        if (Status == TripStatus.Planning)
        {
            Status = TripStatus.Active;
            UpdatedAt = DateTimeOffset.UtcNow;
        }
    }

    public void Complete(DateTimeOffset? actualCompletion = null)
    {
        if (Status == TripStatus.Completed)
            throw new DomainException("Trip is already completed.");

        Status = TripStatus.Completed;
        CompletedAt = actualCompletion ?? DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    private static void Validate(
        string name,
        DateOnly startDate,
        DateOnly endDate)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Trip name cannot be empty.");

        if (endDate < startDate)
            throw new DomainException("End date cannot be before start date.");
    }

    public void InitializeBudget()
    {
        Budget ??= new TripBudget(Id);
    }

    public void InitializeDefaultChecklist()
    {
        if (_checklistCategories.Count == 0)
        {
            _checklistCategories.AddRange(ChecklistDefaults.CreateDefaultCategories(Id));
        }
    }

    private Trip()
    {
        Name = null!;
        Stops = [];
        Status = TripStatus.Planning;
    }
}
