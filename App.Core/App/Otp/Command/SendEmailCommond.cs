
using App.Common.Constants;
using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Otp.Command
{
    public class SendEmailCommond : IRequest<AppResponse>
    {
        public string Email { get; set; }
    }

    internal class SendEmailCommondHandler : IRequestHandler<SendEmailCommond, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEmailSmtpService _emailSmtpService;

        public SendEmailCommondHandler(IAppDbContext appDbContext, IEmailSmtpService emailSmtpService)
        {
            _appDbContext = appDbContext;
            _emailSmtpService = emailSmtpService;
        }

        public async Task<AppResponse> Handle(SendEmailCommond request, CancellationToken cancellationToken)
        {
            var email = request.Email;

            var user = await _appDbContext.Set<Domain.Entities.User>()
                             .FirstOrDefaultAsync( u =>  u.Email == email, cancellationToken);

            if (user is null) return AppResponse.Response(false,"User Not Exist...!",HttpStatusCodes.NotFound);

            Random random = new Random();
            int otpValue = random.Next(10000000, 100000000);

            _emailSmtpService.SendEmailOtp(email, "User", "Otp for Forgot Password", otpValue);

            var otpObj = new Domain.Entities.Otp()
            {
                Email = email,
                OtpValidity = DateTime.Now.AddMinutes(5),
                OtpValue = otpValue,
            };

            await _appDbContext.Set<Domain.Entities.Otp>()
                         .AddAsync(otpObj, cancellationToken);

            await _appDbContext.SaveChangesAsync(cancellationToken);

            return AppResponse.Response(true,"Otp Send Successfully..",HttpStatusCodes.OK);
        }
    }
}
