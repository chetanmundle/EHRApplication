using App.Common.Constants;
using App.Common.Models;
using App.Core.Common;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Appointment;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Command
{
    public class BookAppointmentCommand : IRequest<AppResponse>
    {
        public BookAppointmentDto BookAppointmentDto { get; set; }
    }

    internal class BookAppointmentCommandHandler : IRequestHandler<BookAppointmentCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEmailSmtpService _emailSmtpService;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public BookAppointmentCommandHandler(IAppDbContext appDbContext,
            IEmailSmtpService emailSmtpService, IServiceScopeFactory serviceScopeFactory)
        {
            _appDbContext = appDbContext;
            _emailSmtpService = emailSmtpService;
            _serviceScopeFactory = serviceScopeFactory;
        }

        public async Task<AppResponse> Handle(BookAppointmentCommand request, CancellationToken cancellationToken)
        {
            var bookAppointmentDto = request.BookAppointmentDto;

            var appointmentDate = bookAppointmentDto.AppointmentDate;
            var providerId = bookAppointmentDto.ProviderId;

            var patientId = bookAppointmentDto.PatientId;


            if (appointmentDate is null || providerId is null)
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
            //                             .Where(a => a.ProviderId == providerId && a.AppointmentDate == appointmentDate
            //                                         && a.AppointmentStatus == "Scheduled")
            //                              .AnyAsync(a => (startTime >= a.StartTime && startTime < a.EndTime) ||
            //                                             (endTime >= a.StartTime && endTime <= a.EndTime) ||
            //                                             (startTime <= a.StartTime && endTime >= a.EndTime), cancellationToken);


            //if (overlappingAppointment)
            //{
            //    return AppResponse.Response(false, "Provider's time is already booked for the selected time.", HttpStatusCodes.BadRequest);
            //}

            var newAppointment = new Domain.Entities.Appointment()
            {
                AppointmentDate = appointmentDate,
                AppointmentStatus = "Scheduled",
                ProviderId = providerId,
                User = patient,
                PatientId = patient.UserId,
                ChiefComplaint = bookAppointmentDto.ChiefComplaint,
                Fee = provider.VisitingCharge,
                AppointmentTime = bookAppointmentDto.AppointmentTime,
            };

            await _appDbContext.Set<Domain.Entities.Appointment>()
                  .AddAsync(newAppointment);

            await _appDbContext.SaveChangesAsync();

            var body = Confirmation.AppointmentConfirmationBody(patient.FirstName + " " + patient.LastName,
                provider.FirstName + " " + provider.LastName, appointmentDate.ToString(),
                newAppointment.AppointmentTime.ToString());

            // Send email in the background asynchronously
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
