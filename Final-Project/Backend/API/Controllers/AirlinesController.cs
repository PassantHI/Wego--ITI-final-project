using API.DTOs.AirlineDtos;
using API.Mapper;
using Business_Layer.Services;
using Data_Layer.Entities.Flights;
using Data_Layer.Repositories;
using Data_Layer.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe.Climate;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AirlinesController : ControllerBase
    {
        private readonly IUnitOfWork _unit;
        private readonly IGenericRepository<Airline> _airlineRepository;
        private readonly IAirlineService _airlineService;
        private readonly IMapper _mapper;
        public AirlinesController(IUnitOfWork unitOfWork,IAirlineService airlineService, IMapper mapper)
        {
            _unit = unitOfWork;
            _mapper = mapper;
            _airlineRepository = _unit.AirlineRepository;
            _airlineService = airlineService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll(int pageIndex = 1, int pageSize = 10, string search = "")
        {
            IEnumerable<Airline> result = await _airlineRepository
                .GetPaginatedAsync(pageIndex, pageSize,
                    a => string.IsNullOrEmpty(search) ||
                    a.Name.ToLower().Contains(search.ToLower())
                );

            var resCount = await _airlineRepository
                .CountAsync(a => string.IsNullOrEmpty(search) ||
                a.Name.ToLower().Contains(search.ToLower()));

            var res = _mapper.ToAirlineDtoList(result);

            return Ok(new { data = res, Total = resCount });
        }

        [HttpGet("{routeId:int}")]
        public async Task<IActionResult> GetById(int routeId)
        {
            var airline = await _airlineRepository.GetByIdAsync(routeId);
            if (airline is { })
            {
                var res = _mapper.ToAirlineDto(airline);
                return Ok(res);
            }
            return NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> NewAirline([FromForm]AirlinePostDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var airline = _mapper.FromAirlineDto(dto);

            try
            {
                await _airlineRepository.AddAsync(airline);
                await _airlineRepository.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("Error occured while adding");
            }

            try
            {
                var request = HttpContext.Request;
                airline.Image = await _airlineService.UpdateAirlineImageAsync(dto.Image, airline,request);
                await _airlineRepository.UpdateAsync(airline);
                await _airlineRepository.SaveChangesAsync();
            }
            catch
            {
                await _airlineRepository.DeleteAsync(airline);
                return BadRequest("Error ocurred while updating images");
            }

            var res = _mapper.ToAirlineDto(airline);

            return CreatedAtAction("GetById", new { routeId = airline.Id }, res);
        }

        [HttpPut("{routeId:int}")]
        public async Task<IActionResult> UpdateAirline(int routeId, AirlinePutDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (routeId != dto.Id)
                return BadRequest("Route id and Airline Id did not match");

            var airline = await _airlineRepository.GetByIdAsync(dto.Id);
            if (airline is not { })
                return NotFound();

            airline.Name = dto.Name ?? airline.Name;
            airline.Code = dto.Code ?? airline.Code;

            if (dto.Image is { })
            {
                var request = HttpContext.Request;
                _airlineService.RemoveAirlineImage(airline);
                airline.Image = await _airlineService.UpdateAirlineImageAsync(dto.Image, airline,request);
            }
            try
            {
                await _airlineRepository.UpdateAsync(airline);
                await _airlineRepository.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("Error ocurred while updating");
            }
            var res = _mapper.ToAirlineDto(airline);

            return Ok(res);
        }

        [HttpDelete("{routeId:int}")]
        public async Task<IActionResult> DeleteAirline(int routeId)
        {
            var airline = await _airlineRepository.GetByIdAsync(routeId);
            if (airline is { })
            {
                if (airline.Airplanes.Any())
                    return BadRequest("You have to remove airplanes associated with this airline first");

                _airlineService.RemoveAirlineImage(airline);
                await _airlineRepository.DeleteAsync(airline);
                await _airlineRepository.SaveChangesAsync();
                return NoContent();
            }
            return NotFound();
        }

        [HttpGet("{routeId:int}/flights")]
        public async Task<IActionResult> AirlineFlights(int routeId)
        {
            var airline = await _airlineRepository.GetByIdAsync(routeId);
            if ( airline is { })
            {
                var flights = airline.Flights;
                var res = flights
                    .Select(f=>new {
                        Id= f.Id,
                        DepartureTime = f.DepartureTime.ToString("hh:mm tt"),
                        ArrivalTime = f.ArrivalTime.ToString("hh:mm tt"),
                        DepartureAirport = f.DepartureTerminal.Airport.Name,
                        ArrivalAirport = f.ArrivalTerminal.Airport.Name,
                        From = f.DepartureTerminal.Airport.Location.Country,
                        To = f.ArrivalTerminal.Airport.Location.Country
                    });
                return Ok(res);
            }
            return NotFound();
        }

        [HttpGet("{routeId:int}/airplanes")]
        public async Task<IActionResult> AirlineAirplanes(int routeId)
        {
            var airline = await _airlineRepository.GetByIdAsync(routeId);
            if (airline is { })
            {
                var airplanes = airline.Airplanes;
                var res = airplanes
                    .Select(a => new {
                        a.Id,
                        a.Type,
                        a.Code,
                        Features = a.Feature,
                    });
                return Ok(res);
            }
            return NotFound();
        }


        [HttpGet("popular")]
        public async Task<IActionResult> PopularAirline(string country, int count = 5)
        {
            var airlines = await _airlineService.GetFamousAirlineAsync(country, count);

            var res = _mapper.ToAirlineDtoList(airlines);

            return Ok(res);
        }
    }
}
