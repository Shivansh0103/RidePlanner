using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Domain.Entities.Checklist;

namespace RidePlanner.Application.Features.Checklists.Mappings;

public static class ChecklistMappings
{
    public static ChecklistSummaryDto ToSummaryDto(this IReadOnlyList<ChecklistCategory> categories, Guid tripId)
    {
        var categoryDtos = categories
            .OrderBy(c => c.DisplayOrder)
            .Select(c => c.ToDto())
            .ToList();

        var totalItems = categoryDtos.Sum(c => c.TotalItemsCount);
        var completedItems = categoryDtos.Sum(c => c.CompletedItemsCount);
        var percentage = totalItems > 0 ? Math.Round((double)completedItems / totalItems * 100, 1) : 0;

        return new ChecklistSummaryDto
        {
            TripId = tripId,
            TotalItemsCount = totalItems,
            CompletedItemsCount = completedItems,
            CompletionPercentage = percentage,
            Categories = categoryDtos
        };
    }

    public static ChecklistCategoryDto ToDto(this ChecklistCategory category)
    {
        var items = category.Items
            .OrderBy(i => i.DisplayOrder)
            .Select(i => i.ToDto())
            .ToList();

        var total = items.Count;
        var completed = items.Count(i => i.IsCompleted);

        return new ChecklistCategoryDto
        {
            Id = category.Id,
            TripId = category.TripId,
            Name = category.Name,
            DisplayOrder = category.DisplayOrder,
            TotalItemsCount = total,
            CompletedItemsCount = completed,
            Items = items
        };
    }

    public static ChecklistItemDto ToDto(this ChecklistItem item)
    {
        return new ChecklistItemDto
        {
            Id = item.Id,
            CategoryId = item.CategoryId,
            Title = item.Title,
            IsCompleted = item.IsCompleted,
            DisplayOrder = item.DisplayOrder
        };
    }
}
