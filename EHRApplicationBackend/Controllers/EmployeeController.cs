using App.Common.Models;
using App.Core.App.Employee.Command;
using App.Core.Interface;
using App.Core.Models.Employee;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Threading.Tasks;

namespace EHRApplicationBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeController(IMediator mediator, IEmployeeRepository employeeRepository)
        {
            _mediator = mediator;
            _employeeRepository = employeeRepository;
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<AppResponse<EmpDto>>> CreateEmployee(CreateEmpDto emp)
        {
            var result = await _mediator.Send(new CreateEmpCommand { CreateEmpDto = emp });
            return Ok(result);
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<AppResponse<IEnumerable>>> GetAllEmployees()
        {
            var employee = await _employeeRepository.GetAllUserAsync();
            return Ok(employee);
        }
    }
}
