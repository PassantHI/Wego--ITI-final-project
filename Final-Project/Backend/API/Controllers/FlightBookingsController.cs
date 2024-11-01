using API.DTOs.FlightBookingDtos;
using API.Mapper;
using Business_Layer.Services;
using Data_Layer.Context;
using Data_Layer.Entities.Booking;
using Data_Layer.Entities.enums;
using Data_Layer.Entities.Flights;
using Data_Layer.Repositories;
using Data_Layer.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightBookingsController : ControllerBase
    {

        private readonly IUnitOfWork _unit;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IGenericRepository<Flight> _flightRepository;
        private readonly IGenericRepository<Seat> _seatRepository;
        private readonly IGenericRepository<FlightBooking> _flightBookingRepository;
        private readonly IFlightBookingService _flightBookingService;


        public FlightBookingsController(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            UserManager<ApplicationUser> userManager,
            IFlightBookingService flightBookingService
            )
        {
            _unit = unitOfWork;
            _mapper = mapper;
            _userManager = userManager;
            _flightRepository = _unit.FlightRepository;
            _seatRepository = _unit.SeatRepository;
            _flightBookingRepository = _unit.FlightBookingRepository;
            _flightBookingService = flightBookingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int pageIndex = 1, int pageSize = 10, string filter = "")
        {

            Expression<Func<FlightBooking, bool>> expression = filter.ToLower() switch
            {
                "confirmed" => (fb => fb.Status == FlightBookingStatus.Confirmed),
                "cancelled" => (fb => fb.Status == FlightBookingStatus.Cancelled),
                "pending" => (fb => fb.Status == FlightBookingStatus.Pending),
                _ => (fb => true)
            };
            var result = await _flightBookingRepository
                .GetPaginatedAsync(pageIndex, pageSize, expression);

            var resCount = await _flightBookingRepository
                .CountAsync(expression);

            var res = _mapper.ToFlightBookingDtoList(result);

            return Ok(new { data = res, Total = resCount });

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> BookFlight(FlightBookingPostDto bookingDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null)
                return BadRequest("Invalid Request");

            var user = await _userManager.FindByIdAsync(userId);
            if (user is null)
                return NotFound("User does not exist");


            bookingDto.UserId = userId;

            if (bookingDto.FlightIds.Count() > 2)
                return BadRequest("Cant Book More That Two Flights");

            List<FlightBooking> bookings = new List<FlightBooking>();
            foreach (int flightId in bookingDto.FlightIds) { 

                var flight = await _flightRepository.GetByIdAsync(flightId);

                if (flight is null)
                    return NotFound("Flight does not exist");

                var isBookable = flight.DepartureTime > DateTime.Now.AddHours(2);
                if (!isBookable)
                    return BadRequest("This flight cant be Booked (Already departed or there is less than 6 hours until departure)");

                if (
                    flight.Airplane.Seats
                    .Where(s=>s.Class==bookingDto.ClassOfSeats && s.IsAvailable)
                    .Count() < bookingDto.NumberOfSeats
                    )
                    return BadRequest("Available Seats Are not enough");

                var seats = flight.Airplane.Seats
                    .Where(s=>s.IsAvailable && s.Class == bookingDto.ClassOfSeats)
                    .Take(bookingDto.NumberOfSeats);

                var flightBooking = _mapper.FromFlightBookingDto(bookingDto,flightId);

                try
                {
                    await _flightBookingService.BookFlightAsync(flightBooking,seats);
                    bookings.Add(flightBooking);

                }
                catch
                {
                    foreach (var fb in bookings)
                        await _flightBookingRepository.DeleteAsync(fb);

                    await _flightBookingRepository.SaveChangesAsync();
                    return BadRequest("Error ocurred while booking flight / booking seat");
                }
            }
            return Ok(new { bookingIds = bookings.Select(b=>b.Id),TotalPrice=bookings.Sum(b=>b.TotalPrice)});

        }



        [HttpGet("{routeId:int}")]
        public async Task<IActionResult> GetById(int routeId)
        {
            var booking = await _flightBookingRepository.GetByIdAsync(routeId);
            if (booking is { })
            {
                var res = _mapper.ToFlightBookingDto(booking);
                return Ok(res);
            }
            return NotFound();

        }
        [HttpPost("{routeId:int}/cancel")]
        public async Task<IActionResult> CancelBooking(int routeId)
        {
            var booking = await _flightBookingRepository.GetByIdAsync(routeId);
            if (booking is { })
            {
                if (booking.Status == FlightBookingStatus.Cancelled
                    || booking.Status == FlightBookingStatus.Confirmed)
                    return BadRequest("Cant cancel already confirmed or canceled booking");
                try 
                { 
                    booking.Status = FlightBookingStatus.Cancelled;
                    await _flightBookingRepository.UpdateAsync(booking);
                    await _flightBookingRepository.SaveChangesAsync();
                }
                catch
                {
                    return BadRequest("Error Ocurred while canceling booking");
                }

            }
            return NotFound();
        }

        [HttpGet("my-bookings")]
        [Authorize]
        public async Task<IActionResult> GetUserFlightsBookings()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null)
                return BadRequest("Invalid Request");

            var user = await _userManager.FindByIdAsync(userId);
            if (user is null)
                return NotFound("User does not exist");

            var flights = user.FlightBookings.Where(fb => fb.Status == FlightBookingStatus.Confirmed);
            var res = flights.Select(fs => new 
            { 
                BookingId = fs.Id,
                fs.FlightId,
                From = fs.Flight?.DepartureTerminal.Airport.Name ?? "",
                To = fs.Flight?.ArrivalTerminal.Airport.Name ?? "",
                DepartDate= fs.Flight?.DepartureTime.ToString("MMM dd yyyy"),
                ArriveDate= fs.Flight?.ArrivalTime.ToString("MMM dd yyyy"),
                DepartTime= fs.Flight?.DepartureTime.ToString("HH:mm"),
                ArriveTime = fs.Flight?.ArrivalTime.ToString("HH:mm"),
                Status = fs.Status.ToString(),
                PaymentMethod=fs.PaymentMethod.ToString(),
                fs.TotalPrice,
                SeatsCount =fs.SeatReservations.Count,
                SeatNumbers = fs.SeatReservations.Select(s=>s.Seat?.Number)
            });
            return Ok(res);
        }

    }
}
