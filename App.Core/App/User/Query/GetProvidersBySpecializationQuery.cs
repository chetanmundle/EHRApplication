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
    public class GetProvidersBySpecializationQuery : IRequest<AppResponse<IEnumerable<GetProviderDto>>>
    {
        public int SpecialisationId { get; set; }
    }

    internal class GetProvidersBySpecializationQueryHandler : IRequestHandler<GetProvidersBySpecializationQuery,
       AppResponse<IEnumerable<GetProviderDto>>>
    {
        private readonly IUserRepository _userRepository;

        public GetProvidersBySpecializationQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<AppResponse<IEnumerable<GetProviderDto>>> Handle(GetProvidersBySpecializationQuery request, CancellationToken cancellationToken)
        {
            var specialisationId = request.SpecialisationId;

            IEnumerable<GetProviderDto> providers = await _userRepository.GetProvidersBySpecializationIdAsync(specialisationId);

            return AppResponse.Success(providers);
        }
    }

}
