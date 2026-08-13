namespace RidePlanner.Application.Features.Checklists.DTOs;

public sealed class CreateChecklistItemRequest
{
    public Guid CategoryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsRequired { get; set; } = true;
}

