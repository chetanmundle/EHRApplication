using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Country
{
    public class CountryDto
    {
        public int CountryId { get; set; }
        public string Shortname { get; set; }
        public string CountryName { get; set; }
        public int PhoneCode { get; set; }
    }
}
