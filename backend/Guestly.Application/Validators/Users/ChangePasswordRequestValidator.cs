using FluentValidation;
using Guestly.Application.DTOs.Users;

namespace Guestly.Application.Validators.Users;

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
