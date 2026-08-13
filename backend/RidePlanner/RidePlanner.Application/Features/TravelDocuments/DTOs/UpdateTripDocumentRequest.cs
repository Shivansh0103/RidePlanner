namespace RidePlanner.Application.Features.TravelDocuments.DTOs;

public sealed class UpdateTripDocumentRequest
{
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? DocumentNumber { get; set; }
    public DateTimeOffset? ExpiryDate { get; set; }
    public string? FilePath { get; set; }
    public string? Notes { get; set; }
}
