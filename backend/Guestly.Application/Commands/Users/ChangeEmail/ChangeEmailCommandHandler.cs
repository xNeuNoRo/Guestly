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

namespace Guestly.Application.Commands.Users.ChangeEmail;

/// <summary>
/// Manejador del comando ChangeEmailCommand, responsable de procesar la solicitud de cambio de correo electrónico de un usuario.
/// Este manejador interactúa con el repositorio de usuarios para obtener el usuario correspondiente, validar
/// la contraseña proporcionada, verificar que el nuevo correo electrónico no esté en uso por otro usuario, actualizar
/// el correo electrónico del usuario, generar un nuevo token de confirmación de correo electrónico, y
/// retornar un valor booleano indicando si el cambio de correo electrónico fue exitoso o no.
/// </summary>
public class ChangeEmailCommandHandler : IRequestHandler<ChangeEmailCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserTokenRepository _userTokenRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IRandomTokenGenerator _tokenGenerator;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public ChangeEmailCommandHandler(
        IUserRepository userRepository,
        IUserTokenRepository userTokenRepository,
        IPasswordHasher passwordHasher,
        IRandomTokenGenerator tokenGenerator,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork,
        IEmailService emailService,
        IConfiguration configuration
    )
    {
        _userRepository = userRepository;
        _userTokenRepository = userTokenRepository;
        _passwordHasher = passwordHasher;
        _tokenGenerator = tokenGenerator;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
        _emailService = emailService;
        _configuration = configuration;
    }

    /// <summary>
    /// Manejador del comando ChangeEmailCommand, que procesa la solicitud de cambio de correo electrónico de un usuario.
    /// </summary>
    public async Task<bool> Handle(ChangeEmailCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw AppException.NotFound("Usuario no encontrado.", ErrorCodes.UserNotFound);
        }

        if (!_passwordHasher.VerifyPassword(request.Password, user.Password))
        {
            throw AppException.Unauthorized(
                "La contraseña actual es incorrecta.",
                ErrorCodes.InvalidCredentials
            );
        }

        if (user.Email.Equals(request.NewEmail, StringComparison.OrdinalIgnoreCase))
        {
            throw AppException.BadRequest(
                "El nuevo correo electrónico debe ser diferente al actual."
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

        await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            user.UpdateEmail(request.NewEmail);
            await _userTokenRepository.RemoveExistingTokensAsync(
                user.Id,
                TokenTypes.EmailConfirmation,
                cancellationToken
            );

            // Generar un nuevo token de confirmación de correo electrónico para el nuevo correo
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

            var emailModel = new EmailChangeConfirmationModel(
                user.FirstName,
                request.NewEmail,
                confirmationLink
            );

            await _emailService.SendTemplateEmailAsync(
                user.Email, // user.Email ya tiene el nuevo valor por user.UpdateEmail()
                "Confirma tu nuevo correo electrónico - Guestly",
                EmailTemplate.EmailChangeConfirmation,
                emailModel,
                cancellationToken
            );

            return true;
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
