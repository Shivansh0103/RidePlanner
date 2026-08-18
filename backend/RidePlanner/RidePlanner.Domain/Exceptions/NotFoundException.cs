namespace RidePlanner.Domain.Exceptions;

public class NotFoundException : DomainException
{
    public NotFoundException(string message)
        : base(message)
    {
    }

    public NotFoundException(string resourceName, object key)
        : base($"{resourceName} with key '{key}' was not found.")
    {
    }
}
