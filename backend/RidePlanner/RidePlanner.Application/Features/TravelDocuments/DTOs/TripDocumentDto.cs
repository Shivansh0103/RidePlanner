namespace RidePlanner.Application.Features.TravelDocuments.DTOs;

public sealed class TripDocumentDto
{
    public Guid Id { get; set; }
    public Guid TripId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? DocumentNumber { get; set; }
    public DateTimeOffset? ExpiryDate { get; set; }
    public string? FilePath { get; set; }
    public string? Notes { get; set; }
    public bool IsExpired => ExpiryDate.HasValue && ExpiryDate.Value < DateTimeOffset.UtcNow;
    public bool IsExpiringSoon => ExpiryDate.HasValue && !IsExpired && ExpiryDate.Value <= DateTimeOffset.UtcNow.AddDays(30);
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
