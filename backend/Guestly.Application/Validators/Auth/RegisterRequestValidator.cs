using FluentValidation;
using Guestly.Application.DTOs.Auth;

namespace Guestly.Application.Validators.Auth;

/// <summary>
/// Valida las propiedades del RegisterRequest para asegurar que el nombre, apellido, correo electrónico y
/// contraseña sean proporcionados y tengan un formato válido, además de cumplir con los requisitos de seguridad para la contraseña.
/// </summary>
public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("El nombre es obligatorio.")
            .MaximumLength(100)
            .WithMessage("El nombre no puede exceder los 100 caracteres.");

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("El apellido es obligatorio.")
            .MaximumLength(100)
            .WithMessage("El apellido no puede exceder los 100 caracteres.");

        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("El correo electrónico es obligatorio.")
            .EmailAddress()
            .WithMessage("El correo electrónico no es válido.")
            .MaximumLength(255)
            .WithMessage("El correo electrónico no puede exceder los 255 caracteres.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("La contraseña es obligatoria.")
            .MinimumLength(8)
            .WithMessage("La contraseña debe tener al menos 8 caracteres.")
            .Matches("[A-Z]")
            .WithMessage("La contraseña debe contener al menos una letra mayúscula.")
            .Matches("[a-z]")
            .WithMessage("La contraseña debe contener al menos una letra minúscula.")
            .Matches("[0-9]")
            .WithMessage("La contraseña debe contener al menos un número.")
            .Matches("[^a-zA-Z0-9]")
            .WithMessage("La contraseña debe contener al menos un carácter especial.");
    }
}
