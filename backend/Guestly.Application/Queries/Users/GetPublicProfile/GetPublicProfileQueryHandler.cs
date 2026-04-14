using Guestly.Application.DTOs.Users;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Queries.Users.GetPublicProfile;

/// <summary>
/// Manejador de la consulta para obtener el perfil público de un usuario por su identificador.
/// </summary>
public class GetPublicProfileQueryHandler
    : IRequestHandler<GetPublicProfileQuery, PublicProfileResponse>
{
    private readonly IUserRepository _userRepository;

    public GetPublicProfileQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    /// <summary>
    /// Maneja la consulta para obtener el perfil público de un usuario por su identificador.
    /// </summary>
    public async Task<PublicProfileResponse> Handle(
        GetPublicProfileQuery request,
        CancellationToken cancellationToken
    )
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user is null)
        {
            throw AppException.NotFound("El usuario no existe.", ErrorCodes.UserNotFound);
        }
        return user.Adapt<PublicProfileResponse>();
    }
}
