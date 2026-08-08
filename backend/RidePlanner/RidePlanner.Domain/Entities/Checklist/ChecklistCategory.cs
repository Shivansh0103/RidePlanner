using RidePlanner.Domain.Common;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Entities.Checklist;

public class ChecklistCategory : Entity
{
    private readonly List<ChecklistItem> _items = [];

    public Guid TripId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public int DisplayOrder { get; private set; }

    public Trip Trip { get; private set; } = null!;

    public IReadOnlyCollection<ChecklistItem> Items => _items.AsReadOnly();

    private ChecklistCategory()
    {
    }

    public ChecklistCategory(
        Guid tripId,
        string name,
        int displayOrder)
    {
        Validate(name, displayOrder);

        Id = Guid.NewGuid();
        TripId = tripId;
        Name = name;
        DisplayOrder = displayOrder;
    }

    public void Update(string name, int displayOrder)
    {
        Validate(name, displayOrder);

        Name = name;
        DisplayOrder = displayOrder;
    }

    public ChecklistItem AddItem(string title, int displayOrder, bool isCompleted = false)
    {
        var item = new ChecklistItem(Id, title, displayOrder, isCompleted);
        _items.Add(item);
        return item;
    }

    public bool RemoveItem(Guid itemId)
    {
        var item = _items.FirstOrDefault(x => x.Id == itemId);
        if (item is null)
            return false;

        _items.Remove(item);
        return true;
    }

    private static void Validate(string name, int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Category name cannot be empty.");

        if (displayOrder <= 0)
            throw new DomainException("Display order must be greater than zero.");
    }
}
