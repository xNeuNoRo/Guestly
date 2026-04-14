using Guestly.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Guestly.Infrastructure.Persistence.Configurations;

public class UserTokenConfiguration : IEntityTypeConfiguration<UserToken>
{
    public void Configure(EntityTypeBuilder<UserToken> builder)
    {
        builder.ToTable("UserTokens");

        // Config de la PK
        builder.HasKey(ut => ut.Id);

        builder.Property(ut => ut.Token).IsRequired().HasMaxLength(255);
        builder.Property(ut => ut.Type).IsRequired();
        builder.Property(ut => ut.ExpiresAt).IsRequired();
        builder.Property(ut => ut.RevokedAt);

        // Indices para optimizar consultas por token y por usuario+tipo de token
        builder.HasIndex(ut => ut.Token);
        // Indice compuesto
        builder.HasIndex(ut => new { ut.UserId, ut.Type });

        // RELACIONES
        // Un token pertenece a un Usuario. Si el usuario se elimina, sus tokens se destruyen en cascada.
        builder
            .HasOne(ut => ut.User)
            .WithMany(u => u.Tokens)
            .HasForeignKey(ut => ut.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(ut => ut.CreatedAt).IsRequired();
        builder.Property(ut => ut.UpdatedAt);
    }
}
