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

namespace App.Core.App.User.Query
{
    public class GetLoggedUserByUserIdQuery : IRequest<AppResponse<LoggedUserDto>>
    {
        public int UserId { get; set; }
    }

    internal class GetUserByUserIdQueryHandler : IRequestHandler<GetLoggedUserByUserIdQuery, AppResponse<LoggedUserDto>>
    {
        private readonly IAppDbContext _appDbContext;

        public GetUserByUserIdQueryHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse<LoggedUserDto>> Handle(GetLoggedUserByUserIdQuery request, CancellationToken cancellationToken)
        {
            var userId = request.UserId;

            var user = await _appDbContext.Set<Domain.Entities.User>()
                       .Include(u => u.UserType)
                       .Include(u => u.Specialisation)
                       .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

            if (user is null) return AppResponse.Fail<LoggedUserDto>(null, "User with this id not found", HttpStatusCodes.NotFound);

            var loggedUser = new LoggedUserDto()
            {
                UserId = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                UserTypeName = user.UserType.UserTypeName,
                SpecialisationName = user.Specialisation is not null ? user.Specialisation.SpecialisationName : null,
                ProfileImage = user.ProfileImage,
                Qualification = user.Qualification,
                RegistrationNumber = user.RegistrationNumber,
                VisitingCharge = user.VisitingCharge,
            };

            return AppResponse.Success(loggedUser);

        }
    }
}
