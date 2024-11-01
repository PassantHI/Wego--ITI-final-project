using Data_Layer.Entities.Flights;
using Microsoft.AspNetCore.Http;

namespace Business_Layer.Services
{
    public interface IAirlineService
    {
        Task<string> UpdateAirlineImageAsync(IFormFile img, Airline airline,HttpRequest request);
        void RemoveAirlineImage(Airline airline);
        Task<IEnumerable<Airline>> GetFamousAirlineAsync(string country, int count = 5);
    }
}
