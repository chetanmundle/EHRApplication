using App.Common.Constants;
using App.Common.Models;
using App.Core.Common;
using App.Core.Interface;
using App.Core.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.DependencyInjection;

namespace App.Core.App.Appointment.Command
{
    public class CancelAppointmentCommnad : IRequest<AppResponse>
    {
        public int AppointmentId { get; set; }
    }
    public class CancelAppointmentCommnadHandler : IRequestHandler<CancelAppointmentCommnad, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEmailSmtpService _emailSmtpService;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public CancelAppointmentCommnadHandler(IAppDbContext appDbContext, IEmailSmtpService emailSmtpService, IServiceScopeFactory serviceScopeFactory)
        {
            _appDbContext = appDbContext;
            _emailSmtpService = emailSmtpService;
            _serviceScopeFactory = serviceScopeFactory;
        }

        public async Task<AppResponse> Handle(CancelAppointmentCommnad request, CancellationToken cancellationToken)
        {
            var appointmentId = request.AppointmentId;
            var appointment = await _appDbContext.Set<Domain.Entities.Appointment>()
                                  .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId, cancellationToken);

            if (appointment is null)
                return AppResponse.Response(false, "Invalid Appointment Id..!", HttpStatusCodes.NotFound);

            appointment.AppointmentStatus = "Cancelled";
            await _appDbContext.SaveChangesAsync(cancellationToken);

            var body = Confirmation.AppointmentCancellationBody(appointment.AppointmentDate.ToString(),
                appointment.AppointmentTime.ToString());

            // Send email in the background asynchronously
            _ = SendEmailInBackground(appointment, body, cancellationToken);

            return AppResponse.Response(true, "Appointment Cancelled Successfully");
        }

        private async Task SendEmailInBackground(Domain.Entities.Appointment appointment, string body, CancellationToken cancellationToken)
        {
            // Use a new scope to get a fresh DbContext instance
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var scopedDbContext = scope.ServiceProvider.GetRequiredService<IAppDbContext>();

                try
                {
                    // Send email to the patient in the background
                    var patient = await scopedDbContext.Set<Domain.Entities.User>()
                                     .FirstOrDefaultAsync(u => u.UserId == appointment.PatientId, cancellationToken);

                    if (patient is not null)
                    {
                        await Task.Run(() =>
                        {
                            try
                            {
                                _emailSmtpService.SendEmail(patient.Email, patient.FirstName, "Appointment Cancellation", body);
                            }
                            catch (Exception ex)
                            {
                                // Log exception
                                Console.WriteLine($"Failed to send email to patient: {ex.Message}");
                            }
                        }, cancellationToken);
                    }

                    var provider = await scopedDbContext.Set<Domain.Entities.User>()
                                  .FirstOrDefaultAsync(u => u.UserId == appointment.ProviderId, cancellationToken);

                    if (provider is not null)
                    {
                        await Task.Run(() =>
                        {
                            try
                            {
                                _emailSmtpService.SendEmail(provider.Email, provider.FirstName, "Appointment Cancellation", body);
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
