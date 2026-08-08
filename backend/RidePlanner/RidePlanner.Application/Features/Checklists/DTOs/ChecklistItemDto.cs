namespace RidePlanner.Application.Features.Checklists.DTOs;

public sealed class ChecklistItemDto
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public int DisplayOrder { get; set; }
}
