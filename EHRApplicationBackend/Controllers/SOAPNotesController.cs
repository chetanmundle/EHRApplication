using App.Core.App.SOAPNotes.Command;
using App.Core.Models.SOAPNotes;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace EHRApplicationBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SOAPNotesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SOAPNotesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> SaveSOAPNotes(SOAPNotesDto soapNotesDto)
        {
            var result = await _mediator.Send(new SaveSOAPNotesCommand { SaveSOAPNotesDto = soapNotesDto });    
            return Ok(result);
        }
    }
}
