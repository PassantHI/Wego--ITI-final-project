using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Data_Layer.Entities.Booking;
using Data_Layer.Entities.enums;

namespace Data_Layer.Entities.Flights
{
    public class Flight
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime DepartureTime { get; set; }

        [Required]
        public DateTime ArrivalTime { get; set; }

        [Required]
        public FlightStatus Status { get; set; } = FlightStatus.Scheduled;

        [Required]
        public double EconomyClassPrice { get; set; }

        [Required]
        public double BusinessClassPrice { get; set; }

        [Required]
        public double FirstClassPrice { get; set; }

        public int? AirlineId { get; set; }
        [ForeignKey("AirlineId")]
        public virtual Airline? Airline { get; set; }

        public int AirplaneId { get; set; }
        [ForeignKey("AirplaneId")]
        public virtual Airplane Airplane { get; set; }

        [Required]
        public int DepartureTerminalId { get; set; }
        [ForeignKey("DepartureTerminalId")]
        public virtual Terminal DepartureTerminal { get; set; }

        [Required]
        public int ArrivalTerminalId { get; set; }
        [ForeignKey("ArrivalTerminalId")]
        public virtual Terminal ArrivalTerminal { get; set; }

        public virtual ICollection<FlightBooking> FlightBookings { get; set; } = new List<FlightBooking>();

    }
}
