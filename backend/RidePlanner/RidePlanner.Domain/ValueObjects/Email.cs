using RidePlanner.Domain.Exceptions;
using System.Net.Mail;

namespace RidePlanner.Domain.ValueObjects;

public sealed record Email
{
    public string Value { get; }

    public Email(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException("Email cannot be empty.");

        value = value.Trim().ToLowerInvariant();

        try
        {
            _ = new MailAddress(value);
        }
        catch (FormatException)
        {
            throw new DomainException("Email format is invalid.");
        }

        Value = value;
    }

    public override string ToString() => Value;

}