namespace RidePlanner.Application.Features.Auth.DTOs;

public abstract record ProcessExternalLoginResult
{
    public sealed record Success(AuthResult AuthResult, string? ReturnUrl) : ProcessExternalLoginResult;

    public sealed record RequiresAccountLinking(string LinkTicket, string? ReturnUrl) : ProcessExternalLoginResult;

    public sealed record Failed(string ErrorMessage) : ProcessExternalLoginResult;
}
