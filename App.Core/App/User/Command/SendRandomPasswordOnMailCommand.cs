using App.Common.Constants;
using App.Common.Models;
using App.Core.Common;
using App.Core.Interface;
using App.Core.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.User.Commond
{
    public class SendRandomPasswordOnMailCommand : IRequest<AppResponse>
    {
        public string Email { get; set; }
    }

    internal class SendRandomPasswordOnMailCommandHandler : IRequestHandler<SendRandomPasswordOnMailCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEmailSmtpService _emailService;
        private readonly IEncryptionService _encryptionService;

        public SendRandomPasswordOnMailCommandHandler(IAppDbContext appDbContext, IEmailSmtpService emailService, IEncryptionService encryptionService)
        {
            _appDbContext = appDbContext;
            _emailService = emailService;
            _encryptionService = encryptionService;
        }

        public async Task<AppResponse> Handle(SendRandomPasswordOnMailCommand request, CancellationToken cancellationToken)
        {
           var email = request.Email;

            var user = await _appDbContext.Set<Domain.Entities.User>()
                       .FirstOrDefaultAsync(u => u.Email == email);

            if (user is null)
                return AppResponse.Response(false,"Email is not Valid Email", HttpStatusCodes.NotFound);

            string randomPassword = GenerateRandomPassword.GeneratePassword();

            user.Password = _encryptionService.EncryptData(randomPassword);

            await _appDbContext.SaveChangesAsync(cancellationToken);

            _emailService.SendForgotedPassword(user.Email, user.FirstName, "Forgot Password Credentials", user.UserName, randomPassword);

            return AppResponse.Response(true, "Email Forgot Successfull",HttpStatusCodes.OK);

        }
    }
}
