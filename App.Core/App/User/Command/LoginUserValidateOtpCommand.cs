using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Users;
using Mapster;
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
    public class LoginUserValidateOtpCommand : IRequest<AppResponse<LoginResponseDto>>
    {
        public LoginUserValidateOtpDto LoginUserValidateOtpDto { get; set; }
    }

    internal class LoginUserValidateOtpCommandHandler : IRequestHandler<LoginUserValidateOtpCommand, AppResponse<LoginResponseDto>>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IJwtService _jwtService;

        public LoginUserValidateOtpCommandHandler(IAppDbContext appDbContext, IJwtService jwtService)
        {
            _appDbContext = appDbContext;
            _jwtService = jwtService;
        }

        public async Task<AppResponse<LoginResponseDto>> Handle(LoginUserValidateOtpCommand request, CancellationToken cancellationToken)
        {
            var model = request.LoginUserValidateOtpDto;

            var otpData = await _appDbContext.Set<Domain.Entities.Otp>()
                              .FirstOrDefaultAsync(o => o.Email == model.Email &&
                                                        o.OtpValue == model.OtpValue, cancellationToken);

            if (otpData is null)
            {
                return AppResponse.Fail<LoginResponseDto>(null, "Otp is Not Valid", HttpStatusCodes.BadRequest);
            }
            if (otpData.OtpValidity < DateTime.Now)
            {
                return AppResponse.Fail<LoginResponseDto>(null, "Otp is Not Valid", HttpStatusCodes.BadRequest);
            }

            var user = await _appDbContext.Set<Domain.Entities.User>()
                            .FirstOrDefaultAsync(u => u.Email == model.Email || u.UserName == model.Email, cancellationToken);

            if (user is null)
            {
                return AppResponse.Fail<LoginResponseDto>(null, "User Not Valide User", HttpStatusCodes.BadRequest);
            }

            var role = await _appDbContext.Set<Domain.Entities.UserType>()
                            .FirstOrDefaultAsync(r => r.UserTypeId == user.UserTypeId, cancellationToken);

            if (role is null)
            {
                return AppResponse.Fail<LoginResponseDto>(null, "Internal Server Error", HttpStatusCodes.InternalServerError);
            }

            string accessToken = await _jwtService.Authenticate(user.UserId, user.UserName, user.Email, role.UserTypeName);

            LoginResponseDto loginResponseDto = user.Adapt<LoginResponseDto>();
            loginResponseDto.AccessToken = accessToken;
            loginResponseDto.UserTypeName = role.UserTypeName;

            return AppResponse.Success(loginResponseDto, "User Validate Successfully");
        }
    }
}
