using Guestly.Application.DTOs.Auth;
using Guestly.Domain.Enums;
using MediatR;

namespace Guestly.Application.Commands.Auth.Register;

public record RegisterUserCommand(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    UserRoles Role
) : IRequest<AuthResponse>;
