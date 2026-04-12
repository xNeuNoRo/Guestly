using FluentValidation;
using Guestly.Application.DTOs.Auth;

namespace Guestly.Application.Validators.Auth;

/// <summary>
/// Valida las propiedades del LoginRequest para asegurar que el correo electrónico y
/// la contraseña sean proporcionados y tengan un formato válido.
/// </summary>
public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("El correo electrónico es obligatorio.")
            .EmailAddress()
            .WithMessage("El correo electrónico no es válido.");

        RuleFor(x => x.Password).NotEmpty().WithMessage("La contraseña es obligatoria.");
    }
}
