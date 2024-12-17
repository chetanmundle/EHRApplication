using App.Common.Models;
using App.Core.Common;
using App.Core.Interfaces;
using App.Core.Models.Appointment;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Query
{
    public class GetAppointmentByProviderIdQuery : IRequest<AppResponse<IEnumerable<GetAppointmentByProviderIdDto>>>
    {
        public int ProviderId { get; set; }
        public string Status { get; set; }
    }

    internal class GetAppointmentByProviderIdQueryHandler : IRequestHandler<GetAppointmentByProviderIdQuery,
        AppResponse<IEnumerable<GetAppointmentByProviderIdDto>>>
    {
        private readonly IAppDbContext _appDbContext;

        public GetAppointmentByProviderIdQueryHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse<IEnumerable<GetAppointmentByProviderIdDto>>>
            Handle(GetAppointmentByProviderIdQuery request, CancellationToken cancellationToken)
        {
            var providerUserId = request.ProviderId;
            var status = request.Status;
            var today = DateTime.Today;
            var appointmentlist = await _appDbContext.Set<Domain.Entities.Appointment>()
                        .Where(a => a.ProviderId == providerUserId &&
                                    (status == "Scheduled" ?
                                    (a.AppointmentDate >= today && a.AppointmentStatus == "Scheduled") : 
                                    (a.AppointmentStatus == status)))
                        .OrderBy(a => a.AppointmentDate).ToListAsync(cancellationToken);

            var resultlist = new List<GetAppointmentByProviderIdDto>();

            foreach (var app in appointmentlist)
            {
                var patient = await _appDbContext.Set<Domain.Entities.User>()
                               .FirstOrDefaultAsync(u => u.UserId == app.PatientId);
                GetAppointmentByProviderIdDto obj = new GetAppointmentByProviderIdDto()
                {
                    PatientId = app.PatientId,
                    AppointmentDate = app.AppointmentDate,
                    AppointmentId = app.AppointmentId,
                    AppointmentStatus = app.AppointmentStatus,
                    AppointmentTime = app.AppointmentTime,
                    ChiefComplaint = app.ChiefComplaint,
                    Fee = app.Fee,
                    ProviderId = app.ProviderId,
                    BloodGroup = patient.BloodGroup,
                    PatientName = patient.FirstName + " " + patient.LastName,
                    Gender = patient.Gender,
                    ProfileImage = patient.ProfileImage,
                    Age = Calculate.CalculateAge(patient.DateOfBirth ?? DateTime.Now)
                };

                resultlist.Add(obj);

            }

            return AppResponse.Success<IEnumerable<GetAppointmentByProviderIdDto>>(resultlist);
        }



    }

}
