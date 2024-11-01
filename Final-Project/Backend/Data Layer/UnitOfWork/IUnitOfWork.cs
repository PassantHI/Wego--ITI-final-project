using Data_Layer.Entities.Booking;
using Data_Layer.Entities.Flights;
using Data_Layer.Repositories;

namespace Data_Layer.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        // Add repositories here as needed
        // ex => IGenericRepository<Example> ExampleRepository { get;}
        IGenericRepository<Airline> AirlineRepository { get; }
        IGenericRepository<Airport> AirportRepository { get; }
        IGenericRepository<Airplane> AirplaneRepository { get; }
        IGenericRepository<Feature> FeatureRepository { get; }
        IGenericRepository<Location> LocationRepository { get; }
        IGenericRepository<Flight> FlightRepository { get; }
        IGenericRepository<Seat> SeatRepository { get; }
        IGenericRepository<FlightBooking> FlightBookingRepository { get; }
        IGenericRepository<Terminal> TerminalRepository { get; }
        IGenericRepository<Category> CategoryRepository { get; }

        Task<int> CompleteAsync();
    }
}
