using Data_Layer.Entities.enums;
using Data_Layer.Entities.Flights;
using System.Text.Json.Serialization;

namespace API.DTOs
{
    public class FlightTicketDTO
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("depart_airport_code")]
        public string DepartAirportCode { get; set; }

        [JsonPropertyName("depart_airport_name")]
        public string DepartAirportName { get; set; }

        [JsonPropertyName("arrival_airport_code")]
        public string ArrivalAirportCode { get; set; }

        [JsonPropertyName("arrival_airport_name")]
        public string ArrivalAirportName { get; set; }

        [JsonPropertyName("depart_date")]
        public DateTime DepartDate { get; set; }

        [JsonPropertyName("arrival_date")]
        public DateTime ArrivalDate { get; set; }

        [JsonPropertyName("flight_duration")]
        public int FlightDuration { get; set; }

        [JsonPropertyName("depart_terminal")]
        public string DepartTerminalName { get; set; }

        [JsonPropertyName("arrival_terminal")]
        public string ArrivalTerminalName { get; set; }

        [JsonPropertyName("airline_name")]
        public string AirlineName { get; set; }

        [JsonPropertyName("airline_logo")]
        public string AirlineLogo { get; set; }

        [JsonPropertyName("airplane_code")]
        public string AirplaneCode { get; set; }

        [JsonPropertyName("airplane_type")]
        public string AirplaneType { get; set; }

        [JsonPropertyName("trip_class")]
        public string TripClass { get; set; }

        [JsonPropertyName("price")]
        public double? Price { get; set; }

        [JsonPropertyName("features")]
        public Feature? AirplaneFeatures { get; set; }

        [JsonPropertyName("available_seats")]
        public int? AvailableSeats { get; set; }


        //public int Id { get; set; }
        //public string departAirportCode { get; set; }
        //public string DepartAirportName { get; set; }
        //public string ArrivalAirportCode { get; set; }
        //public string ArrivalAirportName { get; set; }
        //public DateTime DepartDate { get; set; }
        //public DateTime ArrivalDate { get; set; }
        //public int FlightDurationMinutes { get; set; }
        //public string DepartTerminalName {  get; set; }
        //public string ArrivalTerminalName { get; set; }
        //public string AirlineName { get; set; }
        //public string AirlineLogo { get; set; }
        //public string AirplaneCode { get; set; }
        //public string AirplaneType { get; set; }
        //public string? TripClass { get; set; }
        //public double? Price { get; set; }
        //public Feature? AirplaneFeatures {  get; set; }

        public static FlightTicketDTO MapToFlightTicketDTO(
            Flight flight, double price, string seatClass
            )
        {
            FlightTicketDTO flightTicketDTO = new FlightTicketDTO()
            {
                Id = flight.Id,
                DepartAirportCode = flight.DepartureTerminal.Airport.Code,
                DepartAirportName = flight.DepartureTerminal.Airport.Name,
                ArrivalAirportCode = flight.ArrivalTerminal.Airport.Code,
                ArrivalAirportName = flight.ArrivalTerminal.Airport.Name,
                DepartDate = flight.DepartureTime,
                ArrivalDate = flight.ArrivalTime,
                FlightDuration = CalculateDurationMinutes(flight.DepartureTime, flight.ArrivalTime),
                DepartTerminalName = flight.DepartureTerminal.Name,
                ArrivalTerminalName = flight.ArrivalTerminal.Name,
                AirlineName = flight.Airplane!.Airline?.Name ?? "",
                AirlineLogo = flight.Airplane!.Airline?.Image ?? "",
                AirplaneCode = flight.Airplane!.Code,
                AirplaneType = flight.Airplane!.Type,
                TripClass = seatClass,
                Price = price,
                AirplaneFeatures = flight.Airplane.Feature,
                AvailableSeats = flight.Airplane.Seats
                .Where(s=>s.IsAvailable && s.Class.ToString().ToLower()==seatClass.ToLower()).Count()
            };
            return flightTicketDTO;
        }

        private static int CalculateDurationMinutes(DateTime start, DateTime end)
        {
            TimeSpan duration = end - start;
            return (int)duration.TotalMinutes;
        }
        public static int GetAvailablelSeatsCount(Flight flight, SeatClass @class)
        {
            int seatNo = flight.Airplane.Seats
                .Where(s => s.IsAvailable == true && s.Class == SeatClass.Economy)
                .Count();
            return seatNo;
        }
    }
}