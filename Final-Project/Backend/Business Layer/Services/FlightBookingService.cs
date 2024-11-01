using Data_Layer.Entities.Booking;
using Data_Layer.Entities.enums;
using Data_Layer.Entities.Flights;
using Data_Layer.Repositories;
using Data_Layer.UnitOfWork;

namespace Business_Layer.Services
{
    public class FlightBookingService : IFlightBookingService
    {
        private readonly IUnitOfWork _unit;
        private readonly IGenericRepository<FlightBooking> _flightBookingRepository;

        public FlightBookingService(IUnitOfWork unitOfWork)
        {
            _unit = unitOfWork;
            _flightBookingRepository = _unit.FlightBookingRepository;
        }
        public async Task BookFlightAsync(FlightBooking flightBooking, IEnumerable<Seat> seats)
        {
            try
            {
                await _flightBookingRepository.AddAsync(flightBooking);
                await _unit.CompleteAsync();


                ReserveSeatsOfFlightBooking(flightBooking, seats);
                flightBooking.TotalPrice = CalcFlightBookingTotalPrice(flightBooking);

                await _flightBookingRepository.UpdateAsync(flightBooking);
                await _unit.CompleteAsync();
            }
            catch
            {
                await _flightBookingRepository.DeleteAsync(flightBooking);
                await _unit.CompleteAsync();
                throw;
            }
        }

        private double CalcFlightBookingTotalPrice(FlightBooking flightBooking)
        {
            if (flightBooking.Flight is null)
            {
                throw new InvalidOperationException("Cannot calculate total price: missing flight or seat reservations.");
            }
            double price = flightBooking.SeatReservations.Sum(reserve => reserve.Seat?.Class switch
            {
                SeatClass.Economy => flightBooking.Flight.EconomyClassPrice ,
                SeatClass.Business => flightBooking.Flight.BusinessClassPrice,
                SeatClass.FirstClass => flightBooking.Flight.FirstClassPrice,
                _ => 0
            });
            return price;
        }

        private void ReserveSeatsOfFlightBooking(FlightBooking flightBooking, IEnumerable<Seat> seats)
        {
            foreach (var seat in seats)
            {
                flightBooking.SeatReservations
                    .Add(new SeatReservation()
                    {
                        FlightBookingId = flightBooking.Id,
                        SeatId = seat.Id,
                        Seat = seat,
                    });
            }
            return ;
        }
    }
}
