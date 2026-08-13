namespace RidePlanner.Application.Features.Checklists.DTOs;

public sealed class UpdateChecklistItemRequest
{
    public string Title { get; set; } = string.Empty;
    public bool IsRequired { get; set; } = true;
}

