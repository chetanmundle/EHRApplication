using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Appointment
{
    public class PaymentAndBookAppointmentDto
    {
        public int PatientId { get; set; }
        public int ProviderId { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public TimeSpan? AppointmentTime { get; set; }
        public string ChiefComplaint { get; set; }
        public string SourceToken { get; set; }
        public int Amount { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
    }
}
