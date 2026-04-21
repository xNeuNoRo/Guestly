using Microsoft.AspNetCore.Http;

namespace Guestly.Application.Interfaces.External;

/// <summary>
/// Interfaz que define los métodos para subir y eliminar imágenes en un servicio de almacenamiento externo.
/// Esta interfaz permite abstraer la lógica de manejo de imágenes, facilitando la integración con diferentes
/// proveedores de almacenamiento. En esta API haremos uso de Cloudinary.
/// </summary>
public interface IImageUploadService
{
    /// <summary>
    /// Sube una imagen a un servicio de almacenamiento externo y devuelve la URL de la imagen subida.
    /// </summary>
    /// <param name="file">El archivo de imagen a subir, representado como un objeto IFormFile.</param>
    /// <param name="cancellationToken">Token de cancelación para cancelar la operación de subida si es necesario.</param>
    Task<string> UploadImageAsync(IFormFile file, CancellationToken cancellationToken);

    /// <summary>
    /// Elimina una imagen del servicio de almacenamiento externo utilizando la URL de la imagen.
    /// </summary>
    /// <param name="imageUrl">La URL de la imagen que se desea eliminar.</param>
    /// <param name="cancellationToken">Token de cancelación para cancelar la operación de eliminación si es necesario.</param>
    Task<bool> DeleteImageAsync(string imageUrl, CancellationToken cancellationToken);
}
