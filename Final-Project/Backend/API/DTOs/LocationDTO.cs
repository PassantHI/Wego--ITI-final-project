using Data_Layer.Entities.Flights;

namespace API.DTOs
{
    public class LocationDTO
    {
        public int Id { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public int? AirportCount { get; set; }
        public IFormFile? Image {  get; set; }
        public string? ImageUrl {  get; set; }
        public ICollection<string>? Airports { get; set; } 
        public ICollection<int>? CategoryIds { get; set; }
        public ICollection<string>? Categories { get; set; }

        public static Location MapToLocation(LocationDTO locationDTO)
        {
            Location location = new Location()
            {
                Country = locationDTO.Country,
                City = locationDTO.City,
            };
            return location;
        }
        public static LocationDTO MapToLocationDTO(Location location)
        {
            LocationDTO locationDTO = new LocationDTO()
            {
                Id = location.Id,
                Country = location.Country,
                City = location.City,
                ImageUrl = location.Image,
                Categories = location.Categories.Select(c => c.Name).ToList(),
                CategoryIds = location.Categories.Select(c=>c.Id).ToList(),
                Airports= location.Airports.Select(a => a.Name).ToList(),
                AirportCount = location.Airports?.Count ?? 0,

            };


            return locationDTO;
        }
    }
}