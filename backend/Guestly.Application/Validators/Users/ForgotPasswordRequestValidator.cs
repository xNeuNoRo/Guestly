using FluentValidation;
using Guestly.Application.DTOs.Users;

namespace Guestly.Application.Validators.Users;

/// <summary>
/// Valida las propiedades del ForgotPasswordRequest para asegurar que el correo electrónico sea proporcionado
/// y tenga un formato válido. Esta validación es crucial para garantizar que el proceso de recuperación
/// de contraseña se realice correctamente y que el sistema pueda enviar el correo de restablecimiento al usuario.
/// </summary>
public class ForgotPasswordRequestValidator : AbstractValidator<ForgotPasswordRequest>
{
    public ForgotPasswordRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("El correo electrónico es obligatorio.")
            .EmailAddress()
            .WithMessage("El correo electrónico no es válido.");
    }
}
