using RidePlanner.Domain.Common;
using RidePlanner.Domain.Exceptions;

public class TripStop : Entity
{
    public Guid TripId { get; private set; }

    public string Name { get; private set; }

    public DateOnly ArrivalDate { get; private set; }

    public DateOnly DepartureDate { get; private set; }

    public string? Notes { get; private set; }

    public int DisplayOrder { get; private set; }

    public Trip Trip { get; private set; } = null!;

    private TripStop(
        Guid id,
        Guid tripId,
        string name,
        DateOnly arrivalDate,
        DateOnly departureDate,
        string? notes,
        int displayOrder)
    {
        Id = id;
        TripId = tripId;
        Name = name;
        ArrivalDate = arrivalDate;
        DepartureDate = departureDate;
        Notes = notes;
        DisplayOrder = displayOrder;
    }

    public static TripStop Create(
        Guid tripId,
        string name,
        DateOnly arrivalDate,
        DateOnly departureDate,
        string? notes,
        int displayOrder)
    {
        Validate(name, arrivalDate, departureDate);

        return new TripStop(
            Guid.NewGuid(),
            tripId,
            name,
            arrivalDate,
            departureDate,
            notes,
            displayOrder);
    }

    public void Update(
        string name,
        DateOnly arrivalDate,
        DateOnly departureDate,
        string? notes,
        int displayOrder)
    {
        Validate(name, arrivalDate, departureDate);

        Name = name;
        ArrivalDate = arrivalDate;
        DepartureDate = departureDate;
        Notes = notes;
        DisplayOrder = displayOrder;
    }

    private static void Validate(
        string name,
        DateOnly arrivalDate,
        DateOnly departureDate)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Stop name cannot be empty.");

        if (departureDate < arrivalDate)
            throw new DomainException("Departure date cannot be before arrival date.");
    }

    private TripStop()
    {
        Name = null!;
    }
}