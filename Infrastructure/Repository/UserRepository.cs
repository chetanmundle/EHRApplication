using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.User;
using Dapper;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly IAppDbContext _appDbContext;

        public UserRepository(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<IEnumerable<GetProviderDto>> GetProvidersBySpecializationIdAsync(int SpecialisationId)
        {
            var query = SpecialisationId == 0 ?
                @"Select UserId, FirstName, LastName, VisitingCharge from Users where UserTypeId = 
                        (Select UserTypeId from UserTypes where UserTypeName =  'Provider')" :
                @"Select UserId, FirstName, LastName, VisitingCharge from Users where UserTypeId =
                         (Select UserTypeId from UserTypes where UserTypeName =  'Provider')
                         and SpecialisationId = @SpecialisationId";

            var conn = _appDbContext.GetConnection();

            var payload = new
            {
                SpecialisationId 
            };

            var providerList = await conn.QueryAsync<GetProviderDto>(query, payload);
            return providerList;
        }
    }
}
