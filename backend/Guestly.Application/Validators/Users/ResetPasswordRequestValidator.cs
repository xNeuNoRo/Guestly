using FluentValidation;
using Guestly.Application.DTOs.Users;

namespace Guestly.Application.Validators.Users;

/// <summary>
/// Valida las propiedades del ResetPasswordRequest para asegurar que el correo electrónico tenga un formato válido,
/// que el token de restablecimiento de contraseña sea proporcionado, y que la nueva contraseña
/// cumpla con los requisitos de seguridad, incluyendo longitud mínima, uso de mayúsculas, minúsculas,
/// números y caracteres especiales.
/// </summary>
public class ResetPasswordRequestValidator : AbstractValidator<ResetPasswordRequest>
{
    public ResetPasswordRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("El correo electrónico es obligatorio.")
            .EmailAddress()
            .WithMessage("El correo electrónico no es válido.");

        RuleFor(x => x.Token).NotEmpty().WithMessage("El token es obligatorio.");

        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .WithMessage("La nueva contraseña es obligatoria.")
            .MinimumLength(8)
            .WithMessage("La nueva contraseña debe tener al menos 8 caracteres.")
            .Matches("[A-Z]")
            .WithMessage("La nueva contraseña debe contener al menos una letra mayúscula.")
            .Matches("[a-z]")
            .WithMessage("La nueva contraseña debe contener al menos una letra minúscula.")
            .Matches("[0-9]")
            .WithMessage("La nueva contraseña debe contener al menos un número.")
            .Matches("[^a-zA-Z0-9]")
            .WithMessage("La nueva contraseña debe contener al menos un carácter especial.");

        RuleFor(x => x.ConfirmNewPassword)
            .NotEmpty()
            .WithMessage("Debes confirmar tu nueva contraseña.")
            .Equal(x => x.NewPassword)
            .WithMessage(
                "La confirmación de la nueva contraseña no coincide con la nueva contraseña."
            );
    }
}
