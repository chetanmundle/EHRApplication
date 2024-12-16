using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Appointment
{
    public class AppointmentAndSOAPNotesDto
    {
        public int AppointmentId { get; set; }
        public int? PatientId { get; set; }
        public int? ProviderId { get; set; }
        public string PatientName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string BloodGroup { get; set; }
        public string ProfileImage { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public TimeSpan? AppointmentTime { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public string AppointmentStatus { get; set; }
        public string ChiefComplaint { get; set; }
        public float? Fee { get; set; }
        public int? SOAPNotesId { get; set; }
        public string Subjective { get; set; }
        public string Objective { get; set; }
        public string Assessment { get; set; }
        public string Plan { get; set; }
    }
}
