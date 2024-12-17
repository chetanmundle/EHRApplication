using App.Common.Constants;
using App.Common.Models;
using App.Core.Common;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Appointment;
using App.Core.Models.Stripe;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Command
{
    public class PaymentAndBookAppointmentCommand : IRequest<AppResponse>
    {
        public PaymentAndBookAppointmentDto paymentAndBookAppointmentDto { get; set; }
    }

    internal class PaymentAndBookAppointmentCommandHandler : IRequestHandler<PaymentAndBookAppointmentCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IStripePaymentService _stripePaymentService;
        private readonly IEmailSmtpService _emailSmtpService;

        public PaymentAndBookAppointmentCommandHandler(IAppDbContext appDbContext, IStripePaymentService stripePaymentService,
            IEmailSmtpService emailSmtpService)
        {
            _appDbContext = appDbContext;
            _stripePaymentService = stripePaymentService;
            _emailSmtpService = emailSmtpService;
        }

        public async Task<AppResponse> Handle(PaymentAndBookAppointmentCommand request, CancellationToken cancellationToken)
        {
            var bookAppointmentDto = request.paymentAndBookAppointmentDto;

            var appointmentDate = bookAppointmentDto.AppointmentDate;
            var providerId = bookAppointmentDto.ProviderId;
            var patientId = bookAppointmentDto.PatientId;


            if (appointmentDate is null)
            {
                return AppResponse.Response(false, "Data is null ", HttpStatusCodes.BadRequest);
            }


            var patient = await _appDbContext.Set<Domain.Entities.User>()
                      .FirstOrDefaultAsync(u => u.UserId == patientId, cancellationToken);

            if (patient is null)
                return AppResponse.Response(false, "User is not Found", HttpStatusCodes.NotFound);

            var provider = await _appDbContext.Set<Domain.Entities.User>()
                          .FirstOrDefaultAsync(u => u.UserId == providerId, cancellationToken);

            if (provider is null)
                return AppResponse.Response(false, "User is not Found", HttpStatusCodes.NotFound);


            //var overlappingAppointment = await _appDbContext.Set<Domain.Entities.Appointment>()
            //                             .Where(a => a.ProviderId == providerId &&
            //                                         a.AppointmentDate == appointmentDate &&
            //                                         a.AppointmentStatus == "Scheduled")
            //                              .AnyAsync(a => (startTime >= a.StartTime && startTime < a.EndTime) ||
            //                                             (endTime >= a.StartTime && endTime <= a.EndTime) ||
            //                                             (startTime <= a.StartTime && endTime >= a.EndTime) , cancellationToken);


            //if (overlappingAppointment)
            //{
            //    return AppResponse.Response(false, "Provider's time is already booked for the selected time.", HttpStatusCodes.BadRequest);
            //}

            var newAppointment = new Domain.Entities.Appointment()
            {
                AppointmentDate = appointmentDate,
                AppointmentStatus = "Scheduled",
                User = patient,
                PatientId = patient.UserId,
                ChiefComplaint = bookAppointmentDto.ChiefComplaint,
                Fee = provider.VisitingCharge,
                AppointmentTime = bookAppointmentDto.AppointmentTime,
                ProviderId = providerId,
            };

            await _appDbContext.Set<Domain.Entities.Appointment>()
                  .AddAsync(newAppointment);

            var paymentAndOrderDto = new Striprequestmodel()
            {
                Amount = bookAppointmentDto.Amount,
                CustomerEmail = bookAppointmentDto.CustomerEmail,
                CustomerName = bookAppointmentDto.CustomerName,
                SourceToken = bookAppointmentDto.SourceToken,
                UserId = bookAppointmentDto.PatientId
            };

            // Do payment here
            var paymentInfo = await _stripePaymentService.CreateStripePayment(paymentAndOrderDto);
            if (!paymentInfo.IsSuccess)
            {
                return AppResponse.Response(false, "Your Payment Fail", HttpStatusCodes.NotFound);
            }

            await _appDbContext.SaveChangesAsync();

            var body = Confirmation.AppointmentConfirmationBody(patient.FirstName + " " + patient.LastName,
           provider.FirstName + " " + provider.LastName, appointmentDate.ToString(),
           newAppointment.AppointmentTime.ToString());

            _emailSmtpService.SendEmail(patient.Email, patient.FirstName,
                "Appointment Booking Confirmation", body);

            _emailSmtpService.SendEmail(provider.Email, provider.FirstName,
               "Appointment Booking Confirmation", body);

            return AppResponse.Response(true, "Appointment Booked Successfully");
        }
    }
}
