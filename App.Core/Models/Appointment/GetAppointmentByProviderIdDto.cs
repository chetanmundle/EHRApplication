using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Appointment
{
    public class GetAppointmentByProviderIdDto
    {
        public int AppointmentId { get; set; }
        public int? PatientId { get; set; }
        public int? ProviderId { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public TimeSpan? AppointmentTime { get; set; }
        public string AppointmentStatus { get; set; }
        public string ChiefComplaint { get; set; }
        public float? Fee { get; set; }
        public string PatientName { get; set; }
        public string ProfileImage { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; }
        public string BloodGroup { get; set; }
    }
}
