using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Guestly.Application.Interfaces.External;
using Guestly.Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Guestly.Infrastructure.External;

/// <summary>
/// Implementación del servicio de subida de imágenes utilizando el SDK oficial de Cloudinary.
/// </summary>
public class CloudinaryImageUploadService : IImageUploadService
{
    // Cliente de cloudinary
    private readonly Cloudinary _cloudinary;

    public CloudinaryImageUploadService(IConfiguration configuration)
    {
        // Leemos las credenciales
        var cloudName =
            configuration["CloudinarySettings:CloudName"]
            ?? throw new InvalidOperationException("Falta CloudName en CloudinarySettings.");
        var apiKey =
            configuration["CloudinarySettings:ApiKey"]
            ?? throw new InvalidOperationException("Falta ApiKey en CloudinarySettings.");
        var apiSecret =
            configuration["CloudinarySettings:ApiSecret"]
            ?? throw new InvalidOperationException("Falta ApiSecret en CloudinarySettings.");

        // Inicializamos el cliente de Cloudinary
        var account = new Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(IFormFile file, CancellationToken cancellationToken)
    {
        // Validamos que el archivo no esté vacío
        if (file.Length == 0)
        {
            throw new ArgumentException("El archivo está vacío.", nameof(file));
        }

        // Abrimos el stream del archivo directamente desde la petición HTTP (sin guardarlo en disco)
        await using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            // Agrupamos las imágenes en una carpeta dentro de Cloudinary
            Folder = "guestly-properties",
            // Aplicamos una transformación para optimizar la imagen (calidad automática y formato automático)
            Transformation = new Transformation().Quality("auto").FetchFormat("auto"),
        };

        // Subimos la imagen a Cloudinary de forma asíncrona
        var uploadResult = await _cloudinary.UploadAsync(uploadParams, cancellationToken);

        // Si hubo un error durante la subida, lanzamos una excepción con el mensaje de error proporcionado por Cloudinary
        if (uploadResult.Error != null)
        {
            throw AppException.ExternalServiceError(
                "No se pudo procesar la imagen en nuestro proveedor de almacenamiento"
            );
        }

        // Devolvemos la URL segura (https) que guardaremos en nuestra base de datos
        return uploadResult.SecureUrl.ToString();
    }

    /// <summary>
    /// Elimina una imagen de Cloudinary utilizando la URL de la imagen.
    /// Cloudinary requiere el 'PublicId' para eliminar, por lo que extraemos ese valor de la URL proporcionada.
    /// </summary>
    /// <param name="imageUrl">La URL de la imagen a eliminar.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>El resultado de la operación de eliminación.</returns>
    public async Task<bool> DeleteImageAsync(string imageUrl, CancellationToken cancellationToken)
    {
        // Validamos que la URL no esté vacía o nula
        if (string.IsNullOrWhiteSpace(imageUrl))
            return false;

        // Cloudinary requiere el Public ID (ej: "guestly-properties/micasa_x") para borrar, no la URL
        string publicId = ExtractPublicIdFromUrl(imageUrl);

        // Si no pudimos extraer un Public ID válido, no podemos proceder con la eliminación
        if (string.IsNullOrEmpty(publicId))
            return false;

        // Creamos los parámetros de eliminación utilizando el Public ID extraído
        var deletionParams = new DeletionParams(publicId);
        // Realizamos la eliminación de forma asíncrona
        var result = await _cloudinary.DestroyAsync(deletionParams);

        // Devolvemos true si la eliminación fue exitosa (result.Result == "ok"), de lo contrario false
        return result.Result == "ok";
    }

    /// <summary>
    /// Extrae el 'PublicId' de una URL típica de Cloudinary.
    /// </summary>
    /// <param name="imageUrl">La URL de la imagen de la cual extraer el PublicId.</param>
    /// <returns>El PublicId extraído o una cadena vacía si no se puede extraer.</returns>
    private static string ExtractPublicIdFromUrl(string imageUrl)
    {
        // Encontramos dónde empieza la parte útil después de "upload/"
        int uploadIndex = imageUrl.LastIndexOf("upload/", StringComparison.OrdinalIgnoreCase);

        // Si no encontramos "upload/", no podemos extraer el Public ID
        if (uploadIndex == -1)
            return string.Empty;

        // Obtenemos lo que está después de "upload/"
        string afterUpload = imageUrl.Substring(uploadIndex + 7);

        // Eliminamos la versión si existe (ej. "v1612345678/")
        int slashIndex = afterUpload.IndexOf('/');
        if (afterUpload.StartsWith('v') && slashIndex >= 0)
        {
            afterUpload = afterUpload.Substring(slashIndex + 1);
        }

        // Eliminamos la extensión del archivo (".jpg", ".png")
        int lastDotIndex = afterUpload.LastIndexOf('.');
        if (lastDotIndex != -1)
        {
            afterUpload = afterUpload.Substring(0, lastDotIndex);
        }

        return afterUpload;
    }
}
