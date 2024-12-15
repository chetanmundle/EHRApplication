using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Appointment
{
    public class GetAppointmentDto
    {
        public int AppointmentId { get; set; }
        public int? PatientId { get; set; }
        public int? ProviderId { get; set; }
        public string ProviderName { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public TimeSpan? AppointmentTime { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public string AppointmentStatus { get; set; }
        public string ChiefComplaint { get; set; }
        public float? Fee { get; set; }
    }
}
