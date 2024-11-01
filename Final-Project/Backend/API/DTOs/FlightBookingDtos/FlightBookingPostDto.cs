using Data_Layer.Entities.enums;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.FlightBookingDtos
{
    public class FlightBookingPostDto
    {
        public string? UserId { get; set; }

        [Required]
        [RegularExpression(@"^(paypal|credit\s*card|debit\s*card|creditcard|debitcard|card)$")]
        public string PaymentMethod { get; set; }

        [Required]
        public int[] FlightIds { get; set; }

        [Required]
        [Range(1,99)]
        public int NumberOfSeats { get; set; }

        [Required]
        [Range(0,2)]
        public SeatClass ClassOfSeats { get; set; }

    }
}
