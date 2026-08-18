using RidePlanner.Domain.Common;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Entities;

public class TripDocument : Entity, IAuditableEntity
{
    public Guid TripId { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string Type { get; private set; } = string.Empty;

    public string? DocumentNumber { get; private set; }

    public DateTimeOffset? ExpiryDate { get; private set; }

    public string? FilePath { get; private set; }

    public string? Notes { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public Trip Trip { get; private set; } = null!;

    private TripDocument()
    {
    }

    public TripDocument(
        Guid tripId,
        string title,
        string type,
        string? documentNumber = null,
        DateTimeOffset? expiryDate = null,
        string? filePath = null,
        string? notes = null)
    {
        Validate(title, type);

        Id = Guid.NewGuid();
        TripId = tripId;
        Title = title.Trim();
        Type = type.Trim();
        DocumentNumber = documentNumber?.Trim();
        ExpiryDate = expiryDate;
        FilePath = filePath?.Trim();
        Notes = notes?.Trim();
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Update(
        string title,
        string type,
        string? documentNumber = null,
        DateTimeOffset? expiryDate = null,
        string? filePath = null,
        string? notes = null)
    {
        Validate(title, type);

        Title = title.Trim();
        Type = type.Trim();
        DocumentNumber = documentNumber?.Trim();
        ExpiryDate = expiryDate;
        FilePath = filePath?.Trim();
        Notes = notes?.Trim();
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    private static void Validate(string title, string type)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Document title cannot be empty.");

        if (string.IsNullOrWhiteSpace(type))
            throw new DomainException("Document type cannot be empty.");
    }
}
