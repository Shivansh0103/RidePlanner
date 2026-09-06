using FluentValidation;

namespace RidePlanner.Application.Features.Auth.Commands.LinkExternalAccount;

public sealed class LinkExternalAccountCommandValidator : AbstractValidator<LinkExternalAccountCommand>
{
    public LinkExternalAccountCommandValidator()
    {
        RuleFor(x => x.LinkTicket)
            .NotEmpty().WithMessage("Link ticket cannot be empty.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password cannot be empty.");
    }
}
