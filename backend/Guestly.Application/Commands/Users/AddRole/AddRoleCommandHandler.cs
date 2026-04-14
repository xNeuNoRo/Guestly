using Guestly.Application.DTOs.Auth;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Interfaces.Security;
using Guestly.Domain.Enums;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Users.AddRole;

/// <summary>
/// Manejador para el comando AddRoleCommand. Este manejador se encarga de procesar
/// la lógica de negocio para agregar un rol a un usuario específico.
/// </summary>
public class AddRoleCommandHandler : IRequestHandler<AddRoleCommand, AuthResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IUnitOfWork _unitOfWork;

    public AddRoleCommandHandler(
        IUserRepository userRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        IUnitOfWork unitOfWork
    )
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Maneja la lógica para agregar un rol a un usuario. Verifica que el usuario exista, agrega el rol
    /// correspondiente y genera un nuevo token JWT para reflejar los cambios en los roles del usuario.
    /// Si el usuario no existe o el rol no es válido, se lanzan excepciones apropiadas.
    /// </summary>
    public async Task<AuthResponse> Handle(
        AddRoleCommand request,
        CancellationToken cancellationToken
    )
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw AppException.NotFound("Usuario no encontrado.", ErrorCodes.UserNotFound);
        }

        try
        {
            switch (request.RoleToAdd)
            {
                case UserRoles.Host:
                    user.AddHostRole();
                    break;
                case UserRoles.Guest:
                    user.AddGuestRole();
                    break;
                default:
                    throw AppException.BadRequest("Rol no válido para esta operación.");
            }
        }
        catch (DomainException ex)
        {
            throw AppException.BadRequest(ex.Message, "ROLE_ALREADY_ASSIGNED");
        }

        _userRepository.Update(user);

        // UnitOfWork es inteligente y llamara a SaveChangesAsync()
        // solamente si es que no detecta una transaccion activa
        await _unitOfWork.CommitAsync(cancellationToken);

        var newToken = _jwtTokenGenerator.GenerateToken(user);
        var response = user.Adapt<AuthResponse>();

        return response with
        {
            Token = newToken,
        };
    }
}
