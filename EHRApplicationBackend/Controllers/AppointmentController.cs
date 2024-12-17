using App.Core.App.Appointment.Command;
using App.Core.App.Appointment.Query;
using App.Core.Models.Appointment;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("[action]/{patientId}/{status}")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetAppoinmentsByPatientId(int patientId,string status)
        {
            var result = await _mediator.Send(new GetAppointmentByPatientIdQuery { PatientId = patientId, Status = status });
            return Ok(result);
        }


        [HttpGet("[action]/{providerId}/{status}")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> GetAppoinmentsByProvidertId(int providerId, string status)
        {
            var result = await _mediator.Send(new GetAppointmentByProviderIdQuery {  ProviderId= providerId, Status = status });
            return Ok(result);
        }

        [HttpDelete("[action]/{appointmentId}")]
        [Authorize(Roles = "Provider, Patient")]
        public async Task<IActionResult> CancelAppointmentById(int appointmentId)
        {
            var result = await _mediator.Send(new CancelAppointmentCommnad { AppointmentId = appointmentId });
            return Ok(result);
        }


        [HttpGet("[action]/{appointmentId}")]
        [Authorize(Roles = "Provider, Patient")]
        public async Task<IActionResult> GetAppointmentWithSOAPNotes(int appointmentId)
        {
            var result = await _mediator.Send(new GetAppointmentWithSOAPNotesQuery { AppointmentId= appointmentId });   
            return Ok(result);
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> UpdateAppoinmentDto(UpdateAppointmentDto appoinmentDto)
        {
            var result = await _mediator.Send(new UpdateAppointmentCommand { updateAppointmentDto = appoinmentDto });
            return Ok(result);
        }

    }
}
