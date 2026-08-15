using RidePlanner.Domain.Common;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Entities;

public class EmergencyContact : Entity
{
    public Guid TripId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string Relationship { get; private set; } = string.Empty;

    public string Phone { get; private set; } = string.Empty;

    public string? AlternatePhone { get; private set; }

    public string? Email { get; private set; }

    public bool IsPrimary { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public Trip Trip { get; private set; } = null!;

    private EmergencyContact()
    {
    }

    public EmergencyContact(
        Guid tripId,
        string name,
        string relationship,
        string phone,
        string? alternatePhone = null,
        string? email = null,
        bool isPrimary = false)
    {
        Validate(name, relationship, phone);

        Id = Guid.NewGuid();
        TripId = tripId;
        Name = name.Trim();
        Relationship = relationship.Trim();
        Phone = phone.Trim();
        AlternatePhone = alternatePhone?.Trim();
        Email = email?.Trim();
        IsPrimary = isPrimary;
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Update(
        string name,
        string relationship,
        string phone,
        string? alternatePhone = null,
        string? email = null,
        bool isPrimary = false)
    {
        Validate(name, relationship, phone);

        Name = name.Trim();
        Relationship = relationship.Trim();
        Phone = phone.Trim();
        AlternatePhone = alternatePhone?.Trim();
        Email = email?.Trim();
        IsPrimary = isPrimary;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void SetPrimary(bool isPrimary)
    {
        IsPrimary = isPrimary;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    private static void Validate(string name, string relationship, string phone)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Contact name cannot be empty.");

        if (string.IsNullOrWhiteSpace(relationship))
            throw new DomainException("Relationship cannot be empty.");

        if (string.IsNullOrWhiteSpace(phone))
            throw new DomainException("Phone number cannot be empty.");
    }
}
