using FluentValidation;
using Guestly.Application.DTOs.Users;
using Guestly.Domain.Enums;

namespace Guestly.Application.Validators.Users;

public class AddRoleRequestValidator : AbstractValidator<AddRoleRequest>
{
    public AddRoleRequestValidator()
    {
        RuleFor(x => x.RoleToAdd)
            .IsInEnum()
            .WithMessage("El rol especificado no es válido.")
            .Must(r => r == UserRoles.Host || r == UserRoles.Guest)
            .WithMessage("Solo puedes solicitar agregar los roles básicos de Host o Guest.");
    }
}
