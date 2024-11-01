using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Data_Layer.Context;
using Data_Layer.Repositories.DTOs;
using Data_Layer.Entities.Room;

namespace Data_Layer.Repositories
{
    public class RoomsRepository : IRoomRepository
    {
        protected WegoContext context;
        private readonly IMapper mapper;

        public RoomsRepository(WegoContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<RoomDTO> GetBy(Expression<Func<RoomDTO, bool>> expression, string include)
        {
            throw new NotImplementedException();
        }

        public async Task<RoomDTO> GetByIdAsync(int id)
        {
            return await context.Rooms.Where(a=>a.RoomId==id)
                .ProjectTo<RoomDTO>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<RoomDTO>> GetListAsync(Expression<Func<Room, bool>>? expression = null)
        {
            IQueryable<Room> Query = context.Rooms;

            if (expression != null) Query = Query.Where(expression);

            return await Query.ProjectTo<RoomDTO>(mapper.ConfigurationProvider).ToListAsync();
            
        }

        public async Task<bool> SaveAllAsync()
        {

            return await context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<RoomDTO>> FilterRooms(string country, int roomType)
        {
            return await context.Rooms
                .Where(a => a.Country.ToLower().Contains(country) && (int)a.RoomType == roomType)
                .ProjectTo<RoomDTO>(mapper.ConfigurationProvider).ToListAsync();
        }


        public async Task<bool> DeleteRoomAsync(int roomId)
        {
            var room =await context.Rooms.FindAsync(roomId);
            if (room != null) { 
                context.Rooms.Remove(room); 

                return await SaveAllAsync() ;
            }

            return false;
           
        }

        public async Task<bool> UpdateRoomAsync(RoomDTO roomDTO)
        {
            
            var room = await context.Rooms.FindAsync(roomDTO.RoomID);
            if (room != null) {

                 mapper.Map(roomDTO,room);
                context.Update(room);

                 return await SaveAllAsync();
            }
            return false;
            
        }
        public async Task<bool> AddRoomAsync(RoomDTO roomDTO)
        {
            var room = mapper.Map<Room>(roomDTO);

            context.Rooms.Add(room);

            return await SaveAllAsync();

        }
        public async Task<Room> AddRoomDashboardAsync(RoomDTO roomDTO)
        {
            var room = mapper.Map<Room>(roomDTO);
            await context.Rooms.AddAsync(room);
            //context.Entry(room).State = EntityState.Added;
            return room;
        }

        public void UpdateRoom(Room room)
        {
            context.Entry(room).State = EntityState.Modified;
            context.Update(room);
        }

        public async Task<Room?> GetRoomWithIdAsync(int id)
        {
            return await context.Rooms.FindAsync(id);
        }

        public void DeleteRoom(Room room)
        {
            context.Remove(room);
        }


    }
}
