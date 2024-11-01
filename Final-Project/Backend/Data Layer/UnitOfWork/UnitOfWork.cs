using Data_Layer.Context;
using Data_Layer.Entities.Booking;
using Data_Layer.Entities.Flights;
using Data_Layer.Repositories;

namespace Data_Layer.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly WegoContext _context;

        // Add private fields for repository here as needed
        // ex ==> private IGenericRepository<Example> _exampleRepository;

        private IGenericRepository<Airline>? _airlineRepository;
        private IGenericRepository<Airport>? _airportRepository;
        private IGenericRepository<Airplane>? _airplaneRepository;
        private IGenericRepository<Feature>? _featureRepository;
        private IGenericRepository<Location>? _locationRepository;
        private IGenericRepository<Flight>? _flightRepository;
        private IGenericRepository<Seat>? _seatRepository;
        private IGenericRepository<FlightBooking>? _flightBookingRepository;
        private IGenericRepository<Terminal>? _terminalRepository;
        private IGenericRepository<Category>? _categoryRepository;


        public UnitOfWork(WegoContext context)
        {
            _context = context;
        }


        public IGenericRepository<Airline> AirlineRepository
        {
            get
            {
                if (_airlineRepository == null)
                {
                    _airlineRepository = new GenericRepository<Airline>(_context);
                }
                return _airlineRepository;
            }
        }
        public IGenericRepository<Airport> AirportRepository
        {
            get
            {
                if (_airportRepository == null)
                {
                    _airportRepository = new GenericRepository<Airport>(_context);
                }
                return _airportRepository;
            }
        }
        public IGenericRepository<Airplane> AirplaneRepository
        {
            get
            {
                if (_airplaneRepository == null)
                {
                    _airplaneRepository = new GenericRepository<Airplane>(_context);
                }
                return _airplaneRepository;
            }
        }
        public IGenericRepository<Feature> FeatureRepository
        {
            get
            {
                if (_featureRepository == null)
                {
                    _featureRepository = new GenericRepository<Feature>(_context);
                }
                return _featureRepository;
            }
        }
        public IGenericRepository<Location> LocationRepository
        {
            get
            {
                if (_locationRepository == null)
                {
                    _locationRepository = new GenericRepository<Location>(_context);
                }
                return _locationRepository;
            }
        }

        public IGenericRepository<Flight> FlightRepository
        {
            get
            {
                if (_flightRepository == null)
                {
                    _flightRepository = new GenericRepository<Flight>(_context);
                }
                return _flightRepository;
            }
        }
        public IGenericRepository<Terminal> TerminalRepository
        {
            get
            {
                if (_terminalRepository == null)
                {
                    _terminalRepository = new GenericRepository<Terminal>(_context);
                }
                return _terminalRepository;
            }
        }

        public IGenericRepository<Seat> SeatRepository
        {
            get
            {
                if (_seatRepository == null)
                {
                    _seatRepository = new GenericRepository<Seat>(_context);
                }
                return _seatRepository;
            }
        }

        public IGenericRepository<FlightBooking> FlightBookingRepository
        {
            get
            {
                if (_flightBookingRepository == null)
                {
                    _flightBookingRepository = new GenericRepository<FlightBooking>(_context);
                }
                return _flightBookingRepository;
            }
        }

        public IGenericRepository<Category> CategoryRepository
        {
            get
            {
                if (_categoryRepository == null)
                {
                    _categoryRepository = new GenericRepository<Category>(_context);
                }
                return _categoryRepository;
            }
        }

        // Initialize Repository as follow for lazy Initialization
        /*
            public IGenericRepository<Example> ExampleRepository
            {
                get
                {
                    if (_exampleRepository == null)
                    {
                        _exampleRepository = new GenericRepository<Example>(_context);
                    }
                    return _exampleRepository;
                }
            }
        */
        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
