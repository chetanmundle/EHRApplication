using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.SOAPNotes;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.SOAPNotes.Command
{
    public class SaveSOAPNotesCommand : IRequest<AppResponse>
    {
        public SOAPNotesDto SaveSOAPNotesDto { get; set; }
    }

    internal class SaveSOAPNotesCommandHandler: IRequestHandler<SaveSOAPNotesCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public SaveSOAPNotesCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(SaveSOAPNotesCommand request, CancellationToken cancellationToken)
        {
            var soapNotesDto = request.SaveSOAPNotesDto;
            
            var appointment = await _appDbContext.Set<Domain.Entities.Appointment>()
                              .FirstOrDefaultAsync(a => a.AppointmentId == soapNotesDto.AppointmentId);

            if(appointment is null)
                return AppResponse.Response(false, "Not Appoinment Found for this id ", HttpStatusCodes.NotFound);



            var soapNotes = soapNotesDto.Adapt<Domain.Entities.SOAPNotes>();

            await _appDbContext.Set<Domain.Entities.SOAPNotes>()
                  .AddAsync(soapNotes);

            appointment.AppointmentStatus = "Completed";

            await _appDbContext.SaveChangesAsync();

            return AppResponse.Response(true, "Notes Save Successfully");
        }
    }
}
