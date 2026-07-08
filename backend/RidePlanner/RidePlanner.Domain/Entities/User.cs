using RidePlanner.Domain.Common;
using RidePlanner.Domain.Exceptions;
using RidePlanner.Domain.ValueObjects;

namespace RidePlanner.Domain.Entities;

public class User : Entity
{
    public string Name { get; private set; }

    public Email Email { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    private User(string name, Email email, Guid id)
    {
        Id= id;
        Name = name;
        Email = email;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public static User Create(string name,Email email)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("User Name should not be empty");
        return new User(name,email,Guid.NewGuid());
    }
}