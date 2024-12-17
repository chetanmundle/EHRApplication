using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.User;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.User.Command
{
    public class UpdateUserCommand : IRequest<AppResponse>
    {
        public UpdateUserDto UpdateUser { get; set; }
    }

    internal class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public UpdateUserCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var updateUserDto = request.UpdateUser;

            var user = await _appDbContext.Set<Domain.Entities.User>()
                      .FirstOrDefaultAsync(u => u.UserId == updateUserDto.UserId, cancellationToken);

            if (user is null) return AppResponse.Response(false, "Invalid UserId",HttpStatusCodes.NotFound);

            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.Email = updateUserDto.Email;
            user.Address = updateUserDto.Address;
            user.PhoneNumber = updateUserDto.PhoneNumber;
            user.RegistrationNumber = updateUserDto.RegistrationNumber;
            user.BloodGroup = updateUserDto.BloodGroup;
            user.VisitingCharge = updateUserDto.VisitingCharge;
            user.DateOfBirth = updateUserDto.DateOfBirth;
            user.Gender = updateUserDto.Gender;
            user.Qualification = updateUserDto.Qualification;
            user.ProfileImage = updateUserDto.ProfileImage;

            var specialization = await _appDbContext.Set<Domain.Entities.Specialisation>()
                     .FirstOrDefaultAsync(s => s.SpecialisationId == updateUserDto.SpecialisationId,
                     cancellationToken);

            user.Specialisation = specialization;

            await _appDbContext.SaveChangesAsync(cancellationToken);

            return AppResponse.Response(true, "User Updated Successfully");
        }
    }
}
