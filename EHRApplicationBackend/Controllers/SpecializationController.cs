using App.Core.App.Specialization.Query;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace EHRApplicationBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecializationController : ControllerBase
    {
        private readonly IMediator _mediator;
        public SpecializationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllSpecialization()
        {
            var result = await _mediator.Send(new GetAllSpecializationQuery());
            return Ok(result);
        }
    }
}
