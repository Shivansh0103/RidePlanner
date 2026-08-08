using RidePlanner.Domain.Common;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Entities.Checklist;

public class ChecklistItem : Entity
{
    public Guid CategoryId { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public bool IsCompleted { get; private set; }

    public int DisplayOrder { get; private set; }

    public ChecklistCategory Category { get; private set; } = null!;

    private ChecklistItem()
    {
    }

    public ChecklistItem(
        Guid categoryId,
        string title,
        int displayOrder,
        bool isCompleted = false)
    {
        Validate(title, displayOrder);

        Id = Guid.NewGuid();
        CategoryId = categoryId;
        Title = title;
        DisplayOrder = displayOrder;
        IsCompleted = isCompleted;
    }

    public void Update(string title, int displayOrder)
    {
        Validate(title, displayOrder);

        Title = title;
        DisplayOrder = displayOrder;
    }

    public void ToggleCompletion()
    {
        IsCompleted = !IsCompleted;
    }

    public void SetCompleted(bool isCompleted)
    {
        IsCompleted = isCompleted;
    }

    private static void Validate(string title, int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Checklist item title cannot be empty.");

        if (displayOrder <= 0)
            throw new DomainException("Display order must be greater than zero.");
    }
}
