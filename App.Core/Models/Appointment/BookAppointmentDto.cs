using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Appointment
{
    public class BookAppointmentDto
    {
        public int? PatientId { get; set; }
        public int? ProviderId { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public string ChiefComplaint { get; set; }
        public TimeSpan? AppointmentTime { get; set; }
    }
}
