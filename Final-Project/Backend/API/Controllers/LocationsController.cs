using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_Layer.Entities.Flights;
using Data_Layer.UnitOfWork;
using API.DTOs;
using Utilities;
using Business_Layer.Services;
using Stripe.Climate;
using Stripe.Terminal;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        private IUnitOfWork _unitOfWork { get; }

        public LocationsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/Locations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LocationDTO>>> GetAllLocations()
        {
            var locations = await _unitOfWork.LocationRepository.GetAllAsync();

            if (locations is null)
            {
                return NotFound();
            }

            List<LocationDTO> locationDTOs = new List<LocationDTO>();
            foreach (var location in locations)
            {
                locationDTOs.Add(LocationDTO.MapToLocationDTO(location));
            }
            return Ok(locationDTOs);
        }

        // GET: api/Locations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LocationDTO>> GetLocation(int id)
        {
            var location = await _unitOfWork.LocationRepository.GetByIdAsync(id);

            if (location == null)
            {
                return NotFound();
            }

            return Ok(LocationDTO.MapToLocationDTO(location));
        }

        // PUT: api/Locations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> EditLocation(int id, LocationDTO locationDTO)
        {
            if (id != locationDTO.Id)
            {
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                var location = await _unitOfWork.LocationRepository.GetByIdAsync(id);
                location.City = locationDTO.City ?? location.City;
                location.Country = locationDTO.Country ?? location.Country;

                if (locationDTO.Image is { })
                {
                    ImageHelper.RemoveImage("locations",location.Image ?? "");
                    var request = HttpContext.Request;
                    location.Image = await GetImageUrl(locationDTO.Image,location.Id,request);
                }
                if (locationDTO.CategoryIds is { } && locationDTO.CategoryIds.Any())
                {
                    location.Categories.Clear();
                    foreach (var categoryId in locationDTO.CategoryIds)
                    {
                        var category = await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId);
                        location.Categories.Add(category);
                    }
                }
                try
                {
                    await _unitOfWork.LocationRepository.UpdateAsync(location);
                    await _unitOfWork.LocationRepository.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!LocationExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }


                return Ok(LocationDTO.MapToLocationDTO(location));
            }
            return BadRequest();
        }

        // POST: api/Locations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LocationDTO>> AddLocation(LocationDTO locationDTO)
        {
            if (ModelState.IsValid)
            {
                var location = LocationDTO.MapToLocation(locationDTO);
                await _unitOfWork.LocationRepository.AddAsync(location);
                if (locationDTO.CategoryIds.Any())
                {
                    foreach (var categoryId in locationDTO.CategoryIds)
                    {
                        var category = await _unitOfWork.CategoryRepository.GetByIdAsync(categoryId);
                        location.Categories.Add(category);
                    }
                }
                try
                {
                    await _unitOfWork.LocationRepository.SaveChangesAsync();
                    if (locationDTO.Image is { })
                    {
                        var request = HttpContext.Request;
                        location.Image = await GetImageUrl(locationDTO.Image, location.Id, request);
                    }
                    await _unitOfWork.LocationRepository.UpdateAsync(location);
                    await _unitOfWork.LocationRepository.SaveChangesAsync();
                }

                catch (Exception e)
                {
                    throw new Exception(e.Message);
                }

                return CreatedAtAction("GetLocation", new { id = location.Id }, LocationDTO.MapToLocationDTO(location));
            }

            return BadRequest();
        }

        // DELETE: api/Locations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLocation(int id)
        {
            var location = await _unitOfWork.LocationRepository.GetByIdAsync(id);

            if (location == null)
            {
                return NotFound();
            }
            if (location.Airports.Any()) 
                return BadRequest("All airports in this location must be deleted first");
            await _unitOfWork.LocationRepository.DeleteAsync(location);

            try
            {
                await _unitOfWork.LocationRepository.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            return NoContent();
        }

        private bool LocationExists(int id)
        {
            var location = _unitOfWork.LocationRepository.GetById(id);
            if (location == null) return false;
            return true;
        }

        private async Task<string> GetImageUrl(IFormFile image,int locationId , HttpRequest request)
        {
            string folder = "locations";
            var serverUrl = $"{request.Scheme}://{request.Host.Value}";
            string fileName = await ImageHelper
                .UploadImageAsync(image, folder, $"location-{locationId}-image");

            var imageUrl = $"{serverUrl}/imgs/{folder}/{fileName}";
            return imageUrl;
        }
    }
}