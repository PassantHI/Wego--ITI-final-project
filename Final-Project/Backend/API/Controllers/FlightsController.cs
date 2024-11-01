using API.DTOs;
using Data_Layer.Entities.enums;
using Data_Layer.Entities.Flights;
using Data_Layer.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private IUnitOfWork _unitOfWork { get; }

        public FlightsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        [HttpGet("All")]
        public async Task<ActionResult<IEnumerable<FlightTicketDTO>>> GetAll()
        {
            var flights = await _unitOfWork.FlightRepository.GetAllAsync();

            List<FlightTicketDTO> flightTicketDTOs = new List<FlightTicketDTO>();
            foreach (var flight in flights)
            {

                FlightTicketDTO flightTicketDTO = FlightTicketDTO
                    .MapToFlightTicketDTO(flight, flight.EconomyClassPrice, "Economy");

                flightTicketDTOs.Add(flightTicketDTO);

                if (flightTicketDTOs.Count == 0)
                {
                    return BadRequest();
                }
            }
            return Ok(flightTicketDTOs);
        }

        [HttpGet("searchForTicket")]
        public async Task<ActionResult<IEnumerable<FlightTicketDTO>>> SearchForFlightTicket(
            int departAirportId, int arrivalAirportId,
            DateTime departDate, int noOfSeats, SeatClass seatClass
            )
        {
            if (departDate.Date < DateTime.Now.Date) 
                return BadRequest("Invalid Date");

            var flights = await _unitOfWork.FlightRepository.GetAllAsync(
                f => f.DepartureTerminal.Airport.Id == departAirportId
                && f.ArrivalTerminal.Airport.Id == arrivalAirportId
                && f.DepartureTime.Date == departDate.Date
                && f.DepartureTime > DateTime.Now.AddHours(2)
                && f.Airplane.Seats.Where(s=>s.Class == seatClass &&s.IsAvailable).Count() >= noOfSeats
                );

            if (flights is null)
            {
                return NotFound();
            }

            List<FlightTicketDTO> flightTicketDTOs = new List<FlightTicketDTO>();
            foreach (var flight in flights)
            {
                double _price = 0;
                string _seatClass = "";

                switch (seatClass)
                {
                    case SeatClass.Economy:
                        _seatClass = "Economy";
                        _price = flight.EconomyClassPrice;
                        break;

                    case SeatClass.Business:
                        _seatClass = "Business";
                        _price = flight.BusinessClassPrice;
                        break;

                    case SeatClass.FirstClass:
                        _seatClass = "FirstClass";
                        _price = flight.FirstClassPrice;
                        break;
                }

                FlightTicketDTO flightTicketDTO = FlightTicketDTO
                    .MapToFlightTicketDTO(flight, _price, _seatClass);

                if (FlightTicketDTO.GetAvailablelSeatsCount(flight, seatClass) >= noOfSeats
                    && flight.Status == FlightStatus.Scheduled
                )
                {
                    flightTicketDTOs.Add(flightTicketDTO);
                }

                if (flightTicketDTOs.Count == 0)
                {
                    return BadRequest();
                }
            }
            return Ok(flightTicketDTOs);
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<FlightDTO>>> GetAllFlightss()
        {
            var flights = await _unitOfWork.FlightRepository.GetAllAsync();

            if (flights is null)
            {
                return NotFound();
            }

            List<FlightDTO> flightDTOs = new List<FlightDTO>();
            foreach (var flight in flights)
            {
                flightDTOs.Add(FlightDTO.MapToFlightDTO(flight));
            }
            return Ok(flightDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FlightDTO>> GetFlight(int? id)
        {
            var flight = await _unitOfWork.FlightRepository.GetByIdAsync(id.Value);

            if (flight == null)
            {
                return NotFound();
            }

            return Ok(FlightDTO.MapToFlightDTO(flight));
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> EditFlight(int id, FlightDTO flightDTO)
        {
            if (id != flightDTO.Id)
            {
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                var flight = await _unitOfWork.FlightRepository.GetByIdAsync(id);
                flight.AirlineId = flightDTO.AirlineId;
                flight.AirplaneId = flightDTO.AirplaneId;
                flight.ArrivalTime = flightDTO.ArrivalTime;
                flight.DepartureTime = flightDTO.DepartureTime;
                flight.DepartureTerminalId = flightDTO.DepartureTerminalId;
                flight.ArrivalTerminalId = flightDTO.ArrivalTerminalId;
                flight.Status = (FlightStatus) flightDTO.Status;
                flight.EconomyClassPrice = flightDTO.PriceEconomyClass;
                flight.FirstClassPrice = flightDTO.PriceFirstClass;
                flight.BusinessClassPrice= flightDTO.PriceBusinessClass;

                if (flight.Status == FlightStatus.Arrived || flight.Status == FlightStatus.Cancelled)
                {
                    foreach (var seat in flight.Airplane.Seats)
                    {
                        if (seat is { })
                        seat.IsAvailable = true;
                    }
                }
                await _unitOfWork.FlightRepository.UpdateAsync(flight);

            }
            else return BadRequest();

            try
            {
                await _unitOfWork.FlightRepository.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlightExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }



        [HttpPost]
        public async Task<ActionResult<Flight>> AddFlight(FlightDTO flightDTO)
        {
            Flight? flight = null;
            if (flightDTO != null)
            {
                flight = FlightDTO.MapToFlight(flightDTO);
            }
            if (ModelState.IsValid)
            {
                await _unitOfWork.FlightRepository.AddAsync(flight);
            }
            else return BadRequest();

            try
            {
                await _unitOfWork.FlightRepository.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return CreatedAtAction("GetFlight", new { id = flight.Id }, flight);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            var flight = await _unitOfWork.FlightRepository.GetByIdAsync(id);

            if (flight == null)
            {
                return NotFound();
            }
            if (flight.FlightBookings.Count>0)
                return BadRequest("There is Bookings Assocciated to this flight");
            await _unitOfWork.FlightRepository.DeleteAsync(flight);

            try
            {
                await _unitOfWork.FlightRepository.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            return NoContent();
        }

        private bool FlightExists(int id)
        {
            var flight = _unitOfWork.FlightRepository.GetById(id);
            if (flight == null) return false;
            return true;
        }
    }
}