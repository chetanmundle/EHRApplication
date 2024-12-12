using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateOfBirth {  get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string Gender { get; set; }
        public string BloodGroup { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public int? StateId { get; set; }
        public int? CountryId { get; set; }
        public int? ZipCode { get; set; }
        [ForeignKey("UserType")]
        public int? UserTypeId { get; set; }
        public string Qualification {  get; set; }   // for provider
        [ForeignKey("Specialisation")]
        public int? SpecialisationId { get; set; }  // for provider
        public string RegistrationNumber { get; set; }  // for provider
        public float? VisitingCharge { get; set; }  // for provider
        public string ProfileImage { get; set; }
        public Specialisation Specialisation { get; set; }
        public UserType UserType { get; set; }
    }
}
