namespace RidePlanner.Application.Features.Checklists.DTOs;

public sealed class ChecklistSummaryDto
{
    public Guid TripId { get; set; }
    public int TotalItemsCount { get; set; }
    public int CompletedItemsCount { get; set; }
    public double CompletionPercentage { get; set; }
    public List<ChecklistCategoryDto> Categories { get; set; } = [];
}
