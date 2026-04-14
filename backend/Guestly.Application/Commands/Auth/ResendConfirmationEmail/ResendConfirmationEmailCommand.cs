using MediatR;

namespace Guestly.Application.Commands.Auth.ResendConfirmationEmail;

public record ResendConfirmationEmailCommand(string Email) : IRequest<bool>;
