using Data_Layer.Entities.Room;
using Data_Layer.Repositories.DTOs;
using System.Linq.Expressions;

namespace Data_Layer.Repositories
{
    public interface IRoomDetailsRepository
    {
        Task<int> AddRoomBookingDetailsAsync(DetailsDTO detailsDTO);
        Task<DetailsDTO> GetByIdAsync(int id);

        Task<IEnumerable<DetailsDTO>> GetListAsync(Expression<Func<RoomBookingDetails, bool>>? expression = null);

        Task<bool> UpdateAsync(DetailsDTO DetailsDTO);
        Task<bool> DeleteAsync(int id);

        Task<bool> SaveAllAsync();
    }
}
