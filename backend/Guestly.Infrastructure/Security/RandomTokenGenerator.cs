using System.Security.Cryptography;
using Guestly.Application.Interfaces.Security;

namespace Guestly.Infrastructure.Security;

/// <summary>
/// Implementación concreta del generador de tokens aleatorios.
/// Produce cadenas alfanuméricas criptográficamente seguras y "URL-safe"
/// ideales para confirmaciones de correo y restablecimiento de contraseñas.
/// </summary>
public class RandomTokenGenerator : IRandomTokenGenerator
{
    /// <summary>
    /// Genera un token aleatorio seguro de la longitud especificada.
    /// Utiliza Base64Url (sin '+', '/', ni padding '=') para evitar problemas en enlaces web.
    /// </summary>
    /// <param name="length">Longitud en bytes (por defecto 32, genera un string de ~43 caracteres).</param>
    /// <returns>El token en formato string URL-safe.</returns>
    public string Generate(int length = 32)
    {
        // Creamos un buffer de bytes del tamaño solicitado
        var buffer = new byte[length];

        // Llenamos el buffer utilizando el generador criptográfico del SO (Sistema Operativo) (CSPRNG).
        // Usamos RandomNumberGenerator.Fill para obtener bytes aleatorios seguros.
        RandomNumberGenerator.Fill(buffer);

        // Convertimos a Base64 estándar
        var base64 = Convert.ToBase64String(buffer);

        // Transformamos el Base64 estándar a un formato "Base64Url" seguro para enlaces web:
        //    - Reemplazar '+' por '-'
        //    - Reemplazar '/' por '_'
        //    - Eliminar el relleno de '=' al final
        return base64.Replace('+', '-').Replace('/', '_').TrimEnd('=');
    }
}
