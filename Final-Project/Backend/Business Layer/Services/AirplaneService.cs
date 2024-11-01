using Data_Layer.Entities.Flights;
using Data_Layer.Repositories;
using Data_Layer.UnitOfWork;
using Data_Layer.Entities.enums;

namespace Business_Layer.Services
{
    public class AirplaneService : IAirplaneService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<Feature> _featuresRepository;
        public AirplaneService(IUnitOfWork unitOfWork) 
        { 
            _unitOfWork = unitOfWork;
            _featuresRepository = _unitOfWork.FeatureRepository;
        }
        public async Task UpdateAirplaneFeaturesAsync(Airplane airplane, IEnumerable<string> features)
        {
            var feature = new Feature()
            {
                AirplaneId = airplane.Id,
                Wifi = features.Contains("wifi"),
                Usb = features.Contains("usb"),
                Meal = features.Contains("meal"),
                Video = features.Contains("video")
            };
            if (airplane.Feature is { })
                await _featuresRepository.DeleteAsync(airplane.Feature);
            await _featuresRepository.AddAsync(feature);
            airplane.Feature = feature;
        }

        public async Task CreateAirplaneSeatsAsync(Airplane airplane,
            int economySeats, int businessSeats,
            int firstClassSeats)
        {
            int maxSeats = Math.Max(economySeats, Math.Max(businessSeats, firstClassSeats));

            int economyCounter = 1, businessCounter = 1, firstClassCounter = 1;

            for (int i = 1; i <= maxSeats; i++)
            {
                if (economyCounter <= economySeats)
                {
                    Seat economySeat = new Seat()
                    {
                        AirplaneId = airplane.Id,
                        Class = SeatClass.Economy,
                        Number = $"EC{economyCounter++}",
                    };
                    airplane.Seats.Add(economySeat);
                }

                if (businessCounter <= businessSeats)
                {
                    Seat businessSeat = new Seat()
                    {
                        AirplaneId = airplane.Id,
                        Class = SeatClass.Business,
                        Number = $"BS{businessCounter++}",
                    };
                    airplane.Seats.Add(businessSeat);
                }

                if (firstClassCounter <= firstClassSeats)
                {
                    Seat firstClassSeat = new Seat()
                    {
                        AirplaneId = airplane.Id,
                        Class = SeatClass.FirstClass,
                        Number = $"FC{firstClassCounter++}",
                    };
                    airplane.Seats.Add(firstClassSeat);
                }
            }

            await _unitOfWork.CompleteAsync();
        }

    }
}
