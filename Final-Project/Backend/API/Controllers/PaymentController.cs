using Business_Layer.Services;
using Data_Layer.Context;
using Data_Layer.Entities.Booking;
using Data_Layer.Entities.enums;
using Data_Layer.Entities.StripeClasses;
using Data_Layer.Repositories;
using Data_Layer.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using System.Diagnostics;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private const string endpointSecret = "********";  / Your Webhook Secret Key whsec
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<FlightBooking> _flightBookingRepository;
        private readonly IRoomDetailsRepository _roomDetailsRepository;

        public PaymentController (IPaymentService paymentService,
            UserManager<ApplicationUser> userManager,
            IUnitOfWork unitOfWork,
            IRoomDetailsRepository roomDetailsRepository
            )
        {
            _paymentService = paymentService;
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _flightBookingRepository = _unitOfWork.FlightBookingRepository;
            _roomDetailsRepository = roomDetailsRepository;

        }
        [HttpPost("checkout")]
        [Authorize]
        public async Task<IActionResult> CreateCheckoutSession(PaymentRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if(userId is null)
                    return BadRequest("Invalid Request");
                // get User Email
                var user = await _userManager.FindByIdAsync(userId);
                if(user is null)
                    return NotFound("User does not exist");
                var userEmail = user.Email;
                if(userEmail is null)
                    return BadRequest("Invalid Request");
                string[] allowedTypes = ["flights", "rooms"];
                if (!allowedTypes.Contains(request.BookingType.ToLower()))
                    return BadRequest("Invalid Booking type");
                var baseUrl = $"{Request.Scheme}://{Request.Host}";
                var session = await _paymentService.CreatePaymentSessionAsync(request,userEmail, baseUrl);

                return Ok(new { url = session.Url });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost("stripe-webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    endpointSecret
                );

                var session = stripeEvent.Data.Object as Session;

                if (session == null)
                {
                    return BadRequest("Invalid session object.");
                }

                if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
                {
                    var bookingType = session.Metadata["BookingType"].ToLower();
                    var bookingIds = session.Metadata["BookingId"].Split(',')
                        .Select(e=>Convert.ToInt32(e));
                    if (bookingType =="flights")
                    {
                        foreach (var bookingId in bookingIds)
                        {
                            var flightBooking = await _flightBookingRepository.GetByIdAsync(bookingId);
                            if (flightBooking is null)
                                continue;
                            flightBooking.Status = FlightBookingStatus.Confirmed;

                            foreach (var seatReserved in flightBooking.SeatReservations)
                                if (seatReserved.Seat is { })
                                    seatReserved.Seat.IsAvailable = false;
                            await _flightBookingRepository.UpdateAsync(flightBooking);
                        }
                        await _unitOfWork.CompleteAsync();
                    }
                    else if (bookingType == "rooms")
                    {
                        foreach (var bookingId in bookingIds)
                        {
                            var roomBookign = await _roomDetailsRepository.GetByIdAsync(bookingId);
                            if (roomBookign is { })
                            {
                                roomBookign.Booking.Status = BookingStatus.Confirmed;
                                await _roomDetailsRepository.UpdateAsync(roomBookign);
                                await _unitOfWork.CompleteAsync();  
                            }

                        }
                    }
                    
                }

                return Ok(new { message = "Webhook processed successfully" });
            }
            catch (StripeException stripeEx)
            {
                // Log the exception for debugging
                Debug.WriteLine($"Stripe Exception: {stripeEx.Message}");
                return BadRequest(new { error = stripeEx.Message }); // Return a simple error message
            }
            catch (Exception ex)
            {
                // Handle general exceptions
                Debug.WriteLine($"General Exception: {ex.Message}");
                return BadRequest(new { error = "An error occurred while processing the request." });
            }
        }

    }
}
