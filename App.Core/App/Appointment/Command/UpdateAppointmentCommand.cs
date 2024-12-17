using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Appointment;
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
    public class UpdateAppointmentCommand : IRequest<AppResponse>
    {
        public UpdateAppointmentDto updateAppointmentDto {  get; set; }
    }

    internal class UpdateAppointmentCommandH : IRequestHandler<UpdateAppointmentCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public UpdateAppointmentCommandH(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(UpdateAppointmentCommand request, CancellationToken cancellationToken)
        {
            var updateDto = request.updateAppointmentDto;

            var appointmentDate = updateDto.AppointmentDate;


          
            var appointment = await _appDbContext.Set<Domain.Entities.Appointment>()
                .FirstOrDefaultAsync(a => a.AppointmentId == updateDto.AppointmentId, cancellationToken);

            if (appointment is null)
                return AppResponse.Response(false, "Invalid Appoinment Id", HttpStatusCodes.NotFound);

            //var overlappingAppointment = await _appDbContext.Set<Domain.Entities.Appointment>()
            //                             .Where(a => a.ProviderId ==appointment.ProviderId && a.AppointmentDate == appointmentDate
            //                                         && a.AppointmentStatus == "Scheduled" && a.AppointmentId != updateDto.AppointmentId)
            //                              .AnyAsync(a => (startTime >= a.StartTime && startTime < a.EndTime) ||
            //                                             (endTime >= a.StartTime && endTime <= a.EndTime) ||
            //                                             (startTime <= a.StartTime && endTime >= a.EndTime), cancellationToken);


            //if (overlappingAppointment)
            //{
            //    return AppResponse.Response(false, "Provider's time is already booked for the selected time.", HttpStatusCodes.BadRequest);
            //}

            
            appointment.ChiefComplaint = updateDto.ChiefComplaint;
            appointment.AppointmentDate = appointmentDate;
            appointment.AppointmentTime = updateDto.AppointmentTime;

            await _appDbContext.SaveChangesAsync(cancellationToken);
            return AppResponse.Response(true, "Appointment Update Successfully");
        }
    }
}
