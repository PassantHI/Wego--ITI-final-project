using System.ComponentModel.DataAnnotations;

namespace API.DTOs.TerminalDTOs
{
    public class TerminalPostDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public int AirportId { get; set; }
    }
}