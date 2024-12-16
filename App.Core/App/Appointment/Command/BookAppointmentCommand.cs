using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Appointment;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
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

        public BookAppointmentCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(BookAppointmentCommand request, CancellationToken cancellationToken)
        {
            var bookAppointmentDto = request.BookAppointmentDto;

            var appointmentDate = bookAppointmentDto.AppointmentDate;
            var providerId = bookAppointmentDto.ProviderId;
            var startTime = bookAppointmentDto.StartTime;
            var endTime = bookAppointmentDto.EndTime;
            var patientId = bookAppointmentDto.PatientId;


            if (appointmentDate is null || providerId is null || startTime is null || endTime is null)
            {
                return AppResponse.Response(false, "Data is null ", HttpStatusCodes.BadRequest);
            }

            TimeSpan appointmentTime = (TimeSpan)(endTime - startTime);
            if (appointmentTime.TotalMinutes > 60 || appointmentTime.TotalMinutes<0)
                return AppResponse.Response(false, "Your time is more than 1 Hour",HttpStatusCodes.BadRequest);


                var patient = await _appDbContext.Set<Domain.Entities.User>()
                          .FirstOrDefaultAsync(u => u.UserId == patientId, cancellationToken);

            if(patient is null)
                return AppResponse.Response(false, "User is not Found", HttpStatusCodes.NotFound);

            var provider = await _appDbContext.Set<Domain.Entities.User>()
                          .FirstOrDefaultAsync(u => u.UserId == providerId, cancellationToken);

            if (provider is null)
                return AppResponse.Response(false, "User is not Found", HttpStatusCodes.NotFound);


            var overlappingAppointment = await _appDbContext.Set<Domain.Entities.Appointment>()
                                         .Where(a => a.ProviderId == providerId && a.AppointmentDate == appointmentDate
                                                     && a.AppointmentStatus == "Scheduled")
                                          .AnyAsync(a => (startTime >= a.StartTime && startTime < a.EndTime) ||
                                                         (endTime >= a.StartTime && endTime <= a.EndTime) ||
                                                         (startTime <= a.StartTime && endTime >= a.EndTime) , cancellationToken);


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

            await _appDbContext.SaveChangesAsync();

            return AppResponse.Response(true, "Appointment Booked Successfully");
        }
    }
}
