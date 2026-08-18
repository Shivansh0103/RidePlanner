using FluentValidation;

namespace RidePlanner.Application.Features.Memories.Commands.CreateTripMemory;

public sealed class CreateTripMemoryCommandValidator : AbstractValidator<CreateTripMemoryCommand>
{
    public CreateTripMemoryCommandValidator()
    {
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.Title).NotEmpty().WithMessage("Memory title cannot be empty.");
    }
}
