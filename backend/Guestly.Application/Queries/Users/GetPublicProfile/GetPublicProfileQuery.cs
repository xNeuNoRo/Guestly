using Guestly.Application.DTOs.Users;
using MediatR;

namespace Guestly.Application.Queries.Users.GetPublicProfile;

/// <summary>
/// Consulta para obtener el perfil público de un usuario por su identificador.
/// </summary>
public record GetPublicProfileQuery(Guid UserId) : IRequest<PublicProfileResponse>;
