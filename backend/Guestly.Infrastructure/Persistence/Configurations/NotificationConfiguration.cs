using Guestly.Domain.Entities.Notifications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Guestly.Infrastructure.Persistence.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("Notifications");

        // PK
        builder.HasKey(n => n.Id);

        builder.Property(n => n.Title).IsRequired().HasMaxLength(150);
        builder.Property(n => n.Message).IsRequired().HasMaxLength(1000);
        builder.Property(n => n.Type).IsRequired();
        builder.Property(n => n.IsRead).IsRequired();
        builder.Property(n => n.ReadAt);

        // Indices
        builder.HasIndex(n => n.UserId);
        builder.HasIndex(n => new { n.UserId, n.IsRead });

        // Relaciones (DDD)
        builder
            .HasOne(n => n.User) // Una notificación pertenece a un usuario
            .WithMany()
            .HasForeignKey(n => n.UserId) // La FK es UserId
            .OnDelete(DeleteBehavior.Cascade); // Si se borra el usuario, se borran sus notificaciones automáticamente para evitar datos huérfanos

        builder.Property(n => n.CreatedAt).IsRequired();
        builder.Property(n => n.UpdatedAt);
    }
}
