using App.Common.Constants;
using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Appointment;
using App.Core.Models.Stripe;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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

        public PaymentAndBookAppointmentCommandHandler(IAppDbContext appDbContext, IStripePaymentService stripePaymentService)
        {
            _appDbContext = appDbContext;
            _stripePaymentService = stripePaymentService;
        }

        public async Task<AppResponse> Handle(PaymentAndBookAppointmentCommand request, CancellationToken cancellationToken)
        {
            var bookAppointmentDto = request.paymentAndBookAppointmentDto;

            var appointmentDate = bookAppointmentDto.AppointmentDate;
            var providerId = bookAppointmentDto.ProviderId;
            var startTime = bookAppointmentDto.StartTime;
            var endTime = bookAppointmentDto.EndTime;
            var patientId = bookAppointmentDto.PatientId;


            if (appointmentDate is null || startTime is null || endTime is null)
            {
                return AppResponse.Response(false, "Data is null ", HttpStatusCodes.BadRequest);
            }

            TimeSpan appointmentTime = (TimeSpan)(endTime - startTime);
            if (appointmentTime.TotalMinutes > 60)
                return AppResponse.Response(false, "Your time is more than 1 Hour", HttpStatusCodes.BadRequest);


            var patient = await _appDbContext.Set<Domain.Entities.User>()
                      .FirstOrDefaultAsync(u => u.UserId == patientId, cancellationToken);

            if (patient is null)
                return AppResponse.Response(false, "User is not Found", HttpStatusCodes.NotFound);

            var provider = await _appDbContext.Set<Domain.Entities.User>()
                          .FirstOrDefaultAsync(u => u.UserId == providerId, cancellationToken);

            if (provider is null)
                return AppResponse.Response(false, "User is not Found", HttpStatusCodes.NotFound);


            var overlappingAppointment = await _appDbContext.Set<Domain.Entities.Appointment>()
                                         .Where(a => a.ProviderId == providerId && a.AppointmentDate == appointmentDate)
                                          .AnyAsync(a => (startTime >= a.StartTime && startTime < a.EndTime) ||
                                                         (endTime >= a.StartTime && endTime <= a.EndTime) ||
                                                         (startTime <= a.StartTime && endTime >= a.EndTime), cancellationToken);


            if (overlappingAppointment)
            {
                return AppResponse.Response(false, "Provider's time is already booked for the selected time.", HttpStatusCodes.BadRequest);
            }

            var newAppointment = new Domain.Entities.Appointment()
            {
                AppointmentDate = appointmentDate,
                AppointmentStatus = "Scheduled",
                ProviderId = providerId,
                StartTime = startTime,
                EndTime = endTime,
                User = patient,
                PatientId = patient.UserId,
                ChiefComplaint = bookAppointmentDto.ChiefComplaint,
                Fee = provider.VisitingCharge,
                AppointmentTime = appointmentTime
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

            return AppResponse.Response(true, "Appointment Booked Successfully");
        }
    }
}
