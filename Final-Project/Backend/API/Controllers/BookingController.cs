using Data_Layer.Context;
using Data_Layer.Entities.Room;
using Data_Layer.Repositories;
using Data_Layer.Repositories.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController(IBookingRepositroy bookingRepositroy, UserManager<ApplicationUser> userManager) : ControllerBase
    {

        //[HttpPost]

        //public async Task<ActionResult<BookingDTO>> AddBooking([FromBody]BookingDTO bookingDTO)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        bookingDTO.UserId = "a9da0ba6-67ff-4a66-a1a7-bc8f4d61ad00";
        //            var result = await bookingRepositroy.AddAsync(bookingDTO);
        //            if (result) return Ok();


        //    }
        //    return BadRequest("notvalid");


        //}



        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAll()
        {
            var bookings = await bookingRepositroy.GetListAsync();
            if (bookings != null && bookings.Any())
            {
                return Ok(bookings);
            }
            return NotFound();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDTO>> GetById(int id)
        {
            var bookings = await bookingRepositroy.GetByIdAsync(id);
            if (bookings != null) return Ok(bookings);
            return NotFound();

        }


        [HttpPost]
        public async Task<ActionResult<BookingDTO>> AddBooking(BookingDTO bookingDTO)
        {
            if (ModelState.IsValid)
            {
                if (User.Identity is { } && User.Identity.IsAuthenticated)
                {
                    string userId = User
                        .FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                    if (userId == null) return BadRequest();

                    bookingDTO.UserId = userId;
                    var result = await bookingRepositroy.AddAsync(bookingDTO);
                    if (result) return Ok();
                }
            }
            return BadRequest();
        }

        [HttpPut]
        public async Task<ActionResult<Booking>> Update(BookingDTO bookingDTO)
        {
            if (ModelState.IsValid)
            {
                var result = await bookingRepositroy.UpdateAsync(bookingDTO);
                if (result) { return Ok(bookingDTO); }
                else return BadRequest("cant update");
            }
            return BadRequest();
        }


        [HttpDelete]
        public async Task<ActionResult> Delete(int bookingId)
        {
            var res = await bookingRepositroy.DeleteAsync(bookingId);
            if (res) { return Ok("deleted"); }
            return BadRequest();
        }
    }
}
