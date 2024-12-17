using App.Common.Constants;
using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.User;
using App.Core.Models.Users;
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
    public class ChangePasswordCommand : IRequest<AppResponse>
    {
        public ChangePasswordDto ChangePassword { get; set; }
    }

    internal class ChangePasswordCommandHandlerHandler : IRequestHandler<ChangePasswordCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEncryptionService _encryptionService;

        public ChangePasswordCommandHandlerHandler(IAppDbContext appDbContext, IEncryptionService encryptionService)
        {
            _appDbContext = appDbContext;
            _encryptionService = encryptionService;
        }

        public async Task<AppResponse> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            var changePassDto = request.ChangePassword;

            if (!string.Equals(changePassDto.Password, changePassDto.ConfirmPassword))
            {
                return AppResponse.Response(false, "Password and ConfirmPassword Must Be same", HttpStatusCodes.BadRequest);
            }

            var user = await _appDbContext.Set<Domain.Entities.User>()
                             .FirstOrDefaultAsync(u => u.UserName == changePassDto.UserName, cancellationToken);

            if (user is null)
                return AppResponse.Response(false, "User with this UserName not Found", HttpStatusCodes.NotFound);

            user.Password = _encryptionService.EncryptData(changePassDto.Password);

            await _appDbContext.SaveChangesAsync(cancellationToken);

            return AppResponse.Response(true,"Password Change Successfull",HttpStatusCodes.OK);
            
        }
    }
}
