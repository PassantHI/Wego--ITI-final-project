using API.DTOs.AirlineDtos;
using API.DTOs.AirplaneDto;
using API.DTOs.AirportDtos;
using API.DTOs.FlightBookingDtos;
using API.DTOs.TerminalDTOs;
using Data_Layer.Entities.Booking;
using Data_Layer.Entities.enums;
using Data_Layer.Entities.Flights;

namespace API.Mapper
{
    public class Mapper : IMapper
    {
        public Airline FromAirlineDto(AirlinePostDto dto)
        {
            Airline airline = new() {
                Name = dto.Name,
                Code = dto.Code,
            };
            return airline;
        }

        public AirlineGetDto ToAirlineDto(Airline airline)
        {
            AirlineGetDto dto = new() {
                Id = airline.Id,
                Name = airline.Name,
                Code = airline.Code,
                Image = airline.Image ?? "",
                Airplanes= airline.Airplanes.Count,
                Flights = airline.Flights.Count,
            };
            return dto;
        }

        public IEnumerable<AirlineGetDto> ToAirlineDtoList(IEnumerable<Airline> airlines)
        {
            ICollection<AirlineGetDto> dtos = [];
            foreach (Airline airline in airlines)
            {
                dtos.Add(ToAirlineDto(airline));
            }
            return dtos;
        }

        public Airplane FromAirplaneDto(AirplanePostDto dto)
        {
            Airplane airplane = new()
            {
                Code = dto.Code,
                Type = dto.Type,
                AirlineId = dto.AirlineId,
            };
            return airplane;
        }

        public AirplaneGetDto ToAirplaneDto(Airplane airplane)
        {
            AirplaneGetDto dto = new()
            {
                Id = airplane.Id,
                Type = airplane.Type,
                Code = airplane.Code,
                Airline = airplane.Airline?.Name ?? "",
                TotalFlights = airplane.Flights.Count,
                AirlineId = airplane.AirlineId ?? 0,
                TotalSeats = airplane.Seats.Count,
            };
            List<string> features = [];
            if (airplane.Feature.Meal)
                features.Add("meal");
            if (airplane.Feature.Wifi)
                features.Add("wifi");
            if (airplane.Feature.Video)
                features.Add("video");
            if (airplane.Feature.Usb)
                features.Add("usb");
            dto.Features = features;
            return dto;
        }

        public IEnumerable<AirplaneGetDto> ToAirplaneDtoList(IEnumerable<Airplane> airplanes)
        {
            ICollection<AirplaneGetDto> dtos = [];
            foreach(Airplane airplane in airplanes)
            {
                dtos.Add(ToAirplaneDto(airplane));
            }
            return dtos;
        }

        public Airport FromAirportDto(AirportPostDto dto)
        {
            Airport airport = new()
            {
                Code = dto.Code,
                Name = dto.Name,
                LocationId = dto.LocationId,
            };
            return airport;
        }

        public AirportGetDto ToAirportDto(Airport airport)
        {
            AirportGetDto dto = new()
            {
                Id = airport.Id,
                Code = airport.Code,
                Name = airport.Name,
                City = airport.Location.City,
                Country = airport.Location.Country,
                Terminals = airport.Terminals.Select(t => t.Name).ToList(),
                TerminalIds = airport.Terminals.Select(t=>t.Id).ToList(),
                LocationId = airport.LocationId,
                
            };
            return dto;
        }

        public IEnumerable<AirportGetDto> ToAirportDtoList(IEnumerable<Airport> airports)
        {
            ICollection<AirportGetDto> dtos = [];
            foreach (Airport airport in airports)
            {
                dtos.Add(ToAirportDto(airport));
            }
            return dtos;
        }

        public FlightBookingGetDto ToFlightBookingDto(FlightBooking flightBooking)
        {
            FlightBookingGetDto dto = new()
            {
                Id = flightBooking.Id,
                DepartureCity = flightBooking.Flight?.DepartureTerminal.Airport.Location.City ?? "",
                ArrivalCity = flightBooking.Flight?.ArrivalTerminal.Airport.Location.City ?? "",
                DepartureTime = flightBooking.Flight?.DepartureTime.ToString("hh:mm tt") ?? "",
                ArrivalTime = flightBooking.Flight?.ArrivalTime.ToString("hh:mm tt") ?? "",
                DepartureDate = flightBooking.Flight?.DepartureTime.ToString("MMM dd yyyy") ?? "",
                ArrivalDate = flightBooking.Flight?.ArrivalTime.ToString("MMM dd yyyy") ?? "",
                Status = flightBooking.Status.ToString(),
                User = flightBooking.User?.UserName ?? "",
                PaymentMethod = flightBooking.PaymentMethod.ToString(),
                BookingDate = flightBooking.BookingDate.ToString("D"),
                SeatNumbers = flightBooking.SeatReservations.Select(s=>s.Seat?.Number ?? "").ToList(),
                TotalPrice =  flightBooking.TotalPrice,
            };


            return dto;
        }

        public IEnumerable<FlightBookingGetDto> ToFlightBookingDtoList(IEnumerable<FlightBooking> flightBookings)
        {
            ICollection<FlightBookingGetDto> dtos = [];
            foreach (FlightBooking flightBooking in flightBookings)
            {
                dtos.Add(ToFlightBookingDto(flightBooking));
            }
            return dtos;
        }

        public FlightBooking FromFlightBookingDto(FlightBookingPostDto dto,int flightId)
        {
            FlightBooking flightBooking = new()
            {
                UserId = dto.UserId,
                FlightId = flightId,
                PaymentMethod = dto.PaymentMethod.ToLower() switch
                {
                    "paypal" => PaymentMethod.Paypal,
                    "creditcard" => PaymentMethod.CreditCard,
                    "credit card" => PaymentMethod.CreditCard,
                    "debitcard" => PaymentMethod.DebitCard,
                    "debit card" => PaymentMethod.DebitCard,
                    _ => PaymentMethod.CreditCard,
                }
            };
            return flightBooking;
        }

        public Terminal FromTerminalDto(TerminalPostDto dto)
        {
            Terminal terminal = new()
            {
                Name = dto.Name,
                AirportId = dto.AirportId,
            };
            return terminal;
        }

        public TerminalGetDto ToTerminalDto(Terminal terminal)
        {
            TerminalGetDto dto = new TerminalGetDto()
            {
                Id = terminal.Id,
                Name = terminal.Name,
                AirportName = terminal.Airport.Name,
                AirportId = terminal.Airport.Id,
            };
            return dto;
        }

        public IEnumerable<TerminalGetDto> ToTerminalDtoList(IEnumerable<Terminal> terminals)
        {
            ICollection<TerminalGetDto> dtos = [];
            foreach (Terminal terminal in terminals)
            {
                dtos.Add(ToTerminalDto(terminal));
            }
            return dtos;
        }
    }
}
