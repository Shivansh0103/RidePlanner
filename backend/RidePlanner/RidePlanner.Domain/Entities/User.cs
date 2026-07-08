using RidePlanner.Domain.Common;

public class User : Entity
{
    public string Name { get; private set; }

    public string Email { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    private User()
    {
    }
}