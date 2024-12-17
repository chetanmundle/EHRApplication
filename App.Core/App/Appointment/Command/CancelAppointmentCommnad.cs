using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Appointment.Command
{
    public class CancelAppointmentCommnad : IRequest<AppResponse>
    {
        public int AppointmentId { get; set; }
    }

    public class CancelAppointmentCommnadHandler : IRequestHandler<CancelAppointmentCommnad, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public CancelAppointmentCommnadHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
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

            return AppResponse.Response(true, "Appointment Cancelled Successfully");
        }
    }
}
