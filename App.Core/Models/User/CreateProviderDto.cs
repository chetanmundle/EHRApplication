using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.User
{
    public class CreateProviderDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public string BloodGroup { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public int? StateId { get; set; }
        public int? CountryId { get; set; }
        public int? ZipCode { get; set; }
        public string Qualification { get; set; }   
        public int? SpecialisationId { get; set; }  
        public string RegistrationNumber { get; set; }  
        public float? VisitingCharge { get; set; }  
        public string ProfileImage { get; set; }
    }
}
