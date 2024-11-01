/*
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data_Layer.Entities.Flights;
using API.DTOs;
using Data_Layer.UnitOfWork;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeaturesController : ControllerBase
    {
        private IUnitOfWork _unitOfWork { get; }

        public FeaturesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/Features
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeatureDTO>>> GetAllFeatures()
        {
            var features = await _unitOfWork.FeatureRepository.GetAllAsync();

            if (features is null)
            {
                return NotFound();
            }

            List<FeatureDTO> featureDTOs = new List<FeatureDTO>();
            foreach (var feature in features)
            {
                featureDTOs.Add(FeatureDTO.MapToFeatureDTO(feature));
            }
            return Ok(featureDTOs);
        }

        // GET: api/Features/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FeatureDTO>> GetFeature(int? id)
        {
            var feature = await _unitOfWork.FeatureRepository.GetByIdAsync(id.Value);

            if (feature == null)
            {
                return NotFound();
            }

            return Ok(FeatureDTO.MapToFeatureDTO(feature));
        }

        // PUT: api/Features/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> EditFeature(int id, FeatureDTO featureDTO)
        {
            if (id != featureDTO.Id)
            {
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                var feature = FeatureDTO.MapToFeature(featureDTO);
                feature.Id = id;

                await _unitOfWork.FeatureRepository.UpdateAsync(feature);
            }
            else return BadRequest();

            try
            {
                await _unitOfWork.FeatureRepository.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FeatureExists(id))
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


        // POST: api/Features
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FeatureDTO>> Addfeature(FeatureDTO featureDTO)
        {
            Feature? feature = null;
            if (featureDTO != null)
            {
                feature = FeatureDTO.MapToFeature(featureDTO);
            }
            if (ModelState.IsValid)
            {
                await _unitOfWork.FeatureRepository.AddAsync(feature);
            }
            else return BadRequest();

            try
            {
                await _unitOfWork.FeatureRepository.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return CreatedAtAction("GetFeature", new { id = feature.Id }, feature);
        }

        // DELETE: api/Features/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeature(int id)
        {
            var feature = await _unitOfWork.FeatureRepository.GetByIdAsync(id);

            if (feature == null)
            {
                return NotFound();
            }

            await _unitOfWork.FeatureRepository.DeleteAsync(feature);

            try
            {
                await _unitOfWork.FeatureRepository.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            return NoContent();
        }

        private bool FeatureExists(int id)
        {
            var feature = _unitOfWork.FeatureRepository.GetById(id);
            if (feature == null) return false;
            return true;
        }
    }
}
*/