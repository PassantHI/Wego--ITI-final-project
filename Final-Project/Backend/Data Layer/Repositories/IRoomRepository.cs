using Data_Layer.Entities.Room;
using Data_Layer.Repositories.DTOs;
using System.Linq.Expressions;


namespace Data_Layer.Repositories
{
    public interface IRoomRepository 
    {
        Task<RoomDTO> GetByIdAsync(int id);
        
        Task< IEnumerable<RoomDTO>> GetListAsync(Expression<Func<Room, bool>>? expression=null);

        Task<RoomDTO> GetBy(Expression<Func<RoomDTO, bool>> expression, string include);

        Task<IEnumerable<RoomDTO>> FilterRooms(string country, int roomType);


        Task <bool> DeleteRoomAsync(int roomId);

        Task <bool> UpdateRoomAsync(RoomDTO roomDTO);

        Task<bool> AddRoomAsync(RoomDTO roomDTO);
        Task<Room> AddRoomDashboardAsync(RoomDTO roomDTO);
        void UpdateRoom(Room room);
        void DeleteRoom(Room room);
        Task<Room?> GetRoomWithIdAsync(int id);

        Task<bool>SaveAllAsync();

    }
}
