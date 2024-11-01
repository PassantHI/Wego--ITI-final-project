using Data_Layer.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Data_Layer.Repositories
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        protected readonly WegoContext _db;
        protected readonly DbSet<TEntity> _dbSet;

        public GenericRepository(WegoContext _context)
        {
            _db = _context;
            _dbSet = _context.Set<TEntity>();
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>>? condition=null)
        {
            if (condition is { })
            {
                return await _dbSet.Where(condition).ToListAsync();
            }
            return await _dbSet.ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> GetPaginatedAsync(int pageIndex = 1, int pageSize = 10, Expression<Func<TEntity, bool>>? func = null)
        {
            IQueryable<TEntity> query = _dbSet;

            if (func is { })
            {
                query = query.Where(func);
            }

            return await query
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountAsync(Expression<Func<TEntity, bool>>? func = null)
        {
            if (func is not { })
            {
                return await _dbSet.CountAsync();
            }
            return await _dbSet.CountAsync(func);
        }

        public async Task<TEntity> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<TEntity> GetByAsync(Func<TEntity,bool> func)
        {
            return _dbSet.FirstOrDefault(func);
        }

        public async Task AddAsync(TEntity entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task UpdateAsync(TEntity entity)
        {
            _dbSet.Update(entity);
        }

        public async Task DeleteAsync(TEntity entity)
        {
            if (entity != null)
            {
                _dbSet.Remove(entity);
            }
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }

        public async Task<TEntity> GetByKeyAsync(params object[] keys)
        {
            return await _dbSet.FindAsync(keys);
        }

        public TEntity GetById(int id)
        {
            var exist = _dbSet.Find(id);
            if (exist != null) return exist;
            return  null;

        }


        public IEnumerable<TEntity> GetList(System.Linq.Expressions.Expression<Func<TEntity, bool>> expression, string include)
        {
            IQueryable<TEntity> Query = _dbSet;
            if (include != null)
            {
                Query = Query.Include(include);
            }
            if (expression != null) { Query = Query.Where(expression); }

            return Query.ToList();

        }


        public TEntity GetBy(Expression<Func<TEntity, bool>>? expression, string? include)
        {
            IQueryable<TEntity> query = _dbSet;
            if (include != null)
            {
                query = query.Include(include);
            }

            return query.FirstOrDefault(expression);


        }
    }
}
