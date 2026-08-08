using RidePlanner.Domain.Entities.Checklist;

namespace RidePlanner.Application.Abstractions.Persistence;

public interface IChecklistRepository
{
    Task<IReadOnlyList<ChecklistCategory>> GetCategoriesByTripIdAsync(
        Guid tripId,
        CancellationToken cancellationToken = default);

    Task<ChecklistCategory?> GetCategoryByIdAsync(
        Guid categoryId,
        CancellationToken cancellationToken = default);

    Task<ChecklistItem?> GetItemByIdAsync(
        Guid itemId,
        CancellationToken cancellationToken = default);

    void AddCategory(ChecklistCategory category);

    void RemoveCategory(ChecklistCategory category);

    void AddItem(ChecklistItem item);

    void RemoveItem(ChecklistItem item);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
