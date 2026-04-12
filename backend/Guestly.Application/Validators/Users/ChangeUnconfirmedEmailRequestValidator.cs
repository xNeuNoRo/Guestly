using FluentValidation;
using Guestly.Application.DTOs.Users;

namespace Guestly.Application.Validators.Users;

public class ChangeUnconfirmedEmailRequestValidator
    : AbstractValidator<ChangeUnconfirmedEmailRequest>
{
    public ChangeUnconfirmedEmailRequestValidator()
    {
        RuleFor(x => x.NewEmail)
            .NotEmpty()
            .WithMessage("El nuevo correo electrónico es obligatorio.")
            .EmailAddress()
            .WithMessage("El nuevo correo electrónico no es válido.")
            .MaximumLength(255)
            .WithMessage("El nuevo correo electrónico no puede exceder los 255 caracteres.");
    }
}
