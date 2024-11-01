using Data_Layer.Entities.enums;
using Data_Layer.Entities.Flights;

namespace API.DTOs
{
    public class FlightDTO
    {
        public int Id { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public int Status { get; set; }
        public double PriceEconomyClass { get; set; }
        public double PriceBusinessClass { get; set; }
        public double PriceFirstClass { get; set; }
        public int? AirlineId { get; set; }
        public int AirplaneId { get; set; }
        public int DepartureTerminalId { get; set; }
        public int ArrivalTerminalId { get; set; }
        public int? NoOfBookings { get; set; }


        public static Flight MapToFlight(FlightDTO flightDTO)
        {
            Flight flight = new Flight()
            {
                DepartureTime = flightDTO.DepartureTime,
                ArrivalTime = flightDTO.ArrivalTime,
                Status = (FlightStatus)flightDTO.Status,
                EconomyClassPrice = flightDTO.PriceEconomyClass,
                BusinessClassPrice = flightDTO.PriceBusinessClass,
                FirstClassPrice = flightDTO.PriceFirstClass,
                AirplaneId = flightDTO.AirplaneId,
                DepartureTerminalId = flightDTO.DepartureTerminalId,
                ArrivalTerminalId = flightDTO.ArrivalTerminalId,
            };
            return flight;
        }
        public static FlightDTO MapToFlightDTO(Flight flight)
        {
            FlightDTO FlightDTO = new FlightDTO()
            {
                Id = flight.Id,
                DepartureTime = flight.DepartureTime,
                ArrivalTime = flight.ArrivalTime,
                Status = (int)flight.Status,
                PriceEconomyClass = flight.EconomyClassPrice,
                PriceBusinessClass = flight.BusinessClassPrice,
                PriceFirstClass = flight.FirstClassPrice,
                AirlineId = flight.Airplane?.AirlineId,
                AirplaneId = flight.AirplaneId,
                DepartureTerminalId = flight.DepartureTerminalId,
                ArrivalTerminalId = flight.ArrivalTerminalId,
                NoOfBookings = flight.FlightBookings.Count,
            };
            return FlightDTO;
        }
    }
}