using RidePlanner.Domain.Common;
using RidePlanner.Domain.Entities.Budget;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Entities;

public class Accommodation : Entity
{
    public Guid TripId { get; private set; }

    public Guid TripStopId { get; private set; }

    public AccommodationType Type { get; private set; }

    public DateOnly CheckInDate { get; private set; }

    public DateOnly CheckOutDate { get; private set; }

    public TimeOnly? CheckInTime { get; private set; }

    public TimeOnly? CheckOutTime { get; private set; }

    public int Nights => CheckOutDate.DayNumber - CheckInDate.DayNumber;

    public string? ConfirmationNumber { get; private set; }

    public string? ContactName { get; private set; }

    public string? ContactPhone { get; private set; }

    public string? Website { get; private set; }

    public string? BookingNotes { get; private set; }

    public decimal Cost { get; private set; }

    public Trip Trip { get; private set; } = null!;

    public TripStop TripStop { get; private set; } = null!;

    public BudgetEstimate? BudgetEstimate { get; private set; }

    private Accommodation()
    {
    }

    private Accommodation(
        Guid id,
        Guid tripId,
        Guid tripStopId,
        AccommodationType type,
        DateOnly checkInDate,
        DateOnly checkOutDate,
        TimeOnly? checkInTime,
        TimeOnly? checkOutTime,
        string? confirmationNumber,
        string? contactName,
        string? contactPhone,
        string? website,
        string? bookingNotes,
        decimal cost)
    {
        Id = id;
        TripId = tripId;
        TripStopId = tripStopId;
        Type = type;
        CheckInDate = checkInDate;
        CheckOutDate = checkOutDate;
        CheckInTime = checkInTime;
        CheckOutTime = checkOutTime;
        ConfirmationNumber = confirmationNumber;
        ContactName = contactName;
        ContactPhone = contactPhone;
        Website = website;
        BookingNotes = bookingNotes;
        Cost = cost;
    }

    public static Accommodation Create(
        Guid tripId,
        Guid tripStopId,
        AccommodationType type,
        DateOnly checkInDate,
        DateOnly checkOutDate,
        TimeOnly? checkInTime,
        TimeOnly? checkOutTime,
        string? confirmationNumber,
        string? contactName,
        string? contactPhone,
        string? website,
        string? bookingNotes,
        decimal cost)
    {
        Validate(type, checkInDate, checkOutDate, cost);

        return new Accommodation(
            Guid.NewGuid(),
            tripId,
            tripStopId,
            type,
            checkInDate,
            checkOutDate,
            checkInTime,
            checkOutTime,
            confirmationNumber,
            contactName,
            contactPhone,
            website,
            bookingNotes,
            cost);
    }

    public void Update(
        AccommodationType type,
        DateOnly checkInDate,
        DateOnly checkOutDate,
        TimeOnly? checkInTime,
        TimeOnly? checkOutTime,
        string? confirmationNumber,
        string? contactName,
        string? contactPhone,
        string? website,
        string? bookingNotes,
        decimal cost)
    {
        Validate(type, checkInDate, checkOutDate, cost);

        Type = type;
        CheckInDate = checkInDate;
        CheckOutDate = checkOutDate;
        CheckInTime = checkInTime;
        CheckOutTime = checkOutTime;
        ConfirmationNumber = confirmationNumber;
        ContactName = contactName;
        ContactPhone = contactPhone;
        Website = website;
        BookingNotes = bookingNotes;
        Cost = cost;
    }

    private static void Validate(
        AccommodationType type,
        DateOnly checkInDate,
        DateOnly checkOutDate,
        decimal cost)
    {
        if (!Enum.IsDefined(type))
            throw new DomainException("Invalid accommodation type.");

        if (checkOutDate < checkInDate)
            throw new DomainException("Check-out date cannot be before check-in date.");

        if (cost < 0)
            throw new DomainException("Accommodation cost cannot be negative.");
    }
}
