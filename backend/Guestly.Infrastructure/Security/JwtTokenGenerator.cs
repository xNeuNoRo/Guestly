using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Guestly.Application.Interfaces.Security;
using Guestly.Domain.Entities.User;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Guestly.Infrastructure.Security;

/// <summary>
/// Implementación concreta del generador de tokens JWT.
/// Crea los tokens de acceso que el cliente (Frontend) usará para autenticarse en la API.
/// </summary>
public class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly IConfiguration _configuration;

    public JwtTokenGenerator(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    /// <summary>
    /// Genera un token JWT firmado criptográficamente que contiene los datos esenciales del usuario.
    /// </summary>
    /// <param name="user">El usuario para el cual generar el token.</param>
    /// <returns>Una cadena que representa el token JWT generado.</returns>
    public string GenerateToken(User user)
    {
        // Configuración con Fallbacks
        // EL SECRETO es lo único que NO debe tener fallback por seguridad crítica.
        var secret =
            _configuration["JwtSettings:Secret"]
            ?? throw new InvalidOperationException(
                "JWT Secret no configurado. Verifica tu appsettings.json o variables de entorno."
            );

        // Fallbacks para Issuer y Audience
        // Issuer es el emisor del token
        var issuer = _configuration["JwtSettings:Issuer"] ?? "GuestlyAPI";
        // Audience es el destinatario previsto del token (usualmente el cliente o frontend)
        var audience = _configuration["JwtSettings:Audience"] ?? "GuestlyWebClient";

        // Fallback de Expiración 7 días en minutos (60 * 24 * 7)
        var expiryMinutesString = _configuration["JwtSettings:ExpiryMinutes"] ?? "10080";
        if (!double.TryParse(expiryMinutesString, out var expiryMinutes))
        {
            expiryMinutes = 10080; // Default a 7 días si el string es inválido
        }

        // Creamos el token usando la clave secreta y las credenciales de firma
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        // usamos el algoritmo HMAC SHA256 para firmar el token
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            // El ID del usuario se incluye como el "sub" (subject) del token,
            // que es un estándar en JWT para identificar al sujeto del token.
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            // El email del usuario se incluye como un claimer estándar "email"
            // para facilitar la identificación del usuario en el frontend.
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            // El nombre completo del usuario se incluye como el "name" del token,
            // lo que es útil para mostrar el nombre del usuario en la interfaz de usuario sin necesidad
            // de hacer una consulta adicional al backend.
            new Claim(JwtRegisteredClaimNames.Name, $"{user.FirstName} {user.LastName}"),
            // El "jti" (JWT ID) es un identificador único para cada token, lo que ayuda a prevenir ataques de repetición.
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            // El rol del usuario se incluye como un claim de tipo "role",
            // lo que permite al frontend implementar lógica de autorización basada en roles sin necesidad de consultar al backend.
            new Claim(ClaimTypes.Role, user.Role.ToString()),
        };

        // Creamos el descriptor del token con toda la información necesaria para generar el token JWT.
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = credentials,
        };

        // Generamos el token usando el manejador de tokens JWT de .NET, que se encarga de crear un token seguro y firmado.
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        // Finalmente, convertimos el token a una cadena que se puede enviar al cliente (Frontend)
        // para su uso en la autenticación de la API.
        return tokenHandler.WriteToken(token);
    }
}
