using App.Common.Constants;
using App.Common.Models;
using App.Core.Common;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.User;
using App.Core.Validators.User;
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
    public class RegisterProviderCommand : IRequest<AppResponse>
    {
        public CreateProviderDto CreateProviderDto { get; set; }
    }

    internal class RegisterProviderCommandHandler : IRequestHandler<RegisterProviderCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEncryptionService _encryptionService;
        private readonly IEmailSmtpService _emailSmtpService;

        public RegisterProviderCommandHandler(IAppDbContext appDbContext,
            IEncryptionService encryptionService, IEmailSmtpService emailSmtpService)
        {
            _appDbContext = appDbContext;
            _encryptionService = encryptionService;
            _emailSmtpService = emailSmtpService;
        }

        public async Task<AppResponse> Handle(RegisterProviderCommand request, CancellationToken cancellationToken)
        {
            var userDto = request.CreateProviderDto;
            var validator = new CreateProviderDtoValidator();
            var validate = validator.Validate(userDto);

            if (!validate.IsValid)
            {
                var errorMessage = validate.Errors[0].ErrorMessage;
                return AppResponse.Response(false, errorMessage, HttpStatusCodes.BadRequest);
            }

            var user = userDto.Adapt<Domain.Entities.User>();

            // Check Email is Exist
            var isEmailExist = await _appDbContext.Set<Domain.Entities.User>()
                              .FirstOrDefaultAsync(u => user.Email == u.Email, cancellationToken);
            if (isEmailExist is not null)
            {
                return AppResponse.Response(false, "Email is Already Exist", HttpStatusCodes.Conflict);
            }

            // Username create 
            user.UserName = ("PR_" + user.FirstName + user.LastName[0] + user.DateOfBirth.Value.ToString("ddMMyy")).ToUpper();
            var password = GenerateRandomPassword.GeneratePassword();

            user.Password = _encryptionService.EncryptData(password);

            //Finding UserType and Send
            var userType = await _appDbContext.Set<Domain.Entities.UserType>()
                                 .FirstOrDefaultAsync(ut => ut.UserTypeName == "Provider");
            if (userType is null)
            {
                return AppResponse.Response(false, "No UserType Found", HttpStatusCodes.NotFound);
            }
            user.UserType = userType;

            // finding specialization
            var specialization = await _appDbContext.Set<Domain.Entities.Specialisation>()
                                      .FirstOrDefaultAsync(sp => sp.SpecialisationId == user.SpecialisationId,
                                      cancellationToken);
            if (specialization is null)
            {
                return AppResponse.Response(false, "No Specialization Found", HttpStatusCodes.NotFound);
            }
            user.Specialisation = specialization;

            // Checking username is already exist
            var coutUsernameStartsWith = await _appDbContext.Set<Domain.Entities.User>()
                                              .CountAsync(u => u.UserName.StartsWith(user.UserName), cancellationToken);

            if (coutUsernameStartsWith > 0)
            {
                user.UserName = user.UserName.ToUpper() + coutUsernameStartsWith.ToString();
            }

            await _appDbContext.Set<Domain.Entities.User>()
                 .AddAsync(user, cancellationToken);
            await _appDbContext.SaveChangesAsync(cancellationToken);

            _emailSmtpService.SendWlcomeEmail(user.Email, user.FirstName + user.LastName, "Account Opening  Mail", user.UserName, password);

            return AppResponse.Response(true, "User Register Successfully", HttpStatusCodes.OK);
        }
    }
}
