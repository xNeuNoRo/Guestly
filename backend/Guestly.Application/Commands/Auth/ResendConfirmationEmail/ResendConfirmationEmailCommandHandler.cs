using Guestly.Application.Interfaces.External;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Interfaces.Security;
using Guestly.Application.Models.Emails;
using Guestly.Domain.Entities.User;
using Guestly.Domain.Enums;
using Guestly.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Guestly.Application.Commands.Auth.ResendConfirmationEmail;

/// <summary>
/// Manejador para reenvío de email de confirmación. Si el usuario no existe o ya ha confirmado su email,
/// simplemente retorna true para evitar revelar información sobre la existencia del usuario.
/// </summary>
public class ResendConfirmationEmailCommandHandler
    : IRequestHandler<ResendConfirmationEmailCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserTokenRepository _userTokenRepository;
    private readonly IRandomTokenGenerator _tokenGenerator;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public ResendConfirmationEmailCommandHandler(
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
    /// Maneja el comando para reenvío de email de confirmación. Si el usuario no existe o ya ha confirmado su email,
    /// simplemente retorna true para evitar revelar información sobre la existencia del usuario.
    /// </summary>
    public async Task<bool> Handle(
        ResendConfirmationEmailCommand request,
        CancellationToken cancellationToken
    )
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        // Si el usuario no existe o ya ha confirmado su email,
        // retornamos true para evitar revelar información sobre la existencia del usuario
        if (user is null || user.IsEmailConfirmed)
        {
            return true;
        }

        await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            // Revocamos cualquier token de confirmación de email existente para el usuario
            await _userTokenRepository.RemoveExistingTokensAsync(
                user.Id,
                TokenTypes.EmailConfirmation,
                cancellationToken
            );

            var tokenString = _tokenGenerator.Generate();

            var userToken = new UserToken(
                user.Id,
                tokenString,
                TokenTypes.EmailConfirmation,
                _dateTimeProvider.UtcNow.AddHours(24)
            );

            await _userTokenRepository.AddAsync(userToken, cancellationToken);
            await _unitOfWork.CommitAsync(cancellationToken);

            bool isChange = request.Flow == EmailVerificationFlow.ChangeEmail;

            string route = isChange ? "/auth/confirm-email-change" : "/auth/confirm-email";
            var template = isChange
                ? EmailTemplate.EmailChangeConfirmation
                : EmailTemplate.EmailConfirmation;
            string subject = isChange
                ? "Confirma tu nuevo correo electrónico - Guestly"
                : "Confirma tu cuenta en Guestly";

            var baseUrl = _configuration["FrontendSettings:BaseUrl"] ?? "http://localhost:3000";
            // Construimos el enlace de confirmación con el email y token como parámetros de consulta
            var confirmationLink =
                $"{baseUrl}{route}?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(tokenString)}";

            if (isChange)
            {
                var model = new EmailChangeConfirmationModel(
                    user.FirstName,
                    user.Email,
                    confirmationLink
                );
                await _emailService.SendTemplateEmailAsync(
                    user.Email,
                    subject,
                    template,
                    model,
                    cancellationToken
                );
            }
            else
            {
                var model = new ConfirmEmailModel(user.FirstName, confirmationLink);
                await _emailService.SendTemplateEmailAsync(
                    user.Email,
                    subject,
                    template,
                    model,
                    cancellationToken
                );
            }

            return true;
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
