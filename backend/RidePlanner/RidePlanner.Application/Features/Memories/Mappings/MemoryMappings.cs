using RidePlanner.Application.Features.Memories.DTOs;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Memories.Mappings;

public static class MemoryMappings
{
    public static TripMemoryDto ToDto(this TripMemory memory)
    {
        return new TripMemoryDto
        {
            Id = memory.Id,
            TripId = memory.TripId,
            Title = memory.Title,
            Content = memory.Content,
            ImageUrl = memory.ImageUrl,
            OdometerReadingKm = memory.OdometerReadingKm,
            MemoryDate = memory.MemoryDate,
            CreatedAt = memory.CreatedAt,
            UpdatedAt = memory.UpdatedAt,
        };
    }
}
