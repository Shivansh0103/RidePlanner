namespace RidePlanner.Application.Features.Memories.DTOs;

public sealed class TripMemoryDto
{
    public Guid Id { get; set; }
    public Guid TripId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public int? OdometerReadingKm { get; set; }
    public DateTimeOffset MemoryDate { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
