using Data_Layer.Entities.Room;
using Data_Layer.Repositories.DTOs;
using System.Linq.Expressions;


namespace Data_Layer.Repositories
{
    public interface IBookingRepositroy
    {
        Task<BookingDTO> GetByIdAsync(int id);

        Task<IEnumerable<BookingDTO>> GetListAsync(Expression<Func<Booking, bool>>? expression = null);

        Task<bool> AddAsync(BookingDTO bookingDTO);
        Task<bool> UpdateAsync(BookingDTO bookingDTO);
        Task<bool> DeleteAsync(int id);
        Task<bool> SaveAllAsync();


    }
}
