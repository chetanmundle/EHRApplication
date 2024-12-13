using App.Core.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Ecom_Assessment_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryStateController : ControllerBase
    {
        private readonly ICountryStateRepository _countryStateRepository;

        public CountryStateController(ICountryStateRepository countryStateRepository)
        {
            _countryStateRepository = countryStateRepository;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllCountries()
        {
            var result = await _countryStateRepository.GetAllCountriesAsync();
            return Ok(result);
        }

        [HttpGet("[action]/{countryId}")]
        public async Task<IActionResult> GetAllStatesByCountryId(int countryId)
        {
            var result = await _countryStateRepository.GetStateByCountryuIdAsync(countryId);
            return Ok(result);
        }
    }
}
