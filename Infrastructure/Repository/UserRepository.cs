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
            var conn = _appDbContext.GetConnection();
            var query =  @"Select UserId, FirstName, LastName, VisitingCharge from Users where UserTypeId =
                         (Select UserTypeId from UserTypes where UserTypeName =  'Provider')
                         and SpecialisationId = @SpecialisationId";

            if(SpecialisationId == 0)
            {
                query = @"Select UserId, FirstName, LastName, VisitingCharge from Users where UserTypeId = 
                        (Select UserTypeId from UserTypes where UserTypeName =  'Provider')";
                var result = await conn.QueryAsync<GetProviderDto>(query);
                return result;
            }          

            var payload = new
            {
                SpecialisationId 
            };

            var providerList = await conn.QueryAsync<GetProviderDto>(query, payload);
            return providerList;
        }

        public async Task<IEnumerable<PatientNameIdDto>> GetPatientNameIdAsync()
        {
            var query = @"Select UserId, FirstName, LastName from Users where UserTypeId = 
                        (Select UserTypeId from UserTypes where UserTypeName =  'Patient')";

            var conn = _appDbContext.GetConnection();

            var patientList = await conn.QueryAsync<PatientNameIdDto>(query);
            return patientList;
        }

        public async Task<UserDto> GetUserByUserIdAsync(int userId)
        {
            var query = @"Select * from Users where UserId = @UserId";
            var conn = _appDbContext.GetConnection();

            var payload = new
            {
                UserId = userId
            };
            var user = await conn.QueryFirstOrDefaultAsync<UserDto>(query, payload);
            return user;
        }
    }
}
