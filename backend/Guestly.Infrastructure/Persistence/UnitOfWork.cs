using Guestly.Application.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace Guestly.Infrastructure.Persistence;

/// <summary>
/// Implementación concreta del patrón Unit of Work utilizando Entity Framework Core.
/// Gestiona la atomicidad de las operaciones y el control de transacciones explícitas.
/// </summary>
public class UnitOfWork : IUnitOfWork, IDisposable
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _currentTransaction;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Inicia una nueva transacción en la base de datos si no hay una activa.
    /// </summary>
    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction != null)
        {
            return;
        }

        _currentTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    /// <summary>
    /// Confirma todos los cambios realizados en el contexto y completa la transacción activa.
    /// Si ocurre un error, realiza un Rollback automáticamente.
    /// </summary>
    public async Task CommitAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            // Primero persistimos los cambios en el Change Tracker de EF
            await _context.SaveChangesAsync(cancellationToken);

            // Si hay una transacción explícita iniciada, la confirmamos en SQL Server
            if (_currentTransaction != null)
            {
                await _currentTransaction.CommitAsync(cancellationToken);
            }
        }
        catch
        {
            await RollbackAsync(cancellationToken);
            throw;
        }
        finally
        {
            DisposeTransaction();
        }
    }

    /// <summary>
    /// Revierte todos los cambios de la transacción actual y limpia el estado del contexto.
    /// </summary>
    public async Task RollbackAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction != null)
        {
            await _currentTransaction.RollbackAsync(cancellationToken);
            DisposeTransaction();
        }
    }

    /// <summary>
    /// Persiste los cambios en la base de datos sin necesidad de una transacción explícita.
    /// Útil para operaciones simples de una sola entidad.
    /// </summary>
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Libera los recursos utilizados por la transacción actual y el contexto de la base de datos.
    /// </summary>
    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    /// <summary>
    /// Implementa el patrón de disposición estándar de .NET.
    /// </summary>
    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            DisposeTransaction();
        }
    }

    /// <summary>
    /// Finalizador para asegurar que los recursos de la transacción se liberen incluso si Dispose no es llamado explícitamente.
    /// </summary>
    ~UnitOfWork()
    {
        Dispose(false);
    }

    /// <summary>
    /// Libera los recursos de la transacción actual si existe una activa.
    /// </summary>
    private void DisposeTransaction()
    {
        if (_currentTransaction != null)
        {
            _currentTransaction.Dispose();
            _currentTransaction = null;
        }
    }
}
