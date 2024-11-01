using Data_Layer.Entities.enums;
using Data_Layer.Entities.Room;
using Data_Layer.Repositories;
using Data_Layer.Repositories.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomBookingDetailsController(IRoomDetailsRepository roomDetailsRepository) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomBookingDetails>>> GetAll()
        {
            var details = await roomDetailsRepository.GetListAsync();
            if (details != null && details.Any())
            {
                return Ok(details);
            }
            return NotFound();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DetailsDTO>> GetById(int id)
        {
            var details = await roomDetailsRepository.GetByIdAsync(id);
            if (details != null) return Ok(details);
            return NotFound();

        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<RoomDTO>> AddRoom(DetailsDTO detailsDTO)
        {
            if (ModelState.IsValid)
            {
                if (User.Identity.IsAuthenticated) {

                    var userId=User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    detailsDTO.Booking.UserId = userId;
                    var result = await roomDetailsRepository.AddRoomBookingDetailsAsync(detailsDTO);
                    return Ok(new { bookId = result }); ;
                }
                //"userId": "a9da0ba6-67ff-4a66-a1a7-bc8f4d61ad00",
            }
            return BadRequest();

        }

        [HttpPut]
        public async Task<ActionResult<RoomBookingDetails>> Update(DetailsDTO detailsDTO)
        {
            if (ModelState.IsValid)
            {
                var result = await roomDetailsRepository.UpdateAsync(detailsDTO);
                if (result) { return Ok(detailsDTO); }
                else return BadRequest("cant update");

            }

            return BadRequest();
        }

        [HttpDelete]
        public async Task<ActionResult> Delete(int detailsId)
        {
            var res = await roomDetailsRepository.DeleteAsync(detailsId);
            if (res) { return Ok("deleted"); }
            return BadRequest();
        }

        [HttpGet("user-booking")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<DetailsDTO>>> GetUserBooking()
        {
            if (User.Identity.IsAuthenticated)
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var bookingList = await roomDetailsRepository
                    .GetListAsync(a => a.Booking.UserId == userId && a.Booking.Status==BookingStatus.Confirmed);
                if (bookingList != null) return Ok(bookingList);

            }
            return BadRequest();


        }

        [HttpGet("list")]
        //public async Task<ActionResult<IEnumerable<DetailsDTO>>>
        public async Task<ActionResult<IEnumerable<DetailsDTO>>> list()
        {
            var rooms = await roomDetailsRepository.GetListAsync();
            if (rooms != null && rooms.Any()) return Ok(rooms);

            return NotFound();
        }

        [HttpGet("RoomReserve")]
        public async Task<ActionResult<IEnumerable<DetailsDTO>>> RoomReserve(int roomId, DateOnly checkin, DateOnly checkout)
        {
            var rooms = await roomDetailsRepository.GetListAsync(a => a.RoomId == roomId && a.Checkin <= checkout && a.Checkout >= checkin);
            if (rooms != null && rooms.Any()) return Ok(rooms);

            return NotFound();
        }


        [HttpGet("RoomAvailable")]
        public async Task<ActionResult<IEnumerable<DetailsDTO>>> RoomAvailable(int roomId, DateOnly checkin, DateOnly checkout)
        {
            var rooms = await roomDetailsRepository
                .GetListAsync(a => a.RoomId == roomId &&
                a.Checkin <= checkout &&
                a.Checkout >= checkin &&
                a.Booking.Status == BookingStatus.Confirmed);
            if (rooms != null && rooms.Any()) return BadRequest();

            return Ok();
        }



        [HttpGet("reservedDates")]
        public async Task<ActionResult> GetReservedDates(int roomId)
        {
            var reservations = await roomDetailsRepository
                .GetListAsync(a => a.RoomId == roomId && a.Booking.Status == BookingStatus.Confirmed);
            var reservedDates = new List<string>();

            foreach (var item in reservations)
            {
                for (var date = item.Checkin; date <= item.Checkout; date = date.AddDays(1))
                {
                    reservedDates.Add(date.ToString("yyyy-MM-dd"));
                }
            }
            return Ok(reservedDates);
        }

    }
}
