using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Specialization;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class SpecialisationRepository : ISpecialisationRepository
    {
        private readonly IAppDbContext _appDbContext;

        public SpecialisationRepository(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<IEnumerable<SpecializationDto>> GetAllSpecializationsAsync()
        {
            var query = @"Select * from Specialisation";
            var conn = _appDbContext.GetConnection();

            var listOfSpecialization = await conn.QueryAsync<SpecializationDto>(query);

            return listOfSpecialization;
        }
    }
}
