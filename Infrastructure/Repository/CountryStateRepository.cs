using App.Common.Constants;
using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Country;
using App.Core.Models.State;
using Dapper;
using Domain.Entities;
using Mapster;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CountryStateRepository : ICountryStateRepository
    {
        private readonly IAppDbContext _appDbContext;

        public CountryStateRepository(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        //Get All Countries
        public async Task<AppResponse<IEnumerable<CountryDto>>> GetAllCountriesAsync()
        {
            var conn = _appDbContext.GetConnection();
            var query = "SELECT * FROM Countries";
            var countries = await conn.QueryAsync<Domain.Entities.Country>(query);
            return AppResponse.Success<IEnumerable<CountryDto>>(
                     countries.Adapt<IEnumerable<CountryDto>>(),
                     "Country Get Successfully",
                     HttpStatusCodes.OK
                );
        }


        //Get States by Country Id
        public async Task<AppResponse<IEnumerable<StateDto>>> GetStateByCountryuIdAsync(int countryId)
        {
            var conn = _appDbContext.GetConnection();
            var query = @"SELECT * FROM States Where CountryId = @CountryId";

            var states = await conn.QueryAsync<Domain.Entities.State>(query, new { CountryId  = countryId });
            var statesDto = states.Adapt<IEnumerable<StateDto>>();
            return AppResponse.Success<IEnumerable<StateDto>>( statesDto, "State Get Successfully", HttpStatusCodes.OK);

                                   
        }
    }
}
