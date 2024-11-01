using System.ComponentModel.DataAnnotations;

namespace API.DTOs.TerminalDTOs
{
    public class TerminalPutDto
    {
        [Required]
        public int Id { get; set; }
        public string? Name { get; set; }
        public int? AirportId { get; set; }
    }
}