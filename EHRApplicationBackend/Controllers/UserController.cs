using App.Core.App.User.Command;
using App.Core.App.User.Commond;
using App.Core.App.User.Query;
using App.Core.Models.User;
using App.Core.Models.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("[action]/{userId}")]
        [Authorize(Roles = "Provider, Patient")]
        public async Task<IActionResult> GetLoggedUser(int userId)
        {
            var result = await _mediator.Send(new GetLoggedUserByUserIdQuery { UserId = userId });
            return Ok(result);
        }

        // Api for Forget Password
        [HttpPost("[action]")]
        public async Task<IActionResult> ForgetPassword(ForgetPasswordDto forgetPasswordDto)
        {
            var result = await _mediator.Send(new ForgetPasswordCommond { ForgetPasswordDto = forgetPasswordDto });
            return Ok(result);
        }

        // Forgot Email Api (send random string to User)
        [HttpGet("[action]/{email}")]
        public async Task<IActionResult> ForgotPasswordWithRandomString(string email)
        {
            var result = await _mediator.Send(new SendRandomPasswordOnMailCommand { Email = email });
            return Ok(result);
        }

        // Get All providers by Specializaton Id if 0 then all
        [HttpGet("[action]/{specializationId}")]
        [Authorize(Roles = "Patient, Provider")]
        public async Task<IActionResult> GetProvidersBySpecializationId(int specializationId)
        {
            var result = await _mediator.Send(new GetProvidersBySpecializationQuery { SpecialisationId = specializationId });
            return Ok(result);
        }
    }
}
