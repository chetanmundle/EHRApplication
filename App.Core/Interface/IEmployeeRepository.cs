using App.Common.Models;
using App.Core.Models.Employee;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface IEmployeeRepository
    {
        Task<AppResponse<IEnumerable<EmpDto>>> GetAllUserAsync();
    }
}
