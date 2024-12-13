using App.Core.Models.Specialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface ISpecialisationRepository
    {
       Task<IEnumerable<SpecializationDto>> GetAllSpecializationsAsync();
    }
}
