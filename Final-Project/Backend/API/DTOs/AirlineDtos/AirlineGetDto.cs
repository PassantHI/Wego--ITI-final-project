namespace API.DTOs.AirlineDtos
{
    public class AirlineGetDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Image { get; set; }
        public int Flights { get; set; }
        public int Airplanes { get; set; }
    }
}
