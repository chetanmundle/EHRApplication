using App.Common.Models;
using App.Core.Interface;
using App.Core.Models.User;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.User.Query
{
    public class GetPatientNameIdQuery : IRequest<AppResponse<IEnumerable<PatientNameIdDto>>>
    {
    }

    internal class GetPatientNameIdQueryHandler : IRequestHandler<GetPatientNameIdQuery, AppResponse<IEnumerable<PatientNameIdDto>>>
    {
        private readonly IUserRepository _userRepository;

        public GetPatientNameIdQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<AppResponse<IEnumerable<PatientNameIdDto>>> Handle(GetPatientNameIdQuery request, CancellationToken cancellationToken)
        {
            var patientlist = await _userRepository.GetPatientNameIdAsync();
            return AppResponse.Success(patientlist);
        }
    }
}
