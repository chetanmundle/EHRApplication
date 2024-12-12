using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Employee;
using Dapper;
using Mapster;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace Infrastructure.Repository
{
    public class EmployeeRepository: IEmployeeRepository
    {
        public readonly IAppDbContext _appDbContext;

        public EmployeeRepository(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse<IEnumerable<EmpDto>>> GetAllUserAsync()
        {
            var query = "SELECT * FROM Employees";
            var con = _appDbContext.GetConnection();
            var employees = await con.QueryAsync<Domain.Entities.Employee>(query);
            return new AppResponse<IEnumerable<EmpDto>>
            {
                IsSuccess = true,
                StatusCode = 200,
                Data = employees.Adapt<IEnumerable<EmpDto>>()
            };
        }
    }
}
