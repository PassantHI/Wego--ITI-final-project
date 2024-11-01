using API.DTOs.AirlineDtos;
using API.DTOs.AirplaneDto;
using API.DTOs.AirportDtos;
using API.DTOs.FlightBookingDtos;
using API.DTOs.TerminalDTOs;
using Data_Layer.Entities.Booking;
using Data_Layer.Entities.Flights;

namespace API.Mapper
{
    public interface IMapper
    {
        AirlineGetDto ToAirlineDto(Airline airline);
        IEnumerable<AirlineGetDto> ToAirlineDtoList(IEnumerable<Airline> airlines);
        Airline FromAirlineDto(AirlinePostDto dto);

        AirportGetDto ToAirportDto(Airport airport);
        IEnumerable<AirportGetDto> ToAirportDtoList(IEnumerable<Airport> airports);
        Airport FromAirportDto(AirportPostDto dto);

        AirplaneGetDto ToAirplaneDto(Airplane airplane);
        IEnumerable<AirplaneGetDto> ToAirplaneDtoList(IEnumerable<Airplane> airplanes);
        Airplane FromAirplaneDto(AirplanePostDto dto);

        FlightBookingGetDto ToFlightBookingDto(FlightBooking flightBooking);
        IEnumerable<FlightBookingGetDto> ToFlightBookingDtoList(IEnumerable<FlightBooking> flightBookings);
        FlightBooking FromFlightBookingDto(FlightBookingPostDto dto,int flightId);

        TerminalGetDto ToTerminalDto(Terminal terminal);
        IEnumerable<TerminalGetDto> ToTerminalDtoList(IEnumerable<Terminal> terminals);
        Terminal FromTerminalDto(TerminalPostDto dto);
    }
}
