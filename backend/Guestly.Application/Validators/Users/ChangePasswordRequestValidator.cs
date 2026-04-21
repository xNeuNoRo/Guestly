using FluentValidation;
using Guestly.Application.DTOs.Users;

namespace Guestly.Application.Validators.Users;

/// <summary>
/// Valida las propiedades del ChangePasswordRequest para asegurar que la contraseña actual sea proporcionada,
/// que la nueva contraseña cumpla con los requisitos de seguridad (longitud mínima, inclusión de
/// mayúsculas, minúsculas, números y caracteres especiales), y que la confirmación de la nueva contraseña
/// coincida con la nueva contraseña.
/// </summary>
public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordRequestValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty()
            .WithMessage(
                "Debes ingresar tu contraseña actual para autorizar el cambio de contraseña."
            );

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
