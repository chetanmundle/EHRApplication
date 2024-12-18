using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Appointment;
using App.Core.Models.User;
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
    public class GetAppointmentByPatientIdQuery : IRequest<AppResponse<IEnumerable<GetAppointmentDto>>>
    {
        public int PatientId { get; set; }
        public string Status { get; set; }
    }

    internal class GetAppointmentByPatientIdHandler : IRequestHandler<GetAppointmentByPatientIdQuery, AppResponse<IEnumerable<GetAppointmentDto>>>
    {
        private readonly IAppDbContext _appDbContext;

        public GetAppointmentByPatientIdHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse<IEnumerable<GetAppointmentDto>>> Handle(GetAppointmentByPatientIdQuery request, CancellationToken cancellationToken)
        {
            var patientUserId = request.PatientId;
            var status = request.Status;

            var appointmentlist = await _appDbContext.Set<Domain.Entities.Appointment>()
                          .Where(a => a.PatientId == patientUserId &&
                                 ( status != "All" ? a.AppointmentStatus == status : true )
                           )
                          .OrderByDescending(x => x)
                          .ToListAsync(cancellationToken);
                          //.OrderByDescending(a => a.AppointmentDate).ToListAsync(cancellationToken);

            var resultlist = new List<GetAppointmentDto>();

            foreach (var app in appointmentlist)
            {
                var provider = await _appDbContext.Set<Domain.Entities.User>()
                               .FirstOrDefaultAsync(u => u.UserId == app.ProviderId);
                GetAppointmentDto list = new GetAppointmentDto()
                {
                    PatientId = app.PatientId,
                    AppointmentDate = app.AppointmentDate,
                    AppointmentId = app.AppointmentId,
                    AppointmentStatus = app.AppointmentStatus,
                    AppointmentTime = app.AppointmentTime,
                    ChiefComplaint = app.ChiefComplaint,
                    Fee = app.Fee,
                    ProviderId = app.ProviderId,
                    ProviderName = provider.FirstName +" "+ provider.LastName,
                    email = provider.Email,
                };

                resultlist.Add(list);

            }

            return AppResponse.Success<IEnumerable<GetAppointmentDto>>(resultlist);

            //var provider 
        }
    }
}
