using Guestly.Application.DTOs.Auth;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Interfaces.Security;
using Guestly.Domain.Entities.User;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Auth.Register;

/// <summary>
/// Manejador del comando de registro de usuario. Se encarga de procesar la lógica de negocio
/// relacionada con el registro de un nuevo usuario, incluyendo la verificación de la existencia
/// del correo electrónico, el hash de la contraseña, la creación del usuario en la base de datos
/// y la generación del token JWT para el nuevo usuario.
/// </summary>
public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, AuthResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public RegisterUserCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator
    )
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    /// <summary>
    /// Maneja el comando de registro de usuario. Verifica si el correo electrónico ya está registrado,
    /// si no lo está, crea un nuevo usuario, lo guarda en la base de datos y genera un token
    /// JWT para el nuevo usuario. Retorna una respuesta con los datos del usuario y el token.
    /// </summary>
    /// <param name="request">La solicitud de registro de usuario.</param>
    /// <param name="cancellationToken">El token de cancelación.</param>
    /// <returns>Una tarea que representa la operación asincrónica y contiene la respuesta de autenticación.</returns>
    public async Task<AuthResponse> Handle(
        RegisterUserCommand request,
        CancellationToken cancellationToken
    )
    {
        // Comprobamos si el correo electrónico ya está registrado
        var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        // Si existe, lanzamos una excepción de conflicto
        if (existingUser is not null)
        {
            throw AppException.Conflict(
                "El correo electrónico ya está registrado.",
                ErrorCodes.EmailAlreadyExists
            );
        }

        // Si no existe, procedemos a crear el nuevo usuario
        var hashedPassword = _passwordHasher.HashPassword(request.Password);

        // Creamos el usuario y lo guardamos en la base de datos
        var user = new User(
            request.FirstName,
            request.LastName,
            request.Email,
            hashedPassword,
            request.Role
        );
        await _userRepository.AddAsync(user, cancellationToken);

        // Generamos el token JWT para el nuevo usuario
        var token = _jwtTokenGenerator.GenerateToken(user);

        // Mappeamos el usuario a AuthResponse y añadimos el token
        var response = user.Adapt<AuthResponse>();

        // Retornamos la respuesta con el token incluido
        return response with
        {
            Token = token,
        };
    }
}
