using Guestly.Domain.Enums;
using MediatR;

namespace Guestly.Application.Commands.Auth.ResendConfirmationEmail;

public record ResendConfirmationEmailCommand(
    string Email,
    EmailVerificationFlow Flow = EmailVerificationFlow.Registration
) : IRequest<bool>;
