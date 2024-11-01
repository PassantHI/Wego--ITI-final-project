using Data_Layer.Entities.Flights;
using Data_Layer.Repositories;
using Data_Layer.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Stripe.Climate;
using Utilities;

namespace Business_Layer.Services
{
    public class AirlineService : IAirlineService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Location> _locationRepository;

        public AirlineService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _locationRepository = unitOfWork.LocationRepository;
        }
        public async Task<IEnumerable<Airline>> GetFamousAirlineAsync(string country,int count=5)
        {
            var locations = await _locationRepository
                .GetAllAsync(l => l.Country.ToLower() == country.ToLower());
                
            if (!locations.Any())
                return Enumerable.Empty<Airline>();

            var airports = locations.SelectMany(l => l.Airports).ToList();

            if (!airports.Any())
                return Enumerable.Empty<Airline>();

            var terminals = airports
                .SelectMany(airport => airport.Terminals ?? Enumerable.Empty<Terminal>())
                .ToList();

            if (!terminals.Any())
                return Enumerable.Empty<Airline>();

            var flights = terminals
                .SelectMany(terminal => terminal.DepartureFlights ?? Enumerable.Empty<Flight>())
                .ToList();

            if (!flights.Any())
                return Enumerable.Empty<Airline>();

            var famousAirlineIds = flights
                .Where(f => f.AirlineId.HasValue)
                .GroupBy(f => f.AirlineId)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key.Value)
                .ToList();

            if (!famousAirlineIds.Any())
                return Enumerable.Empty<Airline>();

            var famousAirlines = new List<Airline>();

            foreach (var airlineId in famousAirlineIds.Take(count))
            {
                var airline = await _unitOfWork.AirlineRepository.GetByIdAsync(airlineId);
                if (airline != null)
                    famousAirlines.Add(airline);
            }

            return famousAirlines;
        }

        public void RemoveAirlineImage(Airline airline)
        {
            if (airline.Image is { })
                ImageHelper.RemoveImage("airlines", airline.Image);
        }

         public async Task<string> UpdateAirlineImageAsync(IFormFile img, Airline airline,HttpRequest request)
        {
            string folder = "airlines";
            string fileName = await ImageHelper
                .UploadImageAsync(img, folder, $"airline-{airline.Id}-logo");
            var serverUrl = $"{request.Scheme}://{request.Host.Value}";
            var imageUrl = $"{serverUrl}/imgs/{folder}/{fileName}";

            return imageUrl; 
        }
    }
}
