namespace API.DTOs.AirplaneDto
{
    public class AirplaneGetDto
    {
        public int Id { get; set; }

        public string Code { get; set; }

        public string Type { get; set; }
        public int AirlineId { get; set; }

        public string Airline { get; set; }

        public int TotalFlights { get; set; }
        public int TotalSeats { get; set; }

        public IEnumerable<string> Features { get; set; }
    }
}
