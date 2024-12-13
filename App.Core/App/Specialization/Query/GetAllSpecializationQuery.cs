using App.Common.Models;
using App.Core.Interface;
using App.Core.Models.Specialization;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Specialization.Query
{
    public class GetAllSpecializationQuery : IRequest<AppResponse<IEnumerable<SpecializationDto>>>
    {

    }

    internal class GetAllSpecializationQueryHandler : IRequestHandler<GetAllSpecializationQuery, AppResponse<IEnumerable<SpecializationDto>>>
    {
        private readonly ISpecialisationRepository _specialisationRepository;

        public GetAllSpecializationQueryHandler(ISpecialisationRepository specialisationRepository)
        {
            _specialisationRepository = specialisationRepository;
        }

        public async Task<AppResponse<IEnumerable<SpecializationDto>>> Handle(GetAllSpecializationQuery request, CancellationToken cancellationToken)
        {
            var specializationList = await _specialisationRepository.GetAllSpecializationsAsync();

            return AppResponse.Success(specializationList);
        }
    }
}
