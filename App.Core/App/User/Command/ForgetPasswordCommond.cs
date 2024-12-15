using App.Common.Constants;
using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Users;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.User.Commond
{
    public class ForgetPasswordCommond : IRequest<AppResponse>
    {
        public ForgetPasswordDto ForgetPasswordDto { get; set; }
    }

    internal class ForgetPasswordCommondHandler : IRequestHandler<ForgetPasswordCommond, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEncryptionService _encryptionService;

        public ForgetPasswordCommondHandler(IAppDbContext appDbContext, IEncryptionService encryptionService)
        {
            _appDbContext = appDbContext;
            _encryptionService = encryptionService;
        }

        public async Task<AppResponse> Handle(ForgetPasswordCommond request, CancellationToken cancellationToken)
        {
            var forgotPasswordDto = request.ForgetPasswordDto;

            if (forgotPasswordDto == null) return AppResponse.Response(false, "Null value Send", HttpStatusCodes.BadRequest);

            if (!string.Equals(forgotPasswordDto.Password, forgotPasswordDto.ConfirmPassword))
                return AppResponse.Response(false, "Password and Comfirm Password Must be Same", HttpStatusCodes.BadRequest);

            var otpData = await _appDbContext.Set<Domain.Entities.Otp>()
                                .FirstOrDefaultAsync(o => o.Email == forgotPasswordDto.Email &&
                                                          o.OtpValue == forgotPasswordDto.Otp, cancellationToken);

            if (otpData is null)
            {
                return AppResponse.Response(false, "Invalid Otp...!", HttpStatusCodes.BadRequest);
            }
            if (otpData.OtpValidity < DateTime.Now)
            {
                return AppResponse.Response(false, "Otp Expired..!", HttpStatusCodes.BadRequest);
            }

            var user = await _appDbContext.Set<Domain.Entities.User>()
                             .FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email, cancellationToken);

            if (user is null) return AppResponse.Response(false, "Invalid Email Address", HttpStatusCodes.BadRequest);

            user.Password = _encryptionService.EncryptData(forgotPasswordDto.Password);

            await _appDbContext.SaveChangesAsync(cancellationToken);

            return AppResponse.Response(true, "Password Changed Successfully", HttpStatusCodes.OK);
        }
    }
}
