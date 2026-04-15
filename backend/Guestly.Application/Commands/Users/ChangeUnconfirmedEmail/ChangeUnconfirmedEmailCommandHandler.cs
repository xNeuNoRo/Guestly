using Guestly.Application.Interfaces.External;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Interfaces.Security;
using Guestly.Application.Models.Emails;
using Guestly.Domain.Entities.User;
using Guestly.Domain.Enums;
using Guestly.Domain.Exceptions;
using Guestly.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Guestly.Application.Commands.Users.ChangeUnconfirmedEmail;

/// <summary>
/// Manejador del comando ChangeUnconfirmedEmailCommand, responsable de procesar la solicitud de
/// cambio de correo electrónico no confirmado de un usuario.
/// </summary>
public class ChangeUnconfirmedEmailCommandHandler
    : IRequestHandler<ChangeUnconfirmedEmailCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserTokenRepository _userTokenRepository;
    private readonly IRandomTokenGenerator _tokenGenerator;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public ChangeUnconfirmedEmailCommandHandler(
        IUserRepository userRepository,
        IUserTokenRepository userTokenRepository,
        IRandomTokenGenerator tokenGenerator,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork,
        IEmailService emailService,
        IConfiguration configuration
    )
    {
        _userRepository = userRepository;
        _userTokenRepository = userTokenRepository;
        _tokenGenerator = tokenGenerator;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
        _emailService = emailService;
        _configuration = configuration;
    }

    /// <summary>
    /// Manejador del comando ChangeUnconfirmedEmailCommand, que procesa la solicitud de
    /// cambio de correo electrónico no confirmado de un usuario.
    /// </summary>
    public async Task<bool> Handle(
        ChangeUnconfirmedEmailCommand request,
        CancellationToken cancellationToken
    )
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw AppException.NotFound("Usuario no encontrado.", ErrorCodes.UserNotFound);
        }

        if (user.IsEmailConfirmed)
        {
            throw AppException.Forbidden(
                "La cuenta ya está confirmada. Utiliza la opción de cambio de correo que requiere contraseña.",
                ErrorCodes.Forbidden
            );
        }

        var emailExists = await _userRepository.GetByEmailAsync(
            request.NewEmail,
            cancellationToken
        );
        if (emailExists is not null)
        {
            throw AppException.Conflict(
                "El nuevo correo electrónico ya está en uso.",
                ErrorCodes.EmailAlreadyExists
            );
        }

        user.UpdateEmail(request.NewEmail);
        await _userTokenRepository.RemoveExistingTokensAsync(
            user.Id,
            TokenTypes.EmailConfirmation,
            cancellationToken
        );

        var tokenString = _tokenGenerator.Generate();
        var expiresAt = _dateTimeProvider.UtcNow.AddHours(24);
        var userToken = new UserToken(
            user.Id,
            tokenString,
            TokenTypes.EmailConfirmation,
            expiresAt
        );

        await _userTokenRepository.AddAsync(userToken, cancellationToken);

        _userRepository.Update(user);

        // UnitOfWork es inteligente y llamara a SaveChangesAsync()
        // siempre, de esa siempre se persisten los cambios.
        await _unitOfWork.CommitAsync(cancellationToken);

        var baseUrl = _configuration["FrontendSettings:BaseUrl"] ?? "http://localhost:3000";
        var confirmationLink =
            $"{baseUrl}/auth/confirm-email?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(tokenString)}";

        var emailModel = new ConfirmEmailModel(user.FirstName, confirmationLink);

        await _emailService.SendTemplateEmailAsync(
            user.Email,
            "Confirma tu nuevo correo en Guestly",
            EmailTemplate.EmailConfirmation,
            emailModel,
            cancellationToken
        );

        return true;
    }
}
