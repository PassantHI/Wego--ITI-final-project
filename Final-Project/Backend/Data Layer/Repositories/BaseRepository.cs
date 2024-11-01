using Data_Layer.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Data_Layer.Repositories
{
    public class BaseRepository<T> : IBaseReporitory<T> where T : class
    {
        protected WegoContext dbContext;

        public BaseRepository(WegoContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public T GetById(int id)
        {
            var exist = dbContext.Set<T>().Find(id);
            return exist == null ? null : exist;
            
        }

        public T GetBy(Expression<Func<T, bool>>? expression, string? include)
        {
            IQueryable<T> query=dbContext.Set<T>();
            if (include != null) 
            {
                query = query.Include(include);
            }
            
            return query.FirstOrDefault(expression);


        }

        public IEnumerable<T> GetList(System.Linq.Expressions.Expression<Func<T, bool>> expression, string include)
        {
            IQueryable<T> Query = dbContext.Set<T>();
            if (include != null) 
            {
                Query=Query.Include(include);
            }
            if (expression != null) { Query=Query.Where(expression); }

            return Query.ToList();

        }
    }
}
