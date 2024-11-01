using Data_Layer.Entities.Booking;
using Data_Layer.Entities.Flights;

namespace Business_Layer.Services
{
    public interface IFlightBookingService
    {
        Task BookFlightAsync(FlightBooking flightBooking, IEnumerable<Seat> seats);
    }
}
