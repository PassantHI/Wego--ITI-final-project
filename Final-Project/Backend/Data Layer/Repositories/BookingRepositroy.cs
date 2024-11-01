using AutoMapper;
using AutoMapper.QueryableExtensions;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Data_Layer.Context;
using Data_Layer.Repositories.DTOs;
using Data_Layer.Entities.Room;

namespace Data_Layer.Repositories
{
    public class BookingRepositroy:IBookingRepositroy
    {
        protected WegoContext context;
        private readonly IMapper mapper;

        public BookingRepositroy(WegoContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<BookingDTO> GetByIdAsync(int id)
        {
            return await context.Bookings.Where(a => a.BookingId == id)
                .ProjectTo<BookingDTO>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

        }

        public async Task<IEnumerable<BookingDTO>> GetListAsync(Expression<Func<Booking, bool>>? expression = null)
        {

            if (expression != null) context.Bookings.Where(expression);

            return await context.Bookings.ProjectTo<BookingDTO>(mapper.ConfigurationProvider).ToListAsync();

        }

        public async Task<bool> AddAsync(BookingDTO bookingDTO)
        {
            var booking = mapper.Map<Booking>(bookingDTO);

            context.Bookings.Add(booking);

            return await SaveAllAsync();

        }

        public async Task<bool> UpdateAsync(BookingDTO bookingDTO)
        {
            var booking = await context.Bookings.FindAsync(bookingDTO.BookingId);
            if (booking != null)
            {

                mapper.Map(bookingDTO, booking);
                context.Update(bookingDTO);

                return await SaveAllAsync();
            }
            return false;
        }

        public async Task<bool> DeleteAsync(int id)
        {

            Booking booking = await context.Bookings.FindAsync(id);
            if (booking != null)
            {
                context.Bookings.Remove(booking);
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
