using RidePlanner.Domain.Common;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Entities;

public class TripMemory : Entity, IAuditableEntity
{
    public Guid TripId { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string? Content { get; private set; }

    public string? ImageUrl { get; private set; }

    public int? OdometerReadingKm { get; private set; }

    public DateTimeOffset MemoryDate { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public Trip Trip { get; private set; } = null!;

    private TripMemory()
    {
    }

    public TripMemory(
        Guid tripId,
        string title,
        string? content = null,
        string? imageUrl = null,
        int? odometerReadingKm = null,
        DateTimeOffset? memoryDate = null)
    {
        Validate(title, odometerReadingKm);

        Id = Guid.NewGuid();
        TripId = tripId;
        Title = title.Trim();
        Content = content?.Trim();
        ImageUrl = imageUrl?.Trim();
        OdometerReadingKm = odometerReadingKm;
        MemoryDate = memoryDate ?? DateTimeOffset.UtcNow;
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Update(
        string title,
        string? content = null,
        string? imageUrl = null,
        int? odometerReadingKm = null,
        DateTimeOffset? memoryDate = null)
    {
        Validate(title, odometerReadingKm);

        Title = title.Trim();
        Content = content?.Trim();
        ImageUrl = imageUrl?.Trim();
        OdometerReadingKm = odometerReadingKm;

        if (memoryDate.HasValue)
        {
            MemoryDate = memoryDate.Value;
        }

        UpdatedAt = DateTimeOffset.UtcNow;
    }

    private static void Validate(string title, int? odometerReadingKm)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Memory title cannot be empty.");

        if (odometerReadingKm.HasValue && odometerReadingKm.Value < 0)
            throw new DomainException("Odometer reading cannot be negative.");
    }
}
