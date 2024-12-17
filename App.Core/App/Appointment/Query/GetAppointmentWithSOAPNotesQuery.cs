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

namespace App.Core.App.Appointment.Query
{
    public class GetAppointmentWithSOAPNotesQuery : IRequest<AppResponse<AppointmentAndSOAPNotesDto>>
    {
        public int AppointmentId { get; set; }
    }

    internal class GetAppointmentWithSOAPNotesHandler :IRequestHandler<GetAppointmentWithSOAPNotesQuery, AppResponse<AppointmentAndSOAPNotesDto>>
    {
        private readonly IAppDbContext _appDbContext;

        public GetAppointmentWithSOAPNotesHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse<AppointmentAndSOAPNotesDto>> Handle(GetAppointmentWithSOAPNotesQuery request, CancellationToken cancellationToken)
        {
            var appointmentId = request.AppointmentId;

            var appointment = await _appDbContext.Set<Domain.Entities.Appointment>()
                              .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId, cancellationToken);

            if (appointment is null)
                return AppResponse.Fail<AppointmentAndSOAPNotesDto>(null, "Invalid Appointment Id ", HttpStatusCodes.NotFound);

            var patientUser = await _appDbContext.Set<Domain.Entities.User>()
                       .FirstOrDefaultAsync(u => u.UserId == appointment.PatientId, cancellationToken);
            if(patientUser is null)
                return AppResponse.Fail<AppointmentAndSOAPNotesDto>(null, "Invalid Appointment Id ", HttpStatusCodes.NotFound);

            var resultDto = new AppointmentAndSOAPNotesDto()
            {
                AppointmentId = appointment.AppointmentId,
                AppointmentDate = appointment.AppointmentDate,
                AppointmentStatus = appointment.AppointmentStatus,
                AppointmentTime = appointment.AppointmentTime,
                Fee = appointment.Fee,
                PatientId = appointment.PatientId,
                ProviderId = appointment.ProviderId,
                ChiefComplaint = appointment.ChiefComplaint,
                PatientName = patientUser.FirstName + " " + patientUser.LastName,
                BloodGroup = patientUser.BloodGroup,
                Gender = patientUser.Gender,
                ProfileImage = patientUser.ProfileImage,
                DateOfBirth = patientUser.DateOfBirth,
                Assessment = null,
                Objective = null,
                Plan = null,
                Subjective = null,
                SOAPNotesId = null,
            };

            if(string.Equals(resultDto.AppointmentStatus, "Completed"))
            {
                var soapNote = await _appDbContext.Set<Domain.Entities.SOAPNotes>()
                                .FirstOrDefaultAsync(s => s.AppointmentId == appointmentId, cancellationToken);

                if (soapNote is not null)
                {
                    resultDto.Assessment = soapNote.Assessment;
                    resultDto.Objective = soapNote.Objective;
                    resultDto.Plan = soapNote.Plan;
                    resultDto.Subjective = soapNote.Subjective;
                    resultDto.SOAPNotesId = soapNote.SOAPNotesId;
                }
            }
           

            return AppResponse.Success(resultDto);
        }
    }
}
