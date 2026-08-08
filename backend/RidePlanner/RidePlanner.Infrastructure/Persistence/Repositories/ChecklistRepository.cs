using Microsoft.EntityFrameworkCore;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities.Checklist;

namespace RidePlanner.Infrastructure.Persistence.Repositories;

public sealed class ChecklistRepository : IChecklistRepository
{
    private readonly RidePlannerDbContext _dbContext;

    public ChecklistRepository(RidePlannerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ChecklistCategory>> GetCategoriesByTripIdAsync(
        Guid tripId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.ChecklistCategories
            .Include(c => c.Items)
            .Where(c => c.TripId == tripId)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<ChecklistCategory?> GetCategoryByIdAsync(
        Guid categoryId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.ChecklistCategories
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.Id == categoryId, cancellationToken);
    }

    public async Task<ChecklistItem?> GetItemByIdAsync(
        Guid itemId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.ChecklistItems
            .Include(i => i.Category)
            .FirstOrDefaultAsync(i => i.Id == itemId, cancellationToken);
    }

    public void AddCategory(ChecklistCategory category)
    {
        _dbContext.ChecklistCategories.Add(category);
    }

    public void RemoveCategory(ChecklistCategory category)
    {
        _dbContext.ChecklistCategories.Remove(category);
    }

    public void AddItem(ChecklistItem item)
    {
        _dbContext.ChecklistItems.Add(item);
    }

    public void RemoveItem(ChecklistItem item)
    {
        _dbContext.ChecklistItems.Remove(item);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
