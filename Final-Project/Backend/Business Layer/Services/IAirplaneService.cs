using Data_Layer.Entities.Flights;

namespace Business_Layer.Services
{
    public interface IAirplaneService
    {
        Task UpdateAirplaneFeaturesAsync(Airplane airplane, IEnumerable<string> features);
        Task CreateAirplaneSeatsAsync(Airplane airplane, int economySeats, int businessSeats, int firstClassSeats);

    }
}
