using FluentValidation;
using Guestly.Application.DTOs.Users;

namespace Guestly.Application.Validators.Users;

public class UpdateUserProfileRequestValidator : AbstractValidator<UpdateUserProfileRequest>
{
    public UpdateUserProfileRequestValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("El nombre es obligatorio.")
            .MaximumLength(255)
            .WithMessage("El nombre no puede exceder los 255 caracteres.");

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("El apellido es obligatorio.")
            .MaximumLength(255)
            .WithMessage("El apellido no puede exceder los 255 caracteres.");
    }
}
