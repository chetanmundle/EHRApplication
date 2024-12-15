using App.Core.App.Appointment.Command;
using App.Core.Models.Appointment;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace EHRApplicationBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AppointmentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "Patient, Provider")]
        public async Task<IActionResult> BookAppointment(BookAppointmentDto bookAppointmentDto)
        {
            var result = await _mediator.Send(new BookAppointmentCommand { BookAppointmentDto = bookAppointmentDto });
            return Ok(result);
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "Patient, Provider")]
        public async Task<IActionResult> PaymentBookAppointment(PaymentAndBookAppointmentDto bookAppointmentDto)
        {
            var result = await _mediator.Send(new PaymentAndBookAppointmentCommand { paymentAndBookAppointmentDto = bookAppointmentDto });
            return Ok(result);
        }

        [HttpGet("[action]/{patientId}")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetAppoinmentsByPatientId(int patientId)
        {
            var result = await _mediator.Send(new GetAppointmentByPatientIdQuery { PatientId = patientId });
            return Ok(result);
        }
    }
}
