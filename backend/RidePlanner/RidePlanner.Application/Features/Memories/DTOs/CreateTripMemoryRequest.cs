namespace RidePlanner.Application.Features.Memories.DTOs;

public sealed class CreateTripMemoryRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public int? OdometerReadingKm { get; set; }
    public DateTimeOffset? MemoryDate { get; set; }
}
