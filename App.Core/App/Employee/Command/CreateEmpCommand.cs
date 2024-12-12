using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Employee;
using Mapster;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Employee.Command
{
    public class CreateEmpCommand : IRequest<AppResponse<EmpDto>>
    {
        public CreateEmpDto CreateEmpDto { get; set; }
    }

    internal class CreateEmpCommandHandler : IRequestHandler<CreateEmpCommand, AppResponse<EmpDto>>
    {
        private readonly IAppDbContext _appDbContext;

        public CreateEmpCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse<EmpDto>> Handle(CreateEmpCommand request, CancellationToken cancellationToken)
        {
            var empModel = request.CreateEmpDto;

            var user = empModel.Adapt<Domain.Entities.Employee>();

            await _appDbContext.Set<Domain.Entities.Employee>().AddAsync(user, cancellationToken);

            await _appDbContext.SaveChangesAsync(cancellationToken);

            return new AppResponse<EmpDto>()
            {
               
                IsSuccess = true,
                Message ="Successfully Created Data",
                StatusCode = 200,
                 Data = user.Adapt<EmpDto>(),
            };
        }
    }
}
