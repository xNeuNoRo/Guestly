namespace Guestly.Domain.Entities.Base;

/// <summary>
/// Clase base para todas las entidades del dominio, que incluye propiedades comunes como Id, CreatedAt y UpdatedAt.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Identificador único de la entidad, generado automáticamente como un nuevo GUID al crear una instancia de la entidad.
    /// </summary>
    /// <example>3fa85f64-5717-4562-b3fc-2c963f66afa6</example>
    public Guid Id { get; protected set; } = Guid.NewGuid();

    /// <summary>
    /// Fecha y hora en que se creó la entidad, establecida automáticamente al crear una instancia de la entidad.
    /// </summary>
    /// <example>2026-06-01T12:00:00Z</example>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Fecha y hora en que se actualizó por última vez la entidad, establecida automáticamente al actualizar la entidad.
    /// </summary>
    /// <example>2026-06-01T12:00:00Z</example>
    public DateTime? UpdatedAt { get; set; }
}
