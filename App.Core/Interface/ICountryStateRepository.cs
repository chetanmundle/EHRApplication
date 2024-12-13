using App.Common.Models;
using App.Core.Models.Country;
using App.Core.Models.State;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface ICountryStateRepository
    {
        Task<AppResponse<IEnumerable<CountryDto>>> GetAllCountriesAsync();

        Task<AppResponse<IEnumerable<StateDto>>> GetStateByCountryuIdAsync(int countryId);
    }
}
