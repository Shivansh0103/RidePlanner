namespace RidePlanner.Domain.ValueObjects;

public class ReadinessItem
{
    public string Key { get; }
    public string Title { get; }
    public bool IsPassed { get; }
    public bool IsRequired { get; }
    public string Message { get; }

    public ReadinessItem(string key, string title, bool isPassed, bool isRequired, string message)
    {
        Key = key;
        Title = title;
        IsPassed = isPassed;
        IsRequired = isRequired;
        Message = message;
    }
}

public class TripReadiness
{
    public int ScorePercentage { get; }
    public bool IsReady { get; }
    public IReadOnlyList<ReadinessItem> Items { get; }

    public TripReadiness(IReadOnlyList<ReadinessItem> items)
    {
        Items = items;

        if (items.Count == 0)
        {
            ScorePercentage = 100;
            IsReady = true;
            return;
        }

        var passedCount = items.Count(x => x.IsPassed);
        ScorePercentage = (int)Math.Round((double)passedCount / items.Count * 100);

        var requiredItems = items.Where(x => x.IsRequired).ToList();
        IsReady = requiredItems.All(x => x.IsPassed);
    }
}
