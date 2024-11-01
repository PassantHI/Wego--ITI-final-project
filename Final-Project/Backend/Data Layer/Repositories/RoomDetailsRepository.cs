using AutoMapper;
using AutoMapper.QueryableExtensions;
using Data_Layer.Context;
using Data_Layer.Entities.Room;
using Data_Layer.Repositories.DTOs;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Data_Layer.Repositories
{
    public class RoomDetailsRepository(WegoContext context,  IMapper mapper) : IRoomDetailsRepository
    {

        public async Task<int> AddRoomBookingDetailsAsync(DetailsDTO detailsDTO)
        {
            var RoomBookingDetails = mapper.Map<RoomBookingDetails>(detailsDTO);
            await context.RoomBookingDetails.AddAsync(RoomBookingDetails);
            await SaveAllAsync();
            return RoomBookingDetails.RoomBookingId;
        }


        public async Task<DetailsDTO> GetByIdAsync(int id)
        {
            return await context.RoomBookingDetails
                .Where(a => a.RoomBookingId == id)
                .ProjectTo<DetailsDTO>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

        }

        public async Task<IEnumerable<DetailsDTO>> GetListAsync(Expression<Func<RoomBookingDetails, bool>>? expression)
        {
            IQueryable<RoomBookingDetails> query = context.RoomBookingDetails;
            if (expression != null) query = query.Where(expression);

            return await query
                .ProjectTo<DetailsDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

        }


        public async Task<bool> UpdateAsync(DetailsDTO detailsDTO)
        {
            var details = await context.RoomBookingDetails.FindAsync(detailsDTO.RoomBookingId);
            if (details != null)
            {

                mapper.Map(detailsDTO, details);
                context.Update(details);

                return await SaveAllAsync();
            }
            return false;

        }

        public async Task<bool> DeleteAsync(int id)
        {

            RoomBookingDetails details = await context.RoomBookingDetails.FindAsync(id);
            if (details != null)
            {
                context.RoomBookingDetails.Remove(details);
                return await SaveAllAsync();

            }
            return false;
        }


        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
