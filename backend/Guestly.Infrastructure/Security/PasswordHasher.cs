using System.Security.Cryptography;
using System.Text;
using Guestly.Application.Interfaces.Security;
using Konscious.Security.Cryptography;

namespace Guestly.Infrastructure.Security;

/// <summary>
/// Implementación de IPasswordHasher utilizando el algoritmo Argon2id para el hashing de contraseñas.
/// </summary>
public class PasswordHasher : IPasswordHasher
{
    // El paralelismo del algoritmo argon2, degree 8 es el recomendado pero se puede ajustar por rendimiento
    private const int DegreeOfParallelism = 8;

    // Cantidad de memoria a usar en KB, 64MB es el recomendado pero se puede ajustar por rendimiento
    private const int MemorySize = 65536;

    // Cantidad de iteraciones, 4 es el recomendado pero se puede ajustar por rendimiento
    private const int Iterations = 4;

    // Tamaño del Salt, 16 bytes es el recomendado
    private const int SaltSize = 16;

    // Tamaño del Hash, 32 bytes es el recomendado
    private const int HashSize = 32;

    /// <summary>
    /// Genera un hash de la contraseña utilizando el algoritmo Argon2id.
    /// El hash generado incluye el salt utilizado, lo que permite verificar la contraseña posteriormente.
    /// </summary>
    /// <param name="password">La contraseña para la cual generar el hash.</param>
    /// <returns>Un string que representa el hash generado y el salt concatenados.</returns>
    public string HashPassword(string password)
    {
        // Generamos un salt aleatorio
        var salt = GenerateSalt();
        var hash = GenerateHash(password, salt);

        // Devolvemos el hash y el salt concatenados en un formato legible, ej: "salt:hash"
        return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
    }

    /// <summary>
    /// Verifica si la contraseña proporcionada coincide con el hash almacenado.
    /// </summary>
    /// <param name="password">La contraseña a verificar.</param>
    /// <param name="hashedPassword">El hash almacenado.</param>
    /// <returns>True si la contraseña es correcta, false en caso contrario.</returns>
    public bool VerifyPassword(string password, string hashedPassword)
    {
        // Separamos el salt y el hash del string almacenado
        var parts = hashedPassword.Split(':');

        // Si el formato no es correcto, devolvemos false
        if (parts.Length != 2)
            return false;

        // Convertimos el salt y el hash de base64 a byte arrays
        var salt = Convert.FromBase64String(parts[0]);
        var expectedHash = Convert.FromBase64String(parts[1]);

        // Generamos el hash de la contraseña proporcionada utilizando el mismo salt
        var actualHash = GenerateHash(password, salt);

        // Comparamos los hashes utilizando una comparación segura para evitar ataques de timing
        return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
    }

    /// <summary>
    /// Genera un salt aleatorio utilizando un generador de números aleatorios criptográficamente seguro.
    /// </summary>
    /// <returns>Un array de bytes que representa el salt generado.</returns>
    private static byte[] GenerateSalt()
    {
        var buffer = new byte[SaltSize];
        RandomNumberGenerator.Fill(buffer);
        return buffer;
    }

    /// <summary>
    /// Genera un hash de la contraseña utilizando el algoritmo Argon2id con los parámetros definidos.
    /// </summary>
    /// <param name="password">La contraseña para la cual generar el hash.</param>
    /// <param name="salt">El salt a utilizar en la generación del hash.</param>
    /// <returns>Un array de bytes que representa el hash generado.</returns>
    private static byte[] GenerateHash(string password, byte[] salt)
    {
        // Convertimos la contraseña a un array de bytes utilizando UTF-8 encoding
        var passwordBytes = Encoding.UTF8.GetBytes(password);

        // Generamos el hash utilizando Argon2id con los parámetros definidos
        using var argon2 = new Argon2id(passwordBytes)
        {
            Salt = salt,
            DegreeOfParallelism = DegreeOfParallelism,
            MemorySize = MemorySize,
            Iterations = Iterations,
        };

        // Devolvemos el hash generado como un array de bytes
        return argon2.GetBytes(HashSize);
    }
}
