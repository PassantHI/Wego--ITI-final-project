using System.Linq.Expressions;

namespace Data_Layer.Repositories
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        Task<IEnumerable<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>>? condtion=null);
        Task<IEnumerable<TEntity>> GetPaginatedAsync(int pageIndex = 1, int pageSize = 10, Expression<Func<TEntity, bool>>? func = null);
        Task<int> CountAsync(Expression<Func<TEntity, bool>>? func = null);
        Task<TEntity> GetByIdAsync(int id);
        Task<TEntity> GetByAsync(Func<TEntity, bool> func);
        Task<TEntity> GetByKeyAsync(params object[] keys);
        Task AddAsync(TEntity entity);
        Task UpdateAsync(TEntity entity);
        Task DeleteAsync(TEntity entity);
        Task SaveChangesAsync();
        TEntity GetById(int id);
        IEnumerable<TEntity> GetList(Expression<Func<TEntity, bool>>? expression, string? include);
        TEntity GetBy(Expression<Func<TEntity, bool>> expression, string include);

    }
}
