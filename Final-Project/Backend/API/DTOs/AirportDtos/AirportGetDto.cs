namespace API.DTOs.AirportDtos
{
    public class AirportGetDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public int LocationId { get; set; }
        public ICollection<string> Terminals { get; set; }
        public ICollection<int> TerminalIds { get; set; }
    }
}
