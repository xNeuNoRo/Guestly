using Guestly.Domain.Entities.Properties;
using Guestly.Domain.Entities.Reservations;
using Guestly.Domain.Entities.Reviews;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Guestly.Infrastructure.Persistence.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("Reviews");

        // PK
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Rating).IsRequired();
        builder.Property(r => r.Comment).IsRequired().HasMaxLength(2000);

        builder.HasIndex(r => r.PropertyId);
        builder.HasIndex(r => r.GuestId);
        // Indice para garantizar que una reserva solo tenga una reseña asociada
        builder.HasIndex(r => r.ReservationId).IsUnique();

        // Relaciones
        builder
            .HasOne(r => r.Property) // Una reseña pertenece a una propiedad
            .WithMany(p => p.Reviews) // Una propiedad puede tener muchas reseñas
            .HasForeignKey(r => r.PropertyId) // La FK es PropertyId
            .OnDelete(DeleteBehavior.Restrict); // Evitamos borrar una propiedad si tiene reseñas para preservar el historial

        builder
            .HasOne(r => r.Guest) // Una reseña pertenece a un huésped
            .WithMany()
            .HasForeignKey(r => r.GuestId) // La FK es GuestId
            .OnDelete(DeleteBehavior.Restrict); // Evitamos borrar un huésped si tiene reseñas para preservar el historial

        builder
            .HasOne(r => r.Reservation) // Una reseña pertenece a una reserva
            .WithMany()
            .HasForeignKey(r => r.ReservationId) // La FK es ReservationId
            .OnDelete(DeleteBehavior.Restrict); // Evitamos borrar una reserva si tiene reseñas para preservar el historial

        builder.Property(r => r.CreatedAt).IsRequired();
        builder.Property(r => r.UpdatedAt);
    }
}
