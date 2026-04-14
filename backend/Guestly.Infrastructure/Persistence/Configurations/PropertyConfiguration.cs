using System.Text.Json;
using Guestly.Domain.Entities.Properties;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Guestly.Infrastructure.Persistence.Configurations;

public class PropertyConfiguration : IEntityTypeConfiguration<Property>
{
    public void Configure(EntityTypeBuilder<Property> builder)
    {
        builder.ToTable("Properties");

        // PK
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Title).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Description).IsRequired().HasMaxLength(2000);
        builder.Property(p => p.Location).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Capacity).IsRequired();

        // Precios con precisión decimal en PSQL
        builder.Property(p => p.PricePerNight).IsRequired().HasColumnType("decimal(18,2)");
        builder.Property(p => p.CleaningFee).IsRequired().HasColumnType("decimal(18,2)");

        // Convertimos el IReadOnlyCollection<string> de los urls de imgs a un JSON (ej. '["url1.jpg", "url2.jpg"]')
        builder
            .Property(p => p.Images)
            .HasField("_images") // Le decimos que el campo es _images
            .UsePropertyAccessMode(PropertyAccessMode.Field)
            .HasConversion(
                // Convertir la lista de URLs a JSON para almacenar en la base de datos
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                // Convertir el JSON de vuelta a una lista de URLs al leer de la base de datos
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null)!
            )
            // Configuramos un ValueComparer para que EF Core pueda comparar correctamente las colecciones de imágenes
            .Metadata.SetValueComparer(
                // El ValueComparer le dice a EF Core cómo comparar dos colecciones de imágenes para detectar cambios.
                new ValueComparer<IReadOnlyCollection<string>>(
                    // Comparar dos colecciones de imágenes verificando que tengan el mismo contenido (ignorando el orden)
                    (c1, c2) => c1!.SequenceEqual(c2!),
                    // Generar un hash code para la colección de imágenes combinando los hash codes de cada URL
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    // Clonar la colección de imágenes para evitar problemas de referencia al comparar
                    c => c.ToList()
                )
            );

        // Indices
        builder.HasIndex(p => p.HostId);
        builder.HasIndex(p => p.Location);

        // Relaciones
        builder
            .HasOne(p => p.Host)
            .WithMany() // Un anfitrión puede tener muchas propiedades
            .HasForeignKey(p => p.HostId)
            .OnDelete(DeleteBehavior.Restrict); // Evitamos borrar un anfitrión si tiene propiedades

        // Configuramos los campos virtuales para navegar las relaciones de 1-N
        builder
            .Metadata.FindNavigation(nameof(Property.Reservations))!
            .SetPropertyAccessMode(PropertyAccessMode.Field);

        builder
            .Metadata.FindNavigation(nameof(Property.Blocks))!
            .SetPropertyAccessMode(PropertyAccessMode.Field);

        builder
            .Metadata.FindNavigation(nameof(Property.Reviews))!
            .SetPropertyAccessMode(PropertyAccessMode.Field);

        builder.Property(p => p.CreatedAt).IsRequired();
        builder.Property(p => p.UpdatedAt);
    }
}
