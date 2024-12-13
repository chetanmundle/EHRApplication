using App.Core.App.User.Command;
using App.Core.Models.User;
using App.Core.Models.Users;
using MediatR;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace EHRApplicationBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }


        // Rester Patient
        [HttpPost("[action]")]
        public async Task<IActionResult> RegisterPatient(CreatePatientDto createPatientDto)
        {
            var result = await _mediator.Send(new RegisterPatientCommand { CreatePatient = createPatientDto });
            return Ok(result);
        }

        // Register Provider
        [HttpPost("[action]")]
        public async Task<IActionResult> RegisterProvider(CreateProviderDto createProvider)
        {
            var result = await _mediator.Send(new RegisterProviderCommand { CreateProviderDto = createProvider });
            return Ok(result);
        }

        // Varify Credintials and send Otp
        [HttpPost("[action]")]
        public async Task<IActionResult> LoginUser(LoginUserDto loginUserDto)
        {
            var result = await _mediator.Send(new LoginUserCommand { LoginUserDto = loginUserDto });
            return Ok(result);
        }

        // Get Crdintial with otp and Validate send jwt token
        [HttpPost("[action]")]
        public async Task<IActionResult> LoginUserValidateOtp(LoginUserValidateOtpDto loginUserValidateOtpDto)
        {
            var result = await _mediator.Send(new LoginUserValidateOtpCommand { LoginUserValidateOtpDto = loginUserValidateOtpDto });   
            return Ok(result);
        }
    }
}
