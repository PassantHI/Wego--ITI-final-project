using API.DTOs.AirportDtos;
using API.Mapper;
using Data_Layer.Entities.Flights;
using Data_Layer.Repositories;
using Data_Layer.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AirportsController : ControllerBase
    {
        private readonly IUnitOfWork _unit;
        private readonly IGenericRepository<Airport> _airportRepository;
        private readonly IGenericRepository<Location> _locationRepository;
        private readonly IMapper _mapper;
        public AirportsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unit = unitOfWork;
            _mapper = mapper;
            _airportRepository = _unit.AirportRepository;
            _locationRepository = _unit.LocationRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int pageIndex = 1, int pageSize = 10, string search = "")
        {
            IEnumerable<Airport> result = await _airportRepository
                .GetPaginatedAsync(pageIndex, pageSize,
                    a => string.IsNullOrEmpty(search) ||
                    a.Name.ToLower().Contains(search.ToLower()) ||
                    a.Location.City.ToLower().Contains(search.ToLower()) ||
                    a.Location.Country.ToLower().Contains(search.ToLower())
                );

            var resCount = await _airportRepository
                .CountAsync(a => string.IsNullOrEmpty(search) ||
                    a.Name.ToLower().Contains(search.ToLower()) ||
                    a.Location.City.ToLower().Contains(search.ToLower()) ||
                    a.Location.Country.ToLower().Contains(search.ToLower())
                );

            var res = _mapper.ToAirportDtoList(result);

            return Ok(new { data = res, Total = resCount });
        }

        [HttpGet("{routeId:int}")]
        public async Task<IActionResult> GetById(int routeId)
        {
            var airport = await _airportRepository.GetByIdAsync(routeId);
            if (airport is { })
            {
                var res = _mapper.ToAirportDto(airport);
                return Ok(res);
            }
            return NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> NewAirport(AirportPostDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var airport = _mapper.FromAirportDto(dto);

            try
            {
                await _airportRepository.AddAsync(airport);
                await _airportRepository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Error occured on saving");
            }
            airport.Location = await _locationRepository.GetByIdAsync(airport.LocationId);
            var res = _mapper.ToAirportDto(airport);

            return CreatedAtAction("GetById", new { routeId = airport.Id }, res);
        }

        [HttpPut("{routeId:int}")]
        public async Task<IActionResult> UpdateAirport(int routeId, AirportPutDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (routeId != dto.Id)
                return BadRequest("Route id and Airport Id did not match");

            var airport = await _airportRepository.GetByIdAsync(dto.Id);
            if (airport is not { })
                return NotFound();

            airport.Name = dto.Name ?? airport.Name;
            airport.Code = dto.Code ?? airport.Code;
            airport.LocationId = dto.LocationId ?? airport.LocationId;
            try
            {
                await _airportRepository.UpdateAsync(airport);
                await _airportRepository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Error occured on saving");
            }
            airport.Location = await _locationRepository.GetByIdAsync(airport.LocationId);

            var res = _mapper.ToAirportDto(airport);

            return Ok(res);
        }

        [HttpDelete("{routeId:int}")]
        public async Task<IActionResult> DeleteAirport(int routeId)
        {
            var airport = await _airportRepository.GetByIdAsync(routeId);
            if (airport is { })
            {
                if (airport.Terminals.Any())
                    return BadRequest("You have to remove Terminals associated with this airport first");

                await _airportRepository.DeleteAsync(airport);
                await _airportRepository.SaveChangesAsync();
                return NoContent();
            }
            return NotFound();
        }
    }
}
