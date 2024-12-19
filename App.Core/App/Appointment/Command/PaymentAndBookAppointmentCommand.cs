using App.Common.Constants;
using App.Common.Models;
using App.Core.Common;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Appointment;
using App.Core.Models.Stripe;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
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
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public PaymentAndBookAppointmentCommandHandler(IAppDbContext appDbContext,
            IStripePaymentService stripePaymentService, 
            IEmailSmtpService emailSmtpService,
            IServiceScopeFactory serviceScopeFactory)
        {
            _appDbContext = appDbContext;
            _stripePaymentService = stripePaymentService;
            _emailSmtpService = emailSmtpService;
            _serviceScopeFactory = serviceScopeFactory;
        }

        public async Task<AppResponse> Handle(PaymentAndBookAppointmentCommand request, CancellationToken cancellationToken)
        {
            var bookAppointmentDto = request.paymentAndBookAppointmentDto;

            var appointmentDate = bookAppointmentDto.AppointmentDate;
            var providerId = bookAppointmentDto.ProviderId;
            var patientId = bookAppointmentDto.PatientId;
            var appointmentTime = bookAppointmentDto.AppointmentTime;


            if (appointmentDate is null && appointmentTime is null)
            {
                return AppResponse.Response(false, "Data or Time is null ", HttpStatusCodes.BadRequest);
            }

            // Check if the appointment is for today's date
            if (appointmentDate.Value.Date == DateTime.Today)
            {
              
                // Ensure the appointment time is at least one hour after the current time
                var currentTime = DateTime.Now;
                var appointmentDateTime =   DateTime.Today.Add(appointmentTime.Value); // Combine today's date with the appointment time

                if (appointmentDateTime <= currentTime.AddHours(1))
                {
                    return AppResponse.Response(false, "Appointment time must be at least one hour from now.", HttpStatusCodes.BadRequest);
                }
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

            _ = SendEmailInBackground(patient, provider, body, cancellationToken);

            //_emailSmtpService.SendEmail(patient.Email, patient.FirstName,
            //    "Appointment Booking Confirmation", body);

            //_emailSmtpService.SendEmail(provider.Email, provider.FirstName,
            //   "Appointment Booking Confirmation", body);

            return AppResponse.Response(true, "Appointment Booked Successfully");
        }

        private async Task SendEmailInBackground(Domain.Entities.User patient, Domain.Entities.User provider, string body, CancellationToken cancellationToken)
        {
            // Create a new scope for DbContext in background task
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var scopedDbContext = scope.ServiceProvider.GetRequiredService<IAppDbContext>();

                try
                {
                    // Send email to the patient
                    if (patient != null)
                    {
                        await Task.Run(() =>
                        {
                            try
                            {
                                _emailSmtpService.SendEmail(patient.Email, patient.FirstName, "Appointment Booking Confirmation", body);
                            }
                            catch (Exception ex)
                            {
                                // Log exception
                                Console.WriteLine($"Failed to send email to patient: {ex.Message}");
                            }
                        }, cancellationToken);
                    }

                    // Send email to the provider
                    if (provider != null)
                    {
                        await Task.Run(() =>
                        {
                            try
                            {
                                _emailSmtpService.SendEmail(provider.Email, provider.FirstName, "Appointment Booking Confirmation", body);
                            }
                            catch (Exception ex)
                            {
                                // Log exception
                                Console.WriteLine($"Failed to send email to provider: {ex.Message}");
                            }
                        }, cancellationToken);
                    }
                }
                catch (Exception ex)
                {
                    // Log exception
                    Console.WriteLine($"Error in background task: {ex.Message}");
                }
            }
        }
    }
}
