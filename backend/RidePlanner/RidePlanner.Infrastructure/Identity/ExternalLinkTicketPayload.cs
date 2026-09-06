namespace RidePlanner.Infrastructure.Identity;

public sealed record ExternalLinkTicketPayload(
    Guid TicketId,
    Guid UserId,
    string Email,
    string Provider,
    string ProviderKey,
    string? ReturnUrl,
    DateTimeOffset CreatedAtUtc);
