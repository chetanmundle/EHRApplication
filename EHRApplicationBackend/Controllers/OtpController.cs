using App.Core.App.Otp.Command;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Ecom_Assessment_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OtpController : ControllerBase
    {
        private readonly IMediator _mediator;

        public OtpController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("[action]/{email}")]
        public async Task<IActionResult> SendOtp(string email)
        {
            var result = await _mediator.Send(new SendEmailCommond { Email =email});
            return Ok(result);
        }


    }
}
