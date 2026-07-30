using RidePlanner.Domain.Common;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Entities;

public class TripStop : Entity
{
    public Guid TripId { get; private set; }

    public string Name { get; private set; }

    public TripStopCategory Category { get; private set; }

    public DateOnly ArrivalDate { get; private set; }

    public DateOnly DepartureDate { get; private set; }

    public string? Notes { get; private set; }

    public int DisplayOrder { get; private set; }

    public Trip Trip { get; private set; } = null!;

    private TripStop(
        Guid id,
        Guid tripId,
        string name,
        TripStopCategory category,
        DateOnly arrivalDate,
        DateOnly departureDate,
        string? notes,
        int displayOrder)
    {
        Id = id;
        TripId = tripId;
        Name = name;
        Category = category;
        ArrivalDate = arrivalDate;
        DepartureDate = departureDate;
        Notes = notes;
        DisplayOrder = displayOrder;
    }

    public static TripStop Create(
        Guid tripId,
        string name,
        TripStopCategory category,
        DateOnly arrivalDate,
        DateOnly departureDate,
        string? notes,
        int displayOrder)
    {
        Validate(
            name,
            category,
            arrivalDate,
            departureDate);

        return new TripStop(
            Guid.NewGuid(),
            tripId,
            name,
            category,
            arrivalDate,
            departureDate,
            notes,
            displayOrder);
    }

    public void Update(
        string name,
        TripStopCategory category,
        DateOnly arrivalDate,
        DateOnly departureDate,
        string? notes,
        int displayOrder)
    {
        Validate(
            name,
            category,
            arrivalDate,
            departureDate);

        Name = name;
        Category = category;
        ArrivalDate = arrivalDate;
        DepartureDate = departureDate;
        Notes = notes;
        DisplayOrder = displayOrder;
    }

    public void SetDisplayOrder(int displayOrder)
    {
        if (displayOrder <= 0)
            throw new DomainException("Display order must be greater than 0.");

        DisplayOrder = displayOrder;
    }

    private static void Validate(
        string name,
        TripStopCategory category,
        DateOnly arrivalDate,
        DateOnly departureDate)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Stop name cannot be empty.");

        if (!Enum.IsDefined(category))
            throw new DomainException("Invalid trip stop category.");

        if (departureDate < arrivalDate)
            throw new DomainException("Departure date cannot be before arrival date.");
    }

    private TripStop()
    {
        Name = null!;
    }
}