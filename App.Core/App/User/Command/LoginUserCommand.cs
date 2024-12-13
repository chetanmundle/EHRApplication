using App.Common.Constants;
using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.User;
using Domain.Entities;
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
    public class LoginUserCommand : IRequest<AppResponse>
    {
        public LoginUserDto LoginUserDto { get; set; }
    }

    internal class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEncryptionService _encryptionService;
        private readonly IEmailSmtpService _emailSmtpService;

        public LoginUserCommandHandler(IAppDbContext appDbContext,
            IEncryptionService encryptionService,
            IEmailSmtpService emailSmtpService)
        {
            _appDbContext = appDbContext;
            _encryptionService = encryptionService;
            _emailSmtpService = emailSmtpService;
        }

        public async Task<AppResponse> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            var LoginDto = request.LoginUserDto;

            var user = await _appDbContext.Set<Domain.Entities.User>()
                           .FirstOrDefaultAsync(u => u.Email == LoginDto.Email ||
                                                   u.UserName ==  LoginDto.Email, cancellationToken);

            if( user is null)
                return AppResponse.Response(false, "Invalid Username or Email", HttpStatusCodes.NotFound);

            if(!_encryptionService.VerifyPassword(LoginDto.Password, user.Password))
                 return AppResponse.Response(false, "Invalid Password", HttpStatusCodes.NotFound);

            Random random = new Random();
            int otp = random.Next(100000, 999999);

            Otp otpTblPbj = new Otp()
            {
                Email = LoginDto.Email,
                OtpValidity = DateTime.Now.AddMinutes(5),
                OtpValue = otp,
            };

            await _appDbContext.Set<Domain.Entities.Otp>()
                .AddAsync(otpTblPbj);

            await _appDbContext.SaveChangesAsync();

            _emailSmtpService.SendEmailOtp(user.Email, user.FirstName, "Otp for Login", otp);

            return AppResponse.Response(true, $"Otp is Send to {user.Email}");

        }
    }

}
