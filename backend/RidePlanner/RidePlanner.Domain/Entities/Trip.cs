using RidePlanner.Domain.Common;
using RidePlanner.Domain.Exceptions;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Entities.Budget;

public class Trip : Entity
{
    public string Name { get; private set; }

    public string? Description { get; private set; }

    public DateOnly StartDate { get; private set; }

    public DateOnly EndDate { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public ICollection<TripStop> Stops { get; private set; } = [];

    public TripBudget Budget { get; private set; } = null!;

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

    private Trip()
    {
        Name = null!;
        Stops = [];
    }
}