using Guestly.Domain.Entities.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Guestly.Infrastructure.Persistence.Configurations;

public class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
{
    // Decimal con precisión para PSQL
    private const string DecimalColumnType = "decimal(18,2)";

    public void Configure(EntityTypeBuilder<Reservation> builder)
    {
        builder.ToTable("Reservations");

        // PK
        builder.HasKey(r => r.Id);

        builder.Property(r => r.CheckInDate).IsRequired();
        builder.Property(r => r.CheckOutDate).IsRequired();

        // Precisión decimal para los precios
        builder
            .Property(r => r.PricePerNightAtBooking)
            .IsRequired()
            .HasColumnType(DecimalColumnType);

        builder.Property(r => r.CleaningFeeAtBooking).IsRequired().HasColumnType(DecimalColumnType);
        builder.Property(r => r.ServiceFeeAtBooking).IsRequired().HasColumnType(DecimalColumnType);
        builder.Property(r => r.TaxesAtBooking).IsRequired().HasColumnType(DecimalColumnType);
        builder.Property(r => r.TotalPrice).IsRequired().HasColumnType(DecimalColumnType);
        builder.Property(r => r.Status).IsRequired();

        // Indices

        builder.HasIndex(r => r.PropertyId);
        builder.HasIndex(r => r.GuestId);

        // Indice compuesto
        builder.HasIndex(r => new
        {
            r.PropertyId,
            r.CheckInDate,
            r.CheckOutDate,
        });

        // Relaciones
        builder
            .HasOne(r => r.Property)
            .WithMany(p => p.Reservations)
            .HasForeignKey(r => r.PropertyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(r => r.Guest)
            .WithMany()
            .HasForeignKey(r => r.GuestId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(r => r.CreatedAt).IsRequired();
        builder.Property(r => r.UpdatedAt);
    }
}
