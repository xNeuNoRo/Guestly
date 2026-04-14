using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Interfaces.Security;
using Guestly.Domain.Exceptions;
using MediatR;

namespace Guestly.Application.Commands.Users.ChangePassword;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    public ChangePasswordCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork
    )
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(
        ChangePasswordCommand request,
        CancellationToken cancellationToken
    )
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw AppException.NotFound("Usuario no encontrado", ErrorCodes.UserNotFound);
        }

        if (!_passwordHasher.VerifyPassword(request.CurrentPassword, user.Password))
        {
            throw AppException.Unauthorized(
                "La contraseña actual es incorrecta.",
                ErrorCodes.InvalidCredentials
            );
        }

        var hashedNewPassword = _passwordHasher.HashPassword(request.NewPassword);
        user.UpdatePassword(hashedNewPassword);
        _userRepository.Update(user);

        // UnitOfWork es inteligente y llamara a SaveChangesAsync()
        // solamente si es que no detecta una transaccion activa
        await _unitOfWork.CommitAsync(cancellationToken);

        return true;
    }
}
