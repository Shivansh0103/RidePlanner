namespace RidePlanner.Application.Features.Checklists.DTOs;

public sealed class ChecklistCategoryDto
{
    public Guid Id { get; set; }
    public Guid TripId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public int CompletedItemsCount { get; set; }
    public int TotalItemsCount { get; set; }
    public List<ChecklistItemDto> Items { get; set; } = [];
}
