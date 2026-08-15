namespace RidePlanner.Application.Features.Readiness.DTOs;

public sealed class ReadinessItemDto
{
    public string Key { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public bool IsPassed { get; set; }
    public bool IsRequired { get; set; }
    public string Message { get; set; } = string.Empty;
}

public sealed class TripReadinessDto
{
    public Guid TripId { get; set; }
    public int ScorePercentage { get; set; }
    public bool IsReady { get; set; }
    public IReadOnlyList<ReadinessItemDto> Items { get; set; } = [];
}
