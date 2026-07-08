using RidePlanner.Domain.Common;
using RidePlanner.Domain.Exceptions;

public class User : Entity
{
    public string Name { get; private set; }

    public string Email { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    private User(string name, string email, Guid id)
    {
        Id= id;
        Name = name;
        Email = email;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public static User Create(string name,string email)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("User Name should not be empty");
        if (string.IsNullOrWhiteSpace(email))
            throw new DomainException("Email should not be empty");
        return new User(name,email,Guid.NewGuid());
    }
}