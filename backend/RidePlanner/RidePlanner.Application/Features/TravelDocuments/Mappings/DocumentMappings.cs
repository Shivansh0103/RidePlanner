using RidePlanner.Application.Features.TravelDocuments.DTOs;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.TravelDocuments.Mappings;

public static class DocumentMappings
{
    public static TripDocumentDto ToDto(this TripDocument doc)
    {
        return new TripDocumentDto
        {
            Id = doc.Id,
            TripId = doc.TripId,
            Title = doc.Title,
            Type = doc.Type,
            DocumentNumber = doc.DocumentNumber,
            ExpiryDate = doc.ExpiryDate,
            FilePath = doc.FilePath,
            Notes = doc.Notes,
            CreatedAt = doc.CreatedAt,
            UpdatedAt = doc.UpdatedAt,
        };
    }
}
