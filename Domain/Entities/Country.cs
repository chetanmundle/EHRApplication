using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Country
    {
        [Key]
        public int CountryId { get; set; }
        public string Shortname { get; set; }
        public string CountryName { get; set; }
        public int PhoneCode { get; set; }
    }
}
