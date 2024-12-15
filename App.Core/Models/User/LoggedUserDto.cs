using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.User
{
    public class LoggedUserDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string UserTypeName { get; set; }
        public string SpecialisationName { get; set; }
        public string ProfileImage { get; set; }
        public string Qualification { get; set; }
        public string RegistrationNumber { get; set; }
        public float? VisitingCharge { get; set; }
    }
}
