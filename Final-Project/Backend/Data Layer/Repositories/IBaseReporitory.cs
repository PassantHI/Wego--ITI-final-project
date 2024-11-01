using System.Linq.Expressions;

namespace Data_Layer.Repositories
{
    public interface IBaseReporitory <T> where T : class
    {
        T GetById(int id);  
        IEnumerable<T> GetList(Expression<Func<T,bool>>? expression , string? include );

        T GetBy(Expression<Func<T, bool>> expression, string include);
        
    }
}
