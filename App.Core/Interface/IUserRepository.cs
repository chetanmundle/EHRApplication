using App.Core.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface IUserRepository
    {
        Task<IEnumerable<GetProviderDto>> GetProvidersBySpecializationIdAsync(int SpecialisationId);
    }
}
