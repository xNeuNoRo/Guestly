using Guestly.Domain.Entities.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Guestly.Infrastructure.Persistence.Configurations;

public class PropertyBlockConfiguration : IEntityTypeConfiguration<PropertyBlock>
{
    public void Configure(EntityTypeBuilder<PropertyBlock> builder)
    {
        builder.ToTable("PropertyBlocks");

        // PK
        builder.HasKey(pb => pb.Id);

        builder.Property(pb => pb.StartDate).IsRequired();
        builder.Property(pb => pb.EndDate).IsRequired();
        builder.Property(pb => pb.Reason).HasMaxLength(500);

        // Indices
        builder.HasIndex(pb => pb.PropertyId);
        builder.HasIndex(pb => new
        {
            pb.PropertyId,
            pb.StartDate,
            pb.EndDate,
        });

        // Relaciones
        builder
            .HasOne(pb => pb.Property) // Un bloque pertenece a una propiedad
            .WithMany(p => p.Blocks) // Una propiedad puede tener muchos bloques
            .HasForeignKey(pb => pb.PropertyId) // La FK es PropertyId
            .OnDelete(DeleteBehavior.Cascade); // Si se borra la propiedad, se borran sus bloques automáticamente

        builder.Property(pb => pb.CreatedAt).IsRequired();
        builder.Property(pb => pb.UpdatedAt);
    }
}
